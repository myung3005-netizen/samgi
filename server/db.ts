import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Classroom, Participant, RevisionRecord, ListeningQuiz, TravelCard, TravelData, TeacherClassroomData, VoteResult, ClassroomSummary } from '../src/types';

interface InternalVote {
  classroomId: string;
  voterParticipantId: string;
  targetParticipantId: string;
  timestamp: number;
}

interface DatabaseSchema {
  classrooms: Record<string, Classroom>; // key: roomCode
  participants: Record<string, Participant>; // key: id
  participantTokens: Record<string, string>; // sessionToken -> participantId
  revisions: Record<string, RevisionRecord[]>; // participantId -> RevisionRecord[]
  quizzes: Record<string, ListeningQuiz>; // participantId -> ListeningQuiz
  votes: Record<string, InternalVote[]>; // roomCode -> InternalVote[]
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'classroom_db.json');

class Database {
  private data: DatabaseSchema = {
    classrooms: {},
    participants: {},
    participantTokens: {},
    revisions: {},
    quizzes: {},
    votes: {},
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // ensure unique
    if (this.data.classrooms[code]) {
      return this.generateRoomCode();
    }
    return code;
  }

  public createClassroom(title: string = '나의 꿈의 여행', customCode?: string): Classroom {
    let roomCode = customCode ? customCode.trim().toUpperCase() : '';
    if (!roomCode) {
      roomCode = this.generateRoomCode();
    }

    if (this.data.classrooms[roomCode]) {
      throw new Error('CODE_ALREADY_EXISTS');
    }

    const classroom: Classroom = {
      id: crypto.randomUUID(),
      roomCode,
      title: title.trim() || '나의 꿈의 여행',
      createdAt: Date.now(),
      cardRevealState: false,
      votingClosed: false,
    };
    this.data.classrooms[roomCode] = classroom;
    this.data.votes[roomCode] = [];
    this.save();
    return classroom;
  }

  public deleteClassroom(roomCode: string): boolean {
    const cleanRoomCode = roomCode.toUpperCase().trim();
    const classroom = this.data.classrooms[cleanRoomCode];
    if (!classroom) return false;

    // Find all participants of this classroom
    const classroomParticipantIds = Object.values(this.data.participants)
      .filter((p) => p.classroomId === classroom.id)
      .map((p) => p.id);

    // Delete participants and related items
    for (const pid of classroomParticipantIds) {
      delete this.data.participants[pid];
      delete this.data.revisions[pid];
      delete this.data.quizzes[pid];
    }

    // Delete tokens for those participants
    for (const [token, pid] of Object.entries(this.data.participantTokens)) {
      if (classroomParticipantIds.includes(pid)) {
        delete this.data.participantTokens[token];
      }
    }

    // Delete votes and classroom
    delete this.data.votes[cleanRoomCode];
    delete this.data.classrooms[cleanRoomCode];

    this.save();
    return true;
  }

