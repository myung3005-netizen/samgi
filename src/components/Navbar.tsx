import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Plane, Globe, Shield, User, LogOut } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  roomCode?: string;
  studentName?: string;
  onOpenTeacher: () => void;
  isTeacherMode: boolean;
  onExitTeacherMode?: () => void;
  onLeaveRoom?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  roomCode,
  studentName,
  onOpenTeacher,
  isTeacherMode,
  onExitTeacherMode,
  onLeaveRoom,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-[#E5E2DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-[#F9F8F6] shadow-sm">
            <Plane className="w-5 h-5 text-[#E5E2DA]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial font-bold text-[#1A1A1A] text-lg sm:text-xl tracking-tight">
                {t.appName}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EFECE6] text-[#57534E] border border-[#E5E2DA] tracking-wide">
                {t.appSubtitle}
              </span>
            </div>
            <p className="text-xs text-[#78716C] font-normal hidden md:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Session Info */}
          {roomCode && !isTeacherMode && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E5E2DA] text-xs text-[#44403C] shadow-xs">
              <span className="text-[#A8A29E] font-medium">{t.roomCode}:</span>
              <span className="font-bold font-mono tracking-wider text-[#A84B2F]">{roomCode}</span>
              {studentName && (
                <>
                  <span className="text-[#D6D3D1]">|</span>
                  <div className="flex items-center gap-1 text-[#1A1A1A] font-semibold">
                    <User className="w-3.5 h-3.5 text-[#57534E]" />
                    <span>{studentName}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#E5E2DA] text-xs font-semibold">
            <button
              id="lang-ko-btn"
              onClick={() => onLanguageChange('ko')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === 'ko'
                  ? 'bg-white text-[#1A1A1A] shadow-xs font-bold border border-[#E5E2DA]/60'
                  : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              한국어
            </button>
            <button
              id="lang-vi-btn"
              onClick={() => onLanguageChange('vi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === 'vi'
                  ? 'bg-white text-[#1A1A1A] shadow-xs font-bold border border-[#E5E2DA]/60'
                  : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Tiếng Việt
            </button>
          </div>

          {/* Teacher Mode Button */}
          {isTeacherMode ? (
            <button
              id="exit-teacher-btn"
              onClick={onExitTeacherMode}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5EBE6] border border-[#E2C7BC] text-[#8B3A2B] hover:bg-[#EEDCD3] text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.exitTeacherMode}</span>
            </button>
          ) : (
            <button
              id="teacher-entry-btn"
              onClick={onOpenTeacher}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F3EFE6] border border-[#E5E2DA] text-[#44403C] text-xs font-semibold transition-colors shadow-xs"
              title={t.teacherEntry}
            >
              <Shield className="w-3.5 h-3.5 text-[#78716C]" />
              <span className="hidden sm:inline">{t.teacherEntry}</span>
            </button>
          )}

          {/* Leave room button */}
          {roomCode && !isTeacherMode && onLeaveRoom && (
            <button
              id="leave-room-btn"
              onClick={onLeaveRoom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDF8F5] hover:bg-[#FAECE9] border border-[#F5C2BC] text-[#8B3A2B] text-xs font-semibold transition-colors shadow-xs"
              title={t.leaveRoom}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.leaveRoom}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
