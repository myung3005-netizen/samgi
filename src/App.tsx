import React, { useState, useEffect, useCallback } from 'react';
import {
  Language,
  StudentStage,
  Participant,
  Classroom,
  TravelData,
  TeacherClassroomData,
  TravelCard,
} from './types';
import { translations } from './translations';
import { Navbar } from './components/Navbar';
import { StudentJoin } from './components/StudentJoin';
import { TravelQuestionnaire } from './components/TravelQuestionnaire';
import { TravelSummary } from './components/TravelSummary';
import { ScriptEditor } from './components/ScriptEditor';
import { PresenterWaitingView } from './components/PresenterWaitingView';
import { VotingView } from './components/VotingView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AlertCircle, LogOut } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const t = translations[language];

  // Student State
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return sessionStorage.getItem('student_session_token');
  });
  const [studentStage, setStudentStage] = useState<StudentStage>('join');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [temporaryTravelData, setTemporaryTravelData] = useState<TravelData | null>(null);
  const [travelCards, setTravelCards] = useState<TravelCard[]>([]);
  const [cardsRevealed, setCardsRevealed] = useState<boolean>(false);
  const [votingClosed, setVotingClosed] = useState<boolean>(false);
  const [rejoinedNotice, setRejoinedNotice] = useState<string | null>(null);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);

  // Student Loading & Errors
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isRevisingSentence, setIsRevisingSentence] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Teacher State - password required every time
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [teacherToken, setTeacherToken] = useState<string | null>(null);
  const [teacherClassroomData, setTeacherClassroomData] = useState<TeacherClassroomData | null>(null);
  const [isTeacherActionLoading, setIsTeacherActionLoading] = useState(false);

  // 1. Initial Session Restore (if sessionToken exists in sessionStorage)
  useEffect(() => {
    if (!sessionToken) return;

    const restoreSession = async () => {
      try {
        const res = await fetch('/api/student/session', {
          headers: { 'x-session-token': sessionToken },
        });

        if (!res.ok) {
          sessionStorage.removeItem('student_session_token');
          setSessionToken(null);
          setStudentStage('join');
          return;
        }

        const data = await res.json();
        setParticipant(data.participant);
        setClassroom(data.classroom);

        // Resume correct stage based on status
        if (data.participant.status === 'completed') {
          if (data.classroom.cardRevealState) {
            setCardsRevealed(true);
            setVotingClosed(data.classroom.votingClosed);
            setStudentStage('voting');
          } else {
            setStudentStage('waiting');
          }
        } else if (data.participant.status === 'revising' && data.participant.sentences?.length > 0) {
          setStudentStage('editor');
        } else if (data.participant.travelData) {
          setTemporaryTravelData(data.participant.travelData);
          setStudentStage('summary');
        } else {
          setStudentStage('questionnaire');
        }
      } catch (err) {
        console.error('Session restore error:', err);
        sessionStorage.removeItem('student_session_token');
        setSessionToken(null);
        setStudentStage('join');
      }
    };

    restoreSession();
  }, [sessionToken]);

  // 2. Poll for cards and voting status if waiting or voting
  const fetchTravelCards = useCallback(async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch('/api/student/cards', {
        headers: { 'x-session-token': sessionToken },
      });
      if (res.ok) {
        const data = await res.json();
        setTravelCards(data.cards || []);
        setCardsRevealed(data.cardsRevealed);
        setVotingClosed(data.votingClosed);

        // If cards are revealed and we are waiting, auto-advance or let user know
        if (data.cardsRevealed && studentStage === 'waiting') {
          setCardsRevealed(true);
        }
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
  }, [sessionToken, studentStage]);

  useEffect(() => {
    if (!sessionToken || (studentStage !== 'waiting' && studentStage !== 'voting')) return;
    fetchTravelCards();
    const interval = setInterval(() => {
      fetchTravelCards();
    }, 3500);
    return () => clearInterval(interval);
  }, [sessionToken, studentStage, fetchTravelCards]);

  // 3. Teacher Dashboard Data Fetcher
  const fetchTeacherData = useCallback(async () => {
    if (!teacherToken) return;
    try {
      const currentCode = teacherClassroomData?.classroom?.roomCode || localStorage.getItem('last_room_code') || 'DEFAULT';

      const res = await fetch(`/api/teacher/classroom/${currentCode}`, {
        headers: { 'x-teacher-token': teacherToken },
      });
      if (res.ok) {
        const data = await res.json();
        setTeacherClassroomData(data);
        if (data.classroom?.roomCode) {
          localStorage.setItem('last_room_code', data.classroom.roomCode);
        }
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    }
  }, [teacherToken, teacherClassroomData?.classroom?.roomCode]);

  useEffect(() => {
    if (isTeacherMode && teacherToken) {
      fetchTeacherData();
    }
  }, [isTeacherMode, teacherToken, fetchTeacherData]);

  // --- Student Handlers ---

  const handleStudentJoin = async (roomCode: string, displayName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setRejoinedNotice(null);
    try {
      const res = await fetch('/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, displayName }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'ROOM_NOT_FOUND') {
          setErrorMsg(t.errorRoomNotFound);
        } else if (data.error === 'NAME_REQUIRED') {
          setErrorMsg(t.errorNameRequired);
        } else {
          setErrorMsg(t.errorGeneric);
        }
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem('student_session_token', data.sessionToken);
      setSessionToken(data.sessionToken);
      setParticipant(data.participant);
      setClassroom(data.classroom);

      if (data.isRejoined) {
        setRejoinedNotice(t.rejoinedWelcome);
        setTimeout(() => setRejoinedNotice(null), 4000);
      }

      // Resume exact state
      if (data.participant.status === 'completed') {
        if (data.classroom.cardRevealState) {
          setCardsRevealed(true);
          setVotingClosed(data.classroom.votingClosed);
          setStudentStage('voting');
        } else {
          setStudentStage('waiting');
        }
      } else if (data.participant.status === 'revising' && data.participant.sentences?.length > 0) {
        setStudentStage('editor');
      } else if (data.participant.travelData) {
        setTemporaryTravelData(data.participant.travelData);
        setStudentStage('summary');
      } else {
        setStudentStage('questionnaire');
      }
    } catch (err) {
      console.error('Join error:', err);
      setErrorMsg(t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionnaireComplete = (data: TravelData) => {
    setTemporaryTravelData(data);
    setStudentStage('summary');

    // Persist travel data to server
    if (sessionToken) {
      fetch('/api/student/save-travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': sessionToken,
        },
        body: JSON.stringify({ travelData: data }),
      }).catch(console.error);
    }
  };

  const handleGenerateScript = async () => {
    if (!sessionToken || !temporaryTravelData) return;
    setIsGeneratingScript(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/student/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': sessionToken,
        },
        body: JSON.stringify({ travelData: temporaryTravelData }),
      });

      if (!res.ok) {
        throw new Error('FAILED_TO_GENERATE');
      }

      const data = await res.json();
      if (participant) {
        setParticipant({
          ...participant,
          sentences: data.sentences,
          fullScript: data.fullScript,
          status: 'revising',
        });
      }
      setStudentStage('editor');
    } catch (err) {
      console.error('Error generating script:', err);
      setErrorMsg(t.errorGeneric);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleReviseSentence = async (sentenceIndex: number, request: string) => {
    if (!sessionToken) return;
    setIsRevisingSentence(true);
    try {
      const res = await fetch('/api/student/revise-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': sessionToken,
        },
        body: JSON.stringify({ sentenceIndex, request }),
      });

      if (!res.ok) {
        throw new Error('FAILED_TO_REVISE');
      }

      const data = await res.json();
      setParticipant(data.participant);
    } catch (err) {
      console.error('Error revising sentence:', err);
    } finally {
      setIsRevisingSentence(false);
    }
  };

  const handleFinalizeScript = async () => {
    if (!sessionToken) return;
    setIsFinalizing(true);
    try {
      const res = await fetch('/api/student/finalize-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': sessionToken,
        },
      });

      if (!res.ok) {
        throw new Error('FAILED_TO_FINALIZE');
      }

      const data = await res.json();
      setParticipant(data.participant);
      setStudentStage('waiting');
    } catch (err) {
      console.error('Error finalizing script:', err);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleVote = async (targetParticipantId: string) => {
    if (!sessionToken) return;
    setIsVoting(true);
    try {
      const res = await fetch('/api/student/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': sessionToken,
        },
        body: JSON.stringify({ targetParticipantId }),
      });

      if (res.ok) {
        if (participant) {
          setParticipant({
            ...participant,
            votedForParticipantId: targetParticipantId,
          });
        }
        await fetchTravelCards();
      }
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setIsVoting(false);
    }
  };

  const confirmLeaveRoom = () => {
    sessionStorage.removeItem('student_session_token');
    setSessionToken(null);
    setParticipant(null);
    setClassroom(null);
    setTemporaryTravelData(null);
    setTravelCards([]);
    setCardsRevealed(false);
    setVotingClosed(false);
    setShowLeaveConfirmModal(false);
    setStudentStage('join');
  };

  // --- Teacher Handlers ---

  const handleOpenTeacherMode = () => {
    // Require password every time teacher mode is opened
    setTeacherToken(null);
    setIsTeacherMode(true);
  };

  const handleExitTeacherMode = () => {
    setTeacherToken(null);
    setIsTeacherMode(false);
  };

  const handleTeacherLogin = async (password: string): Promise<boolean> => {
    setIsTeacherActionLoading(true);
    try {
      const res = await fetch('/api/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      setTeacherToken(data.teacherToken);

      // Check last room code or load default
      const lastCode = localStorage.getItem('last_room_code') || 'DEFAULT';
      const cRes = await fetch(`/api/teacher/classroom/${lastCode}`, {
        headers: { 'x-teacher-token': data.teacherToken },
      });
      if (cRes.ok) {
        const cData = await cRes.json();
        setTeacherClassroomData(cData);
      }
      return true;
    } catch (err) {
      console.error('Teacher login error:', err);
      return false;
    } finally {
      setIsTeacherActionLoading(false);
    }
  };

  const handleCreateRoom = async (title: string, roomCode?: string): Promise<{ success: boolean; error?: string }> => {
    if (!teacherToken) return { success: false, error: 'NO_AUTH' };
    setIsTeacherActionLoading(true);
    try {
      const res = await fetch('/api/teacher/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-teacher-token': teacherToken,
        },
        body: JSON.stringify({ title, roomCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'CREATE_FAILED' };
      }

      localStorage.setItem('last_room_code', data.classroom.roomCode);

      // Fetch full data for the newly created room
      const cRes = await fetch(`/api/teacher/classroom/${data.classroom.roomCode}`, {
        headers: { 'x-teacher-token': teacherToken },
      });
      if (cRes.ok) {
        const cData = await cRes.json();
        setTeacherClassroomData(cData);
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error creating room:', err);
      return { success: false, error: err.message || 'CREATE_FAILED' };
    } finally {
      setIsTeacherActionLoading(false);
    }
  };

  const handleSelectClassroom = async (roomCode: string) => {
    if (!teacherToken) return;
    setIsTeacherActionLoading(true);
    try {
      const res = await fetch(`/api/teacher/classroom/${roomCode}`, {
        headers: { 'x-teacher-token': teacherToken },
      });
      if (res.ok) {
        const data = await res.json();
        setTeacherClassroomData(data);
        localStorage.setItem('last_room_code', roomCode);
      }
    } catch (err) {
      console.error('Error switching room:', err);
    } finally {
      setIsTeacherActionLoading(false);
    }
  };

  const handleDeleteClassroom = async (roomCode: string) => {
    if (!teacherToken) return;
    setIsTeacherActionLoading(true);
    try {
      const res = await fetch(`/api/teacher/classroom/${roomCode}`, {
        method: 'DELETE',
        headers: { 'x-teacher-token': teacherToken },
      });
      if (res.ok) {
        const data = await res.json();
        // If the currently viewed classroom was deleted, select first available or empty
        const remaining = data.allClassrooms || [];
        if (remaining.length > 0) {
          await handleSelectClassroom(remaining[0].roomCode);
        } else {
          setTeacherClassroomData({
            classroom: null as any,
            participants: [],
            quizzes: {},
            voteResults: [],
            totalVotes: 0,
            allClassrooms: [],
          });
          localStorage.removeItem('last_room_code');
        }
      }
    } catch (err) {
      console.error('Error deleting classroom:', err);
    } finally {
      setIsTeacherActionLoading(false);
    }
  };

  const handleTeacherRevealCards = async () => {
    if (!teacherToken || !teacherClassroomData?.classroom) return;
    setIsTeacherActionLoading(true);
    try {
      const code = teacherClassroomData.classroom.roomCode;
      const res = await fetch(`/api/teacher/classroom/${code}/reveal-cards`, {
        method: 'POST',
        headers: { 'x-teacher-token': teacherToken },
      });
      if (res.ok) {
        const data = await res.json();
        setTeacherClassroomData(data.data);
      }
    } catch (err) {
      console.error('Error revealing cards:', err);
    } finally {
      setIsTeacherActionLoading(false);
    }
  };

  const handleTeacherCloseVoting = async () => {
    if (!teacherToken || !teacherClassroomData?.classroom) return;
    setIsTeacherActionLoading(true);
    try {
      const code = teacherClassroomData.classroom.roomCode;
      const res = await fetch(`/api/teacher/classroom/${code}/close-voting`, {
        method: 'POST',
        headers: { 'x-teacher-token': teacherToken },
      });
      if (res.ok) {
        const data = await res.json();
        setTeacherClassroomData(data.data);
      }
    } catch (err) {
      console.error('Error closing voting:', err);
    } finally {
      setIsTeacherActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans antialiased selection:bg-[#E2C7BC] selection:text-[#1A1A1A] flex flex-col">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        roomCode={classroom?.roomCode}
        studentName={participant?.displayName}
        onOpenTeacher={handleOpenTeacherMode}
        isTeacherMode={isTeacherMode}
        onExitTeacherMode={handleExitTeacherMode}
        onLeaveRoom={() => setShowLeaveConfirmModal(true)}
      />

      {/* Rejoin Welcome Toast Notification */}
      {rejoinedNotice && (
        <div className="bg-[#2D4030] text-[#F9F8F6] py-2.5 px-4 text-center text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2">
          <span>✨</span>
          <span>{rejoinedNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {isTeacherMode ? (
          <TeacherDashboard
            language={language}
            teacherToken={teacherToken}
            onLogin={handleTeacherLogin}
            classroomData={teacherClassroomData}
            onCreateRoom={handleCreateRoom}
            onSelectClassroom={handleSelectClassroom}
            onDeleteClassroom={handleDeleteClassroom}
            onRefresh={fetchTeacherData}
            onRevealCards={handleTeacherRevealCards}
            onCloseVoting={handleTeacherCloseVoting}
            isActionLoading={isTeacherActionLoading}
            onExit={handleExitTeacherMode}
          />
        ) : (
          <>
            {/* Student Flow Stages */}
            {studentStage === 'join' && (
              <StudentJoin
                language={language}
                onJoin={handleStudentJoin}
                isLoading={isLoading}
                error={errorMsg}
                onOpenTeacher={handleOpenTeacherMode}
              />
            )}

            {studentStage === 'questionnaire' && (
              <TravelQuestionnaire
                language={language}
                initialData={temporaryTravelData || participant?.travelData}
                onComplete={handleQuestionnaireComplete}
              />
            )}

            {studentStage === 'summary' && temporaryTravelData && (
              <TravelSummary
                language={language}
                travelData={temporaryTravelData}
                onEdit={() => setStudentStage('questionnaire')}
                onGenerate={handleGenerateScript}
                isGenerating={isGeneratingScript}
              />
            )}

            {studentStage === 'editor' && participant && (
              <ScriptEditor
                language={language}
                sentences={participant.sentences || []}
                revisionCount={participant.revisionCount || 0}
                onReviseSentence={handleReviseSentence}
                onFinalize={handleFinalizeScript}
                isRevising={isRevisingSentence}
                isFinalizing={isFinalizing}
              />
            )}

            {studentStage === 'waiting' && participant && (
              <PresenterWaitingView
                language={language}
                participant={participant}
                cardsRevealed={cardsRevealed}
                onRefresh={fetchTravelCards}
                onGoToVoting={() => setStudentStage('voting')}
              />
            )}

            {studentStage === 'voting' && participant && (
              <VotingView
                language={language}
                currentParticipant={participant}
                cards={travelCards}
                votingClosed={votingClosed}
                onVote={handleVote}
                isVoting={isVoting}
                hasVoted={Boolean(participant.votedForParticipantId)}
                votedTargetId={participant.votedForParticipantId}
                onBackToScript={() => setStudentStage('waiting')}
              />
            )}
          </>
        )}
      </main>

      {/* Leave Room Confirmation Modal */}
      {showLeaveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl p-6 space-y-4 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF8F5] text-[#8B3A2B] mx-auto flex items-center justify-center border border-[#F5C2BC]">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">{t.leaveRoom}</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                {t.leaveRoomConfirm}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowLeaveConfirmModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-xs font-bold transition-colors"
              >
                {t.cancel}
              </button>
              <button
                id="confirm-leave-room-btn"
                onClick={confirmLeaveRoom}
                className="w-1/2 py-2.5 rounded-xl bg-[#8B3A2B] hover:bg-[#722F23] text-white text-xs font-bold transition-all shadow-sm"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