  public getAllClassrooms(): ClassroomSummary[] {
    const classrooms = Object.values(this.data.classrooms);
    return classrooms
      .map((c) => {
        const parts = Object.values(this.data.participants).filter((p) => p.classroomId === c.id);
        const completedCount = parts.filter((p) => p.status === 'completed').length;
        const revisingCount = parts.filter((p) => p.status === 'revising').length;
        const votes = this.data.votes[c.roomCode] || [];
        return {
          id: c.id,
          roomCode: c.roomCode,
          title: c.title,
          createdAt: c.createdAt,
          cardRevealState: c.cardRevealState,
          votingClosed: c.votingClosed,
          participantsCount: parts.length,
          completedCount,
          revisingCount,
          totalVotes: votes.length,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  public getClassroom(roomCode: string): Classroom | null {
    if (!roomCode) return null;
    return this.data.classrooms[roomCode.toUpperCase().trim()] || null;
  }

  public joinParticipant(roomCode: string, displayName: string): { participant: Participant; sessionToken: string; isRejoined: boolean } {
    const cleanRoomCode = roomCode.toUpperCase().trim();
    const classroom = this.getClassroom(cleanRoomCode);
    if (!classroom) {
      throw new Error('ROOM_NOT_FOUND');
    }

    const cleanName = displayName.trim();
    if (!cleanName) {
      throw new Error('NAME_REQUIRED');
    }

    // Check if participant already exists in this room with same name (Case-insensitive) -> RESTORE WORK
    const existingInRoom = Object.values(this.data.participants).find(
      (p) => p.classroomId === classroom.id && p.displayName.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingInRoom) {
      // Find existing token or generate a new session token
      let sessionToken = Object.entries(this.data.participantTokens).find(([, pid]) => pid === existingInRoom.id)?.[0];
      if (!sessionToken) {
        sessionToken = crypto.randomBytes(24).toString('hex');
        this.data.participantTokens[sessionToken] = existingInRoom.id;
        this.save();
      }
      existingInRoom.revisionHistory = this.data.revisions[existingInRoom.id] || [];
      return { participant: existingInRoom, sessionToken, isRejoined: true };
    }

    const participantId = crypto.randomUUID();
    const sessionToken = crypto.randomBytes(24).toString('hex');

    const participant: Participant = {
      id: participantId,
      classroomId: classroom.id,
      displayName: cleanName,
      joinedAt: Date.now(),
      status: 'planning',
      sentences: [],
      fullScript: '',
      revisionCount: 0,
      revisionHistory: [],
    };

    this.data.participants[participantId] = participant;
    this.data.participantTokens[sessionToken] = participantId;
    this.data.revisions[participantId] = [];
    this.save();

    return { participant, sessionToken, isRejoined: false };
  }

  public getParticipantByToken(sessionToken: string): { participant: Participant; classroom: Classroom } | null {
    if (!sessionToken) return null;
    const participantId = this.data.participantTokens[sessionToken];
    if (!participantId) return null;

    const participant = this.data.participants[participantId];
    if (!participant) return null;

    const classroom = Object.values(this.data.classrooms).find((c) => c.id === participant.classroomId);
    if (!classroom) return null;

    // Attach current revision history
    participant.revisionHistory = this.data.revisions[participantId] || [];

    return { participant, classroom };
  }

  public getParticipantById(participantId: string): Participant | null {
    const participant = this.data.participants[participantId];
    if (!participant) return null;
    participant.revisionHistory = this.data.revisions[participantId] || [];
    return participant;
  }

  public updateParticipantTravelData(participantId: string, travelData: TravelData): void {
    const participant = this.data.participants[participantId];
    if (!participant) return;
    participant.travelData = travelData;
    this.save();
  }

  public updateParticipantScript(participantId: string, sentences: string[], fullScript: string): void {
    const participant = this.data.participants[participantId];
    if (!participant) return;
    participant.sentences = sentences;
    participant.fullScript = fullScript;
    if (participant.status === 'planning') {
      participant.status = 'revising';
    }
    this.save();
  }

  public addRevision(
    participantId: string,
    sentenceIndex: number,
    originalSentence: string,
    studentRequest: string,
    revisedSentence: string,
    fullScriptAfter: string
  ): RevisionRecord {
    const participant = this.data.participants[participantId];
    if (!participant) {
      throw new Error('PARTICIPANT_NOT_FOUND');
    }

    if (!this.data.revisions[participantId]) {
      this.data.revisions[participantId] = [];
    }

    const revisionNumber = (participant.revisionCount || 0) + 1;
    const record: RevisionRecord = {
      id: crypto.randomUUID(),
      revisionNumber,
      timestamp: Date.now(),
      sentenceIndex,
      originalSentence,
      studentRequest,
      revisedSentence,
      fullScriptAfter,
    };

    this.data.revisions[participantId].push(record);
    participant.revisionCount = revisionNumber;
    participant.sentences[sentenceIndex] = revisedSentence;
    participant.fullScript = fullScriptAfter;
    participant.revisionHistory = this.data.revisions[participantId];
    this.save();

    return record;
  }

  public finalizeParticipant(
    participantId: string,
    finalScript: string,
    quiz: { q1: string; a1: string; q2: string; a2: string; q3: string; a3: string },
    travelCard: TravelCard
  ): void {
    const participant = this.data.participants[participantId];
    if (!participant) return;

    participant.status = 'completed';
    participant.finalScript = finalScript;
    participant.completedAt = Date.now();
    participant.travelCard = travelCard;

    const listeningQuiz: ListeningQuiz = {
      id: crypto.randomUUID(),
      participantId,
      displayName: participant.displayName,
      destination: travelCard.destination,
      q1: quiz.q1,
      a1: quiz.a1,
      q2: quiz.q2,
      a2: quiz.a2,
      q3: quiz.q3,
      a3: quiz.a3,
      createdAt: Date.now(),
    };

    this.data.quizzes[participantId] = listeningQuiz;
    this.save();
  }

  public revealCards(roomCode: string): void {
    const classroom = this.getClassroom(roomCode);
    if (!classroom) return;
    classroom.cardRevealState = true;
    this.save();
  }

  public closeVoting(roomCode: string): void {
    const classroom = this.getClassroom(roomCode);
    if (!classroom) return;
    classroom.votingClosed = true;
    this.save();
  }

  public vote(roomCode: string, voterId: string, targetId: string): { success: boolean; message?: string } {
    const classroom = this.getClassroom(roomCode);
    if (!classroom) {
      return { success: false, message: 'ROOM_NOT_FOUND' };
    }

    if (!classroom.cardRevealState) {
      return { success: false, message: 'VOTING_NOT_OPEN' };
    }

    if (classroom.votingClosed) {
      return { success: false, message: 'VOTING_CLOSED' };
    }

    if (voterId === targetId) {
      return { success: false, message: 'CANNOT_VOTE_SELF' };
    }

    const voter = this.data.participants[voterId];
    if (!voter) {
      return { success: false, message: 'VOTER_NOT_FOUND' };
    }

    const target = this.data.participants[targetId];
    if (!target) {
      return { success: false, message: 'TARGET_NOT_FOUND' };
    }

    if (!this.data.votes[classroom.roomCode]) {
      this.data.votes[classroom.roomCode] = [];
    }

    const existingVote = this.data.votes[classroom.roomCode].find((v) => v.voterParticipantId === voterId);
    if (existingVote || voter.votedForParticipantId) {
      return { success: false, message: 'ALREADY_VOTED' };
    }

    this.data.votes[classroom.roomCode].push({
      classroomId: classroom.id,
      voterParticipantId: voterId,
      targetParticipantId: targetId,
      timestamp: Date.now(),
    });

    voter.votedForParticipantId = targetId;
    this.save();

    return { success: true };
  }

  public getStudentCards(roomCode: string): TravelCard[] {
    const classroom = this.getClassroom(roomCode);
    if (!classroom || !classroom.cardRevealState) return [];

    const participants = Object.values(this.data.participants).filter(
      (p) => p.classroomId === classroom.id && p.status === 'completed' && p.travelCard
    );

    return participants.map((p) => p.travelCard!);
  }

  public getTeacherData(roomCode: string): TeacherClassroomData | null {
    const classroom = this.getClassroom(roomCode);
    if (!classroom) return null;

    const participants = Object.values(this.data.participants).filter((p) => p.classroomId === classroom.id);

    // populate revisions
    participants.forEach((p) => {
      p.revisionHistory = this.data.revisions[p.id] || [];
    });

    const quizzes: Record<string, ListeningQuiz> = {};
    participants.forEach((p) => {
      if (this.data.quizzes[p.id]) {
        quizzes[p.id] = this.data.quizzes[p.id];
      }
    });

    const votes = this.data.votes[classroom.roomCode] || [];
    const voteCountMap: Record<string, number> = {};

    participants.forEach((p) => {
      voteCountMap[p.id] = 0;
    });

    votes.forEach((v) => {
      voteCountMap[v.targetParticipantId] = (voteCountMap[v.targetParticipantId] || 0) + 1;
    });

    const voteResults: VoteResult[] = participants
      .filter((p) => p.status === 'completed')
      .map((p) => {
        const dest = p.travelData?.customDestination || p.travelData?.destination || '여행지 미정';
        const thm = p.travelData?.customPurpose || p.travelData?.purpose || '자유 여행';
        return {
          participantId: p.id,
          displayName: p.displayName,
          destination: dest,
          theme: thm,
          voteCount: voteCountMap[p.id] || 0,
          rank: 0,
        };
      })
      .sort((a, b) => b.voteCount - a.voteCount);

    // Assign rank
    voteResults.forEach((vr, idx) => {
      vr.rank = idx + 1;
    });

    return {
      classroom,
      participants,
      quizzes,
      voteResults,
      totalVotes: votes.length,
      allClassrooms: this.getAllClassrooms(),
    };
  }
}

export const db = new Database();
