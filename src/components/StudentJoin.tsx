import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Plane, Compass, Sparkles, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface StudentJoinProps {
  language: Language;
  onJoin: (roomCode: string, displayName: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  onOpenTeacher: () => void;
}

export const StudentJoin: React.FC<StudentJoinProps> = ({
  language,
  onJoin,
  isLoading,
  error,
  onOpenTeacher,
}) => {
  const t = translations[language];
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanCode = roomCode.trim().toUpperCase();
    const cleanName = displayName.trim();

    if (!cleanCode) {
      setValidationError(t.errorRoomNotFound);
      return;
    }
    if (!cleanName) {
      setValidationError(t.errorNameRequired);
      return;
    }

    await onJoin(cleanCode, cleanName);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#1A1A1A] p-6 sm:p-8 text-[#F9F8F6] text-center relative border-b border-[#2D2D2D]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2A2A2A] mb-4 border border-[#3D3D3D] shadow-xs">
              <Compass className="w-7 h-7 text-[#E5E2DA]" />
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-[#F9F8F6]">
              {language === 'ko' ? '나의 여행을 만들어 보자!' : 'Khám phá chuyến đi mơ ước!'}
            </h1>
            <p className="text-[#A8A29E] text-xs sm:text-sm font-normal max-w-xs mx-auto leading-relaxed">
              {language === 'ko'
                ? '내가 가고 싶은 여행을 직접 만들고, 발표해 보세요.'
                : 'Hãy tự lên kế hoạch và thuyết trình về chuyến đi bạn mong muốn.'}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-[#FCFBF9]">
            {(error || validationError) && (
              <div className="p-3.5 rounded-xl bg-[#FDF2F0] border border-[#F5C2BC] text-[#8B3A2B] text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#8B3A2B] shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-snug">
                  {error || validationError}
                </div>
              </div>
            )}

            {/* Room Code */}
            <div className="space-y-1.5">
              <label htmlFor="room-code-input" className="block text-xs font-bold uppercase tracking-wider text-[#57534E]">
                {t.roomCode}
              </label>
              <input
                id="room-code-input"
                type="text"
                maxLength={16}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder={t.enterRoomCodePlaceholder}
                className="w-full px-4 py-3.5 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-center font-mono text-xl font-bold tracking-widest text-[#1A1A1A] placeholder:text-[#A8A29E] placeholder:font-sans placeholder:text-sm placeholder:tracking-normal transition-all"
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label htmlFor="display-name-input" className="block text-xs font-bold uppercase tracking-wider text-[#57534E]">
                {t.displayName}
              </label>
              <input
                id="display-name-input"
                type="text"
                maxLength={15}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t.enterDisplayNamePlaceholder}
                className="w-full px-4 py-3.5 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-[#1A1A1A] font-medium placeholder:text-[#A8A29E] transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Join Button */}
            <button
              id="student-join-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-[#C25E3E] hover:bg-[#A84B2F] active:scale-[0.99] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.joining}</span>
                </div>
              ) : (
                <>
                  <span>{t.joinRoom}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Helpful Guide */}
            <div className="pt-2 text-center text-xs text-[#78716C] space-y-1.5 leading-relaxed">
              <p>
                {language === 'ko'
                  ? '✨ 선생님이 알려준 수업 코드로 간편하게 참여할 수 있습니다.'
                  : '✨ Tham gia dễ dàng với mã phòng học từ giáo viên.'}
              </p>
              <p className="text-[#C25E3E] font-medium text-[11px]">
                {language === 'ko'
                  ? '💡 이전에 작성하던 이름과 코드를 입력하면 저장된 내용을 이어서 할 수 있어요!'
                  : '💡 Nhập lại đúng mã và tên cũ để tiếp tục bài đang làm dở!'}
              </p>
            </div>
          </form>
        </div>

        {/* Teacher Entry Shortcut at Bottom */}
        <div className="mt-6 text-center">
          <button
            id="bottom-teacher-link"
            type="button"
            onClick={onOpenTeacher}
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1A1A1A] font-medium py-1.5 px-3 rounded-lg hover:bg-[#EFECE6] transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.teacherEntry} (0853)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
