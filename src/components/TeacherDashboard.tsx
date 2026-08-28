import React, { useState, useEffect } from 'react';
import { Language, TeacherClassroomData, Participant, ClassroomSummary } from '../types';
import { translations } from '../translations';
import {
  Shield,
  PlusCircle,
  Users,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Vote,
  Sparkles,
  BookOpen,
  History,
  X,
  TrendingUp,
  MapPin,
  Trash2,
  List,
  FolderOpen,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface TeacherDashboardProps {
  language: Language;
  teacherToken: string | null;
  onLogin: (password: string) => Promise<boolean>;
  classroomData: TeacherClassroomData | null;
  onCreateRoom: (title: string, roomCode?: string) => Promise<{ success: boolean; error?: string }>;
  onSelectClassroom: (roomCode: string) => Promise<void>;
  onDeleteClassroom: (roomCode: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onRevealCards: () => Promise<void>;
  onCloseVoting: () => Promise<void>;
  isActionLoading: boolean;
  onExit: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  language,
  teacherToken,
  onLogin,
  classroomData,
  onCreateRoom,
  onSelectClassroom,
  onDeleteClassroom,
  onRefresh,
  onRevealCards,
  onCloseVoting,
  isActionLoading,
  onExit,
}) => {
  const t = translations[language];

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Participant | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'quiz' | 'history' | 'travel'>('script');

  // New Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [deletingRoomCode, setDeletingRoomCode] = useState<string | null>(null);

  // Auto refresh every 4 seconds for teacher dashboard
  useEffect(() => {
    if (!teacherToken || !classroomData) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [teacherToken, classroomData, onRefresh]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = await onLogin(passwordInput);
    if (!success) {
      setLoginError(t.errorInvalidPassword);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenCreateModal = () => {
    setNewRoomTitle('');
    setNewRoomCode('');
    setCreateError(null);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    const title = newRoomTitle.trim() || (language === 'ko' ? '나의 꿈의 여행' : 'Chuyến Đi Mơ Ước');
    const result = await onCreateRoom(title, newRoomCode.trim().toUpperCase() || undefined);
    if (result.success) {
      setShowCreateModal(false);
      setNewRoomTitle('');
      setNewRoomCode('');
    } else {
      if (result.error === 'CODE_ALREADY_EXISTS') {
        setCreateError(t.codeAlreadyExists);
      } else {
        setCreateError(t.errorGeneric);
      }
    }
  };

  const handleDeleteClick = (roomCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingRoomCode(roomCode);
  };

  const confirmDelete = async () => {
    if (deletingRoomCode) {
      await onDeleteClassroom(deletingRoomCode);
      setDeletingRoomCode(null);
    }
  };

  // If not logged in, show Teacher Password Login screen
  if (!teacherToken) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F3EFE6] text-[#57534E] mx-auto flex items-center justify-center border border-[#E5E2DA]">
            <Shield className="w-8 h-8 text-[#C25E3E]" />
          </div>

          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">{t.teacherLoginTitle}</h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              {language === 'ko' ? '교사용 관리 화면에 접근하려면 비밀번호를 입력하세요.' : 'Nhập mật khẩu giáo viên để truy cập trang quản lý.'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E]">
                {t.teacherPasswordLabel}
              </label>
              <input
                id="teacher-password-input"
                type="password"
                maxLength={8}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={t.teacherPasswordPlaceholder}
                className="w-full px-4 py-3.5 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-center font-mono text-xl font-bold tracking-widest text-[#1A1A1A] placeholder:text-[#A8A29E] placeholder:text-sm placeholder:font-sans placeholder:tracking-normal transition-all"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-[#FDF8F5] border border-[#F5C2BC] text-[#8B3A2B] text-xs font-semibold flex items-center gap-2">
                <span>{loginError}</span>
              </div>
            )}

            <button
              id="teacher-login-submit"
              type="submit"
              disabled={isActionLoading || !passwordInput}
              className="w-full py-4 px-6 rounded-2xl bg-[#1A1A1A] hover:bg-[#2D2D2D] text-[#F9F8F6] font-bold text-sm shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isActionLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>로그인 중...</span>
                </div>
              ) : (
                <span>{t.loginBtn}</span>
              )}
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={onExit}
              className="text-xs text-[#78716C] hover:text-[#1A1A1A] font-medium transition-colors"
            >
              ← 학생 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const classroom = classroomData?.classroom;
  const participants = classroomData?.participants || [];
  const quizzes = classroomData?.quizzes || {};
  const voteResults = classroomData?.voteResults || [];
  const totalVotes = classroomData?.totalVotes || 0;
  const allClassrooms = classroomData?.allClassrooms || [];

  const completedCount = participants.filter((p) => p.status === 'completed').length;
  const revisingCount = participants.filter((p) => p.status === 'revising').length;
  const planningCount = participants.filter((p) => p.status === 'planning').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] text-[#F9F8F6] rounded-3xl p-6 sm:p-8 border border-[#2D2D2D] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#3D3D3D] text-[#E5E2DA] text-xs font-mono font-bold">
                <Shield className="w-3.5 h-3.5 text-[#C25E3E]" />
                <span>{t.teacherMode}</span>
              </div>
              {classroom && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#332A24] border border-[#594236] text-[#E89E84] text-xs font-mono font-bold">
                  <span>코드: {classroom.roomCode}</span>
                </div>
              )}
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F9F8F6]">
              {classroom ? classroom.title : (language === 'ko' ? '수업을 선택하거나 생성하세요' : 'Chọn hoặc tạo lớp học')}
            </h1>
            <p className="text-[#A8A29E] text-xs sm:text-sm">
              {language === 'ko'
                ? '학생들의 실시간 작성 및 수정 현황을 모니터링하고 퀴즈와 투표를 진행하세요.'
                : 'Theo dõi tiến độ học sinh theo thời gian thực và quản lý câu hỏi nghe hiểu, bình chọn.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              id="open-create-room-btn"
              onClick={handleOpenCreateModal}
              disabled={isActionLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.createNewRoomBtn}</span>
            </button>

            <button
              id="open-history-btn"
              onClick={() => setShowHistoryModal(true)}
              disabled={isActionLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] border border-[#3D3D3D] text-[#F9F8F6] text-xs sm:text-sm font-semibold transition-colors"
            >
              <List className="w-4 h-4 text-[#A8A29E]" />
              <span>{t.classroomsList}</span>
              {allClassrooms.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#C25E3E] text-white text-[10px] font-bold">
                  {allClassrooms.length}
                </span>
              )}
            </button>

            <button
              onClick={() => onRefresh()}
              disabled={isActionLoading}
              className="p-2.5 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] border border-[#3D3D3D] text-[#A8A29E] hover:text-white transition-colors"
              title={t.refreshStatus}
            >
              <RefreshCw className={`w-4 h-4 ${isActionLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Status & Student Monitor */}
      {classroom ? (
        <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 space-y-6">
          {/* Room Code & Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FCFBF9] border border-[#E5E2DA]">
            <div className="flex items-center gap-4">
              <div className="space-y-0.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                  {t.classRoomCodeLabel}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-bold font-mono tracking-widest text-[#1A1A1A]">
                    {classroom.roomCode}
                  </span>
                  <button
                    onClick={() => handleCopyCode(classroom.roomCode)}
                    className="p-2 rounded-lg bg-white shadow-xs border border-[#E5E2DA] text-[#57534E] hover:bg-[#F3EFE6] transition-colors"
                    title="Copy Room Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-[#2D4030]" /> : <Copy className="w-4 h-4 text-[#78716C]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E2DA] text-center shadow-xs">
                <span className="block text-[10px] uppercase font-bold text-[#78716C]">{t.participantsCount}</span>
                <span className="text-lg font-bold font-mono text-[#1A1A1A]">{participants.length}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#F3EFE6] border border-[#E5E2DA] text-center shadow-xs">
                <span className="block text-[10px] uppercase font-bold text-[#2D4030]">{t.statusCompleted}</span>
                <span className="text-lg font-bold font-mono text-[#2D4030]">{completedCount}</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#FDF8F5] border border-[#F5C2BC] text-center shadow-xs">
                <span className="block text-[10px] uppercase font-bold text-[#8B3A2B]">{t.statusRevising}</span>
                <span className="text-lg font-bold font-mono text-[#8B3A2B]">{revisingCount}</span>
              </div>
            </div>
          </div>

          {/* Activity Phase Control Bar */}
          <div className="p-5 rounded-2xl bg-[#F8F6F0] border border-[#E5E2DA] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-editorial text-base font-bold text-[#1A1A1A]">
                {language === 'ko' ? '발표 & 투표 진행 컨트롤' : 'Điều khiển Buổi Thuyết Trình & Bình Chọn'}
              </h3>
              <p className="text-xs text-[#78716C]">
                {classroom.cardRevealState
                  ? classroom.votingClosed
                    ? t.votingClosedState
                    : t.cardsRevealedNotice
                  : language === 'ko'
                  ? '학생들이 발표문을 완성한 후 [여행 카드 공개]를 누르면 전원 투표가 시작됩니다.'
                  : 'Sau khi học sinh hoàn thành bài, bấm [Công bố Thẻ Du Lịch] để bắt đầu bình chọn.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Reveal Cards Button */}
              {!classroom.cardRevealState ? (
                <button
                  id="reveal-cards-btn"
                  onClick={onRevealCards}
                  disabled={isActionLoading || completedCount === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D4030] hover:bg-[#202E22] text-[#F9F8F6] text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t.revealCardsBtn}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8EFE9] border border-[#C5D8C8] text-[#2D4030] text-xs font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>공개됨</span>
                </div>
              )}

              {/* Close Voting Button */}
              {classroom.cardRevealState && !classroom.votingClosed && (
                <button
                  id="close-voting-btn"
                  onClick={onCloseVoting}
                  disabled={isActionLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B3A2B] hover:bg-[#722F23] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Vote className="w-4 h-4" />
                  <span>{t.closeVotingBtn}</span>
                </button>
              )}

              {/* View Results Button */}
              {classroom.cardRevealState && (
                <button
                  id="view-results-btn"
                  onClick={() => setShowResultsModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#2D2D2D] text-[#F9F8F6] text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                  <TrendingUp className="w-4 h-4 text-[#C25E3E]" />
                  <span>{t.viewResultsBtn} ({totalVotes}표)</span>
                </button>
              )}
            </div>
          </div>

          {/* Student Progress Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#57534E]" />
                <span>학생 참여 및 진행 현황</span>
              </h3>
              <span className="text-xs text-[#78716C]">
                총 {participants.length}명 참여 중 ({completedCount}명 완료)
              </span>
            </div>

            {participants.length === 0 ? (
              <div className="p-12 text-center bg-[#FCFBF9] rounded-2xl border border-dashed border-[#DCD8CF] space-y-3">
                <Users className="w-10 h-10 text-[#A8A29E] mx-auto" />
                <div className="space-y-1">
                  <p className="font-editorial font-bold text-sm text-[#1A1A1A]">{t.noParticipantsYet}</p>
                  <p className="text-xs text-[#78716C]">
                    학생들이 수업 코드 <span className="font-mono font-bold text-[#C25E3E]">{classroom.roomCode}</span>를 입력하고 입장하면 실시간으로 표시됩니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#E5E2DA]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F6F0] text-[#57534E] font-mono uppercase text-[10px] tracking-wider border-b border-[#E5E2DA]">
                    <tr>
                      <th className="py-3 px-4">{t.tableColStudent}</th>
                      <th className="py-3 px-4">{t.tableColDestination}</th>
                      <th className="py-3 px-4">{t.tableColStatus}</th>
                      <th className="py-3 px-4 text-center">{t.tableColRevisions}</th>
                      <th className="py-3 px-4 text-center">듣기 퀴즈</th>
                      <th className="py-3 px-4 text-right">{t.tableColActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DA] bg-white">
                    {participants.map((p) => {
                      const dest = p.travelData?.customDestination || p.travelData?.destination || '-';
                      const hasQuiz = !!quizzes[p.id];
                      return (
                        <tr key={p.id} className="hover:bg-[#FCFBF9] transition-colors">
                          {/* Student Name */}
                          <td className="py-3.5 px-4 font-bold text-[#1A1A1A] flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-[#EFECE6] border border-[#E5E2DA] text-[#57534E] flex items-center justify-center font-editorial font-bold text-xs">
                              {p.displayName.charAt(0)}
                            </span>
                            <span>{p.displayName}</span>
                          </td>

                          {/* Destination */}
                          <td className="py-3.5 px-4 text-[#57534E]">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#A8A29E]" />
                              {dest}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {p.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8EFE9] text-[#2D4030] font-bold border border-[#C5D8C8]">
                                <Check className="w-3 h-3" />
                                {t.statusCompleted}
                              </span>
                            ) : p.status === 'revising' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF8F5] text-[#8B3A2B] font-bold border border-[#F5C2BC] animate-pulse">
                                {t.statusRevising}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#78716C] font-semibold border border-[#E5E2DA]">
                                {t.statusPlanning}
                              </span>
                            )}
                          </td>

                          {/* Revisions Count */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold">
                            {p.revisionCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-[#FDF8F5] text-[#8B3A2B] border border-[#F5C2BC]">
                                {p.revisionCount}회
                              </span>
                            ) : (
                              <span className="text-[#A8A29E]">-</span>
                            )}
                          </td>

                          {/* Quiz Created? */}
                          <td className="py-3.5 px-4 text-center">
                            {hasQuiz ? (
                              <span className="px-2 py-0.5 rounded-md bg-[#E8EFE9] text-[#2D4030] border border-[#C5D8C8] font-bold text-[11px]">
                                준비됨 (3문항)
                              </span>
                            ) : (
                              <span className="text-[#A8A29E] text-[11px]">생성 대기</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              id={`view-student-${p.id}`}
                              onClick={() => {
                                setSelectedStudent(p);
                                setActiveTab('script');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F3EFE6] hover:bg-[#E5E2DA] text-[#1A1A1A] font-semibold text-xs transition-colors border border-[#E5E2DA] inline-flex items-center gap-1.5"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#57534E]" />
                              <span>{t.viewStudentWork}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State: No active classroom selected */
        <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-12 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#F8F6F0] text-[#78716C] mx-auto flex items-center justify-center border border-[#E5E2DA]">
            <FolderOpen className="w-8 h-8 text-[#C25E3E]" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
              {language === 'ko' ? '진행 중인 수업이 없습니다' : 'Chưa có lớp học đang hoạt động'}
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C]">
              {t.noClassroomsYet}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white text-sm font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.createNewRoomBtn}</span>
            </button>
            {allClassrooms.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F3EFE6] hover:bg-[#E5E2DA] text-[#1A1A1A] text-sm font-bold transition-all border border-[#E5E2DA]"
              >
                <List className="w-4 h-4" />
                <span>{t.classroomsList} ({allClassrooms.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* CREATE ROOM MODAL (Supports Custom Room Code) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-6 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-between border-b border-[#2D2D2D]">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C25E3E]" />
                <h3 className="font-editorial text-lg font-bold">{t.createNewRoomBtn}</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-[#A8A29E] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {/* Room Code (Custom or Auto) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E]">
                  {t.customRoomCodeLabel}
                </label>
                <input
                  id="custom-room-code-input"
                  type="text"
                  maxLength={12}
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
                  placeholder={t.customRoomCodePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 font-mono text-base font-bold tracking-wider text-[#1A1A1A] placeholder:text-[#A8A29E] placeholder:font-sans placeholder:text-xs placeholder:tracking-normal transition-all"
                  autoFocus
                />
                <p className="text-[11px] text-[#78716C]">
                  {language === 'ko'
                    ? '💡 예: 1반, 301, TRIP 처럼 학생들이 입력하기 쉬운 코드를 입력하세요. 비워두면 4자리 코드가 자동 생성됩니다.'
                    : '💡 VD: 101, TRIP... Để trống để hệ thống tự tạo mã 4 ký tự.'}
                </p>
              </div>

              {/* Room Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E]">
                  {t.roomTitleLabel}
                </label>
                <input
                  id="custom-room-title-input"
                  type="text"
                  maxLength={30}
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder={t.roomTitlePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-sm font-medium text-[#1A1A1A] placeholder:text-[#A8A29E] transition-all"
                />
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-[#FDF8F5] border border-[#F5C2BC] text-[#8B3A2B] text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-xs font-bold transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  id="submit-create-room-btn"
                  type="submit"
                  disabled={isActionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {isActionLoading ? t.creatingRoom : '수업 만들기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLASSROOMS HISTORY / MANAGEMENT MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[85vh]">
            <div className="p-6 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-between border-b border-[#2D2D2D] shrink-0">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-[#C25E3E]" />
                <h3 className="font-editorial text-lg font-bold">{t.classroomsList}</h3>
                <span className="text-xs text-[#A8A29E]">({allClassrooms.length}개)</span>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-full text-[#A8A29E] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 bg-[#FCFBF9] flex-1">
              {allClassrooms.length === 0 ? (
                <div className="p-8 text-center text-[#78716C] text-sm">
                  {t.noClassroomsYet}
                </div>
              ) : (
                allClassrooms.map((c) => {
                  const isCurrent = classroom?.roomCode === c.roomCode;
                  const dateStr = new Date(c.createdAt).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'vi-VN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-[#FDF8F5] border-[#C25E3E] ring-2 ring-[#C25E3E]/20'
                          : 'bg-white border-[#E5E2DA] hover:border-[#DCD8CF]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#1A1A1A] text-[#F9F8F6] font-mono font-bold text-xs tracking-wider">
                            {c.roomCode}
                          </span>
                          <h4 className="font-editorial font-bold text-sm text-[#1A1A1A]">
                            {c.title}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#C25E3E] text-white text-[10px] font-bold">
                              현재 선택됨
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#78716C]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dateStr}
                          </span>
                          <span>·</span>
                          <span>학생: <strong className="text-[#1A1A1A]">{c.participantsCount}명</strong></span>
                          <span>·</span>
                          <span>완료: <strong className="text-[#2D4030]">{c.completedCount}명</strong></span>
                          <span>·</span>
                          <span>투표: <strong className="text-[#8B3A2B]">{c.totalVotes}표</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isCurrent && (
                          <button
                            onClick={async () => {
                              await onSelectClassroom(c.roomCode);
                              setShowHistoryModal(false);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#F3EFE6] hover:bg-[#E5E2DA] text-[#1A1A1A] text-xs font-bold transition-colors border border-[#E5E2DA]"
                          >
                            {t.switchClassroom}
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteClick(c.roomCode, e)}
                          className="p-2 rounded-xl text-[#A8A29E] hover:text-[#8B3A2B] hover:bg-[#FDF8F5] transition-colors border border-transparent hover:border-[#F5C2BC]"
                          title={t.deleteClassroom}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-white border-t border-[#E5E2DA] flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  handleOpenCreateModal();
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#C25E3E] hover:text-[#A84B2F]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>새 수업 추가하기</span>
              </button>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-xs font-bold transition-colors"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingRoomCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl p-6 space-y-4 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF8F5] text-[#8B3A2B] mx-auto flex items-center justify-center border border-[#F5C2BC]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">{t.deleteClassroom} ({deletingRoomCode})</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                {t.deleteConfirm}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingRoomCode(null)}
                className="w-1/2 py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-xs font-bold transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-[#8B3A2B] hover:bg-[#722F23] text-white text-xs font-bold transition-all shadow-sm"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-[#1A1A1A] text-[#F9F8F6] flex items-center justify-between border-b border-[#2D2D2D] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A2A2A] border border-[#3D3D3D] text-[#E5E2DA] flex items-center justify-center font-editorial font-bold text-lg">
                  {selectedStudent.displayName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-lg font-bold text-[#F9F8F6]">
                      {selectedStudent.displayName} 학생의 여행 발표문
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#3D3D3D] text-[#E5E2DA] text-[11px] font-mono">
                      수정 {selectedStudent.revisionCount}회
                    </span>
                  </div>
                  <p className="text-xs text-[#A8A29E]">
                    {selectedStudent.travelData?.customDestination || selectedStudent.travelData?.destination || '여행지'} · {selectedStudent.travelData?.customPurpose || selectedStudent.travelData?.purpose || '자유 여행'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-full text-[#A8A29E] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center border-b border-[#E5E2DA] bg-[#F8F6F0] px-6 text-xs font-bold text-[#57534E] shrink-0">
              <button
                onClick={() => setActiveTab('script')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'script'
                    ? 'border-[#C25E3E] text-[#C25E3E]'
                    : 'border-transparent hover:text-[#1A1A1A]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>최종 발표문</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'quiz'
                    ? 'border-[#C25E3E] text-[#C25E3E]'
                    : 'border-transparent hover:text-[#1A1A1A]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>듣기 퀴즈 (골든벨용)</span>
                {quizzes[selectedStudent.id] && (
                  <span className="w-2 h-2 rounded-full bg-[#2D4030]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-[#C25E3E] text-[#C25E3E]'
                    : 'border-transparent hover:text-[#1A1A1A]'
                }`}
              >
                <History className="w-4 h-4" />
                <span>문장 수정 이력</span>
                {selectedStudent.revisionCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#F5C2BC] text-[#8B3A2B] text-[10px]">
                    {selectedStudent.revisionCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('travel')}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'travel'
                    ? 'border-[#C25E3E] text-[#C25E3E]'
                    : 'border-transparent hover:text-[#1A1A1A]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>설문 응답</span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#FCFBF9]">
              {/* TAB 1: Final Script */}
              {activeTab === 'script' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E5E2DA] space-y-3">
                    <h4 className="font-editorial text-sm font-bold text-[#57534E] uppercase tracking-wider">
                      전체 발표문 스크립트
                    </h4>
                    {selectedStudent.sentences && selectedStudent.sentences.length > 0 ? (
                      <div className="space-y-2">
                        {selectedStudent.sentences.map((sent, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-[#FCFBF9] border border-[#E5E2DA] flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-[#EFECE6] text-[#57534E] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="font-editorial-body text-base text-[#1A1A1A] leading-relaxed">
                              {sent}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-editorial-body text-base text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                        {selectedStudent.finalScript || selectedStudent.fullScript || '작성된 발표문이 아직 없습니다.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Listening Quiz */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F8F6F0] border border-[#E5E2DA] text-[#57534E] text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C25E3E] shrink-0" />
                    <span>{t.listeningQuizDesc} (교사용 화면에만 표시됩니다)</span>
                  </div>

                  {quizzes[selectedStudent.id] ? (
                    <div className="space-y-3">
                      {/* Q1 */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E2DA] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#57534E] font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-[#F3EFE6] border border-[#E5E2DA]">문제 1</span>
                        </div>
                        <p className="font-bold text-[#1A1A1A] text-sm">
                          {quizzes[selectedStudent.id].q1}
                        </p>
                        <div className="p-2.5 rounded-xl bg-[#F3EFE6] border border-[#E5E2DA] text-[#2D4030] text-xs font-bold flex items-center gap-2">
                          <span>정답:</span>
                          <span className="text-sm">{quizzes[selectedStudent.id].a1}</span>
                        </div>
                      </div>

                      {/* Q2 */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E2DA] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#57534E] font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-[#F3EFE6] border border-[#E5E2DA]">문제 2</span>
                        </div>
                        <p className="font-bold text-[#1A1A1A] text-sm">
                          {quizzes[selectedStudent.id].q2}
                        </p>
                        <div className="p-2.5 rounded-xl bg-[#F3EFE6] border border-[#E5E2DA] text-[#2D4030] text-xs font-bold flex items-center gap-2">
                          <span>정답:</span>
                          <span className="text-sm">{quizzes[selectedStudent.id].a2}</span>
                        </div>
                      </div>

                      {/* Q3 */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E2DA] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#57534E] font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-[#F3EFE6] border border-[#E5E2DA]">문제 3</span>
                        </div>
                        <p className="font-bold text-[#1A1A1A] text-sm">
                          {quizzes[selectedStudent.id].q3}
                        </p>
                        <div className="p-2.5 rounded-xl bg-[#F3EFE6] border border-[#E5E2DA] text-[#2D4030] text-xs font-bold flex items-center gap-2">
                          <span>정답:</span>
                          <span className="text-sm">{quizzes[selectedStudent.id].a3}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#A8A29E] text-sm">
                      학생이 발표문을 완성하면(발표문 완성하기 클릭 시) 3개의 듣기 평가 문제가 자동 생성됩니다.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Revision History */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  {selectedStudent.revisionHistory && selectedStudent.revisionHistory.length > 0 ? (
                    selectedStudent.revisionHistory.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-white border border-[#E5E2DA] space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-[#78716C] font-bold border-b border-[#E5E2DA] pb-2">
                          <span className="text-[#1A1A1A] font-bold font-mono">
                            {rev.revisionNumber}회차 수정 ({rev.sentenceIndex + 1}번 문장)
                          </span>
                          <span className="font-mono">{new Date(rev.timestamp).toLocaleTimeString()}</span>
                        </div>

                        <div>
                          <span className="block font-mono text-[11px] font-bold text-[#78716C]">학생 요청:</span>
                          <span className="font-semibold text-[#1A1A1A] bg-[#F8F6F0] border border-[#E5E2DA] px-2 py-1 rounded-md inline-block mt-0.5">
                            "{rev.studentRequest}"
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div className="p-2.5 rounded-xl bg-[#FDF8F5] border border-[#F5C2BC]">
                            <span className="block font-bold text-[#8B3A2B] mb-0.5">수정 전:</span>
                            <span className="text-[#57534E] font-editorial-body text-sm">{rev.originalSentence}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#F3EFE6] border border-[#E5E2DA]">
                            <span className="block font-bold text-[#2D4030] mb-0.5">수정 후:</span>
                            <span className="text-[#1A1A1A] font-editorial-body text-sm font-semibold">{rev.revisedSentence}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#A8A29E] text-sm">
                      아직 진행된 문장 수정 이력이 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Travel Survey Answers */}
              {activeTab === 'travel' && (
                <div className="space-y-3">
                  {selectedStudent.travelData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA]">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">여행지</span>
                        <span className="font-bold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.customDestination || selectedStudent.travelData.destination}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA]">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">목적/테마</span>
                        <span className="font-bold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.customPurpose || selectedStudent.travelData.purpose}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA]">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">함께 갈 사람</span>
                        <span className="font-bold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.customCompanion || selectedStudent.travelData.companion}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA]">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">기간</span>
                        <span className="font-bold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.duration}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA]">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">예산</span>
                        <span className="font-bold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.budget}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA] sm:col-span-2">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">꼭 하고 싶은 것</span>
                        <span className="font-semibold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.mustDo || '-'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA] sm:col-span-2">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">꼭 필요한 것</span>
                        <span className="font-semibold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.mustHave || '-'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5E2DA] sm:col-span-2">
                        <span className="text-[#78716C] font-mono text-[11px] font-bold block">여행 이유</span>
                        <span className="font-semibold text-[#1A1A1A] text-sm">
                          {selectedStudent.travelData.reason || '-'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#A8A29E] text-sm">
                      아직 설문 응답 정보가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FCFBF9] border-t border-[#E5E2DA] text-right shrink-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-xs font-semibold transition-colors"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voting Results Modal (Teacher Only) */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="bg-[#1A1A1A] p-6 text-[#F9F8F6] text-center space-y-1 relative border-b border-[#2D2D2D]">
              <button
                onClick={() => setShowResultsModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-[#A8A29E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-[#2A2A2A] border border-[#3D3D3D] mx-auto flex items-center justify-center text-2xl mb-2">
                🏆
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#F9F8F6]">{t.votingResultsTitle}</h3>
              <p className="text-xs text-[#A8A29E]">{t.votingResultsDesc} (총 {totalVotes}표)</p>
            </div>

            {/* Ranking List */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto bg-[#FCFBF9]">
              {voteResults && voteResults.length > 0 ? (
                voteResults.map((res, idx) => {
                  const isTop = idx === 0 && res.voteCount > 0;
                  return (
                    <div
                      key={res.participantId}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                        isTop
                          ? 'border-[#C25E3E] bg-[#FDF8F5] ring-2 ring-[#C25E3E]/20 shadow-xs'
                          : 'border-[#E5E2DA] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold font-mono ${
                            idx === 0
                              ? 'bg-[#C25E3E] text-white'
                              : idx === 1
                              ? 'bg-[#57534E] text-white'
                              : idx === 2
                              ? 'bg-[#8B3A2B] text-white'
                              : 'bg-[#EFECE6] text-[#57534E]'
                          }`}
                        >
                          {idx + 1}
                        </span>

                        <div>
                          <h4 className="font-editorial font-bold text-sm text-[#1A1A1A]">
                            {res.displayName}
                          </h4>
                          <span className="text-xs text-[#78716C]">
                            {res.destination} · {res.theme}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold font-mono text-[#1A1A1A]">
                          {res.voteCount}
                        </span>
                        <span className="text-xs font-bold text-[#78716C] ml-1">
                          {t.votesCountLabel}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[#A8A29E] text-sm">
                  아직 제출된 투표가 없습니다.
                </div>
              )}
            </div>

            {/* Offline Announcement helper */}
            <div className="p-4 bg-white border-t border-[#E5E2DA] text-center text-xs text-[#78716C]">
              💡 교실에서 학생들에게 오프라인으로 1위 여행을 직접 발표해 주세요!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
