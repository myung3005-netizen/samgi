import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateInitialScript, reviseSentence, generateListeningQuiz, generateTravelCard } from './server/geminiService';

dotenv.config();

const PORT = 3000;
const TEACHER_PASSWORD = '0853';
const TEACHER_AUTH_TOKEN = 'secret-teacher-session-token-0853';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Teacher authentication middleware
  const requireTeacherAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers['x-teacher-token'];
    if (token !== TEACHER_AUTH_TOKEN) {
      return res.status(401).json({ error: 'UNAUTHORIZED_TEACHER' });
    }
    next();
  };

  // Student authentication middleware
  const getStudentSession = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers['x-session-token'] as string;
    if (!token) {
      return res.status(401).json({ error: 'MISSING_SESSION_TOKEN' });
    }
    const session = db.getParticipantByToken(token);
    if (!session) {
      return res.status(401).json({ error: 'INVALID_SESSION' });
    }
    (req as any).student = session.participant;
    (req as any).classroom = session.classroom;
    next();
  };

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: Date.now() });
  });

  // --- Teacher Endpoints ---

  app.post('/api/teacher/login', (req, res) => {
    const { password } = req.body;
    if (password === TEACHER_PASSWORD) {
      return res.json({ success: true, teacherToken: TEACHER_AUTH_TOKEN });
    }
    return res.status(401).json({ success: false, error: 'INVALID_PASSWORD' });
  });

  app.get('/api/teacher/classrooms', requireTeacherAuth, (req, res) => {
    const classrooms = db.getAllClassrooms();
    res.json({ classrooms });
  });

  app.post('/api/teacher/create-room', requireTeacherAuth, (req, res) => {
    try {
      const { title, roomCode } = req.body;
      const classroom = db.createClassroom(title || '나의 꿈의 여행', roomCode);
      res.json({ classroom, allClassrooms: db.getAllClassrooms() });
    } catch (err: any) {
      if (err.message === 'CODE_ALREADY_EXISTS') {
        return res.status(409).json({ error: 'CODE_ALREADY_EXISTS' });
      }
      res.status(500).json({ error: 'INTERNAL_ERROR', detail: err.message });
    }
  });

  app.delete('/api/teacher/classroom/:code', requireTeacherAuth, (req, res) => {
    const code = req.params.code;
    const success = db.deleteClassroom(code);
    const allClassrooms = db.getAllClassrooms();
    res.json({ success, allClassrooms });
  });

  app.get('/api/teacher/classroom/:code', requireTeacherAuth, (req, res) => {
    const code = req.params.code;
    const data = db.getTeacherData(code);
    if (!data) {
      // If code not found, return empty classroom state with allClassrooms list
      return res.json({
        classroom: null,
        participants: [],
        quizzes: {},
        voteResults: [],
        totalVotes: 0,
        allClassrooms: db.getAllClassrooms(),
      });
    }
    res.json(data);
  });

  app.post('/api/teacher/classroom/:code/reveal-cards', requireTeacherAuth, (req, res) => {
    const code = req.params.code;
    db.revealCards(code);
    const data = db.getTeacherData(code);
    res.json({ success: true, data });
  });

  app.post('/api/teacher/classroom/:code/close-voting', requireTeacherAuth, (req, res) => {
    const code = req.params.code;
    db.closeVoting(code);
    const data = db.getTeacherData(code);
    res.json({ success: true, data });
  });

  // --- Student Endpoints ---

  app.post('/api/student/join', (req, res) => {
    try {
      const { roomCode, displayName } = req.body;
      if (!roomCode || !displayName) {
        return res.status(400).json({ error: 'MISSING_FIELDS' });
      }

      const { participant, sessionToken, isRejoined } = db.joinParticipant(roomCode, displayName);
      const classroom = db.getClassroom(roomCode);

      res.json({
        participant,
        sessionToken,
        classroom,
        isRejoined,
      });
    } catch (err: any) {
      const msg = err.message || 'UNKNOWN_ERROR';
      if (msg === 'ROOM_NOT_FOUND') {
        return res.status(404).json({ error: 'ROOM_NOT_FOUND' });
      }
      if (msg === 'NAME_REQUIRED') {
        return res.status(400).json({ error: 'NAME_REQUIRED' });
      }
      res.status(500).json({ error: 'INTERNAL_ERROR', detail: msg });
    }
  });

  app.get('/api/student/session', getStudentSession, (req, res) => {
    const participant = (req as any).student;
    const classroom = (req as any).classroom;
    res.json({ participant, classroom });
  });

  app.post('/api/student/save-travel', getStudentSession, (req, res) => {
    const participant = (req as any).student;
    const { travelData } = req.body;
    db.updateParticipantTravelData(participant.id, travelData);
    res.json({ success: true });
  });

  app.post('/api/student/generate-script', getStudentSession, async (req, res) => {
    try {
      const participant = (req as any).student;
      const { travelData } = req.body;

      if (travelData) {
        db.updateParticipantTravelData(participant.id, travelData);
      }

      const activeTravel = travelData || participant.travelData || {};
      const sentences = await generateInitialScript(activeTravel, participant.displayName);
      const fullScript = sentences.join(' ');

      db.updateParticipantScript(participant.id, sentences, fullScript);

      res.json({
        sentences,
        fullScript,
      });
    } catch (err: any) {
      console.error('Error generating script:', err);
      res.status(500).json({ error: 'FAILED_TO_GENERATE_SCRIPT' });
    }
  });

  app.post('/api/student/revise-sentence', getStudentSession, async (req, res) => {
    try {
      const participant = (req as any).student;
      const { sentenceIndex, studentRequest } = req.body;

      if (typeof sentenceIndex !== 'number' || !studentRequest) {
        return res.status(400).json({ error: 'INVALID_REQUEST' });
      }

      const currentSentences = [...participant.sentences];
      const originalSentence = currentSentences[sentenceIndex] || '';

      const revisedSentence = await reviseSentence(currentSentences, sentenceIndex, studentRequest);

      currentSentences[sentenceIndex] = revisedSentence;
      const fullScriptAfter = currentSentences.join(' ');

      const record = db.addRevision(
        participant.id,
        sentenceIndex,
        originalSentence,
        studentRequest,
        revisedSentence,
        fullScriptAfter
      );

      res.json({
        revisedSentence,
        sentenceIndex,
        sentences: currentSentences,
        fullScript: fullScriptAfter,
        revisionRecord: record,
        revisionCount: participant.revisionCount + 1,
      });
    } catch (err: any) {
      console.error('Error revising sentence:', err);
      res.status(500).json({ error: 'FAILED_TO_REVISE_SENTENCE' });
    }
  });

  app.post('/api/student/finalize-script', getStudentSession, async (req, res) => {
    try {
      const participant = (req as any).student;
      const currentSentences = participant.sentences || [];
      const finalScript = currentSentences.join(' ');
      const travelData = participant.travelData || {};

      // 1. Generate 3 Listening Quiz questions strictly from the final script
      const quiz = await generateListeningQuiz(finalScript, participant.displayName, travelData);

      // 2. Generate concise Travel Card
      const travelCard = await generateTravelCard(finalScript, travelData, participant.displayName, participant.id);

      // 3. Finalize in DB
      db.finalizeParticipant(participant.id, finalScript, quiz, travelCard);

      res.json({
        success: true,
        finalScript,
        travelCard,
        quiz,
      });
    } catch (err: any) {
      console.error('Error finalizing script:', err);
      res.status(500).json({ error: 'FAILED_TO_FINALIZE_SCRIPT' });
    }
  });

  app.get('/api/student/travel-cards', getStudentSession, (req, res) => {
    const classroom = (req as any).classroom;
    const cards = db.getStudentCards(classroom.roomCode);
    res.json({
      cardsRevealed: classroom.cardRevealState,
      votingClosed: classroom.votingClosed,
      cards,
    });
  });

  app.post('/api/student/vote', getStudentSession, (req, res) => {
    const participant = (req as any).student;
    const classroom = (req as any).classroom;
    const { targetParticipantId } = req.body;

    if (!targetParticipantId) {
      return res.status(400).json({ error: 'TARGET_REQUIRED' });
    }

    const result = db.vote(classroom.roomCode, participant.id, targetParticipantId);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json({ success: true });
  });

  // --- Vite & Static Asset Handling ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
