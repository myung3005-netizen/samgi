import React from 'react';
import { Language, Participant } from '../types';
import { translations } from '../translations';
import {
  Sparkles,
  Volume2,
  Clock,
  RefreshCw,
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface PresenterWaitingViewProps {
  language: Language;
  participant: Participant;
  cardsRevealed: boolean;
  onRefresh: () => void;
  onGoToVoting: () => void;
  isPolling?: boolean;
}

export const PresenterWaitingView: React.FC<PresenterWaitingViewProps> = ({
  language,
  participant,
  cardsRevealed,
  onRefresh,
  onGoToVoting,
  isPolling,
}) => {
  const t = translations[language];
  const finalScript = participant.finalScript || participant.fullScript || '';
  const sentences = participant.sentences || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Celebration Header */}
      <div className="bg-[#1A1A1A] text-[#F9F8F6] rounded-3xl p-6 sm:p-8 border border-[#2D2D2D] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#3D3D3D] text-[11px] font-bold text-[#E5E2DA]">
              <Award className="w-4 h-4 text-[#C25E3E]" />
              <span>{t.presenterTitle}</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F9F8F6]">
              {language === 'ko' ? `${participant.displayName}님의 발표 준비 완료!` : `Bài thuyết trình của ${participant.displayName} đã sẵn sàng!`}
            </h1>
            <p className="text-[#A8A29E] text-xs sm:text-sm font-normal max-w-lg leading-relaxed">
              {t.presenterSubtitle}
            </p>
          </div>

          <div className="shrink-0 hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-[#2A2A2A] border border-[#3D3D3D] flex items-center justify-center text-3xl">
              🎤
            </div>
          </div>
        </div>
      </div>

      {/* Speaking Practice Card */}
      <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DA]">
          <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-sm sm:text-base">
            <BookOpen className="w-5 h-5 text-[#57534E]" />
            <span className="font-editorial text-base">{language === 'ko' ? '최종 발표문 (한국어)' : 'Bài thuyết trình chính thức (Tiếng Hàn)'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EFE6] border border-[#E5E2DA] text-[#57534E] text-xs font-mono font-bold">
            <span>수정 {participant.revisionCount}회 완료</span>
          </div>
        </div>

        {/* Practice Tip */}
        <div className="p-4 rounded-2xl bg-[#F8F6F0] border border-[#E5E2DA] text-[#44403C] text-sm font-medium flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-[#C25E3E] shrink-0" />
          <span>{t.practiceSpeakingTip}</span>
        </div>

        {/* Sentences in readable presentation format */}
        <div className="space-y-4 bg-[#FCFBF9] p-5 sm:p-6 rounded-2xl border border-[#E5E2DA]">
          {sentences.length > 0 ? (
            sentences.map((sent, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-lg bg-[#EFECE6] text-[#57534E] text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="font-editorial-body text-base sm:text-lg font-normal text-[#1A1A1A] leading-relaxed">
                  {sent}
                </p>
              </div>
            ))
          ) : (
            <p className="font-editorial-body text-base sm:text-lg font-normal text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
              {finalScript}
            </p>
          )}
        </div>
      </div>

      {/* Waiting for Teacher / Go to Voting */}
      <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 text-center space-y-4">
        {cardsRevealed ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-[#F3EFE6] text-[#C25E3E] mx-auto flex items-center justify-center border border-[#E5E2DA]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                {language === 'ko' ? '🎉 여행 카드가 공개되었습니다!' : '🎉 Thẻ du lịch đã được mở!'}
              </h3>
              <p className="text-sm text-[#78716C]">
                {language === 'ko'
                  ? '친구들의 여행을 구경하고 가장 함께 가고 싶은 여행에 투표해 보세요!'
                  : 'Hãy xem các chuyến đi và bình chọn cho chuyến đi bạn thích nhất!'}
              </p>
            </div>
            <button
              id="go-to-voting-btn"
              type="button"
              onClick={onGoToVoting}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white font-bold text-base shadow-sm active:scale-98 transition-all"
            >
              <span>{language === 'ko' ? '친구들 여행 보러 가기' : 'Xem chuyến đi của các bạn'}</span>
              <span>👉</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F3EFE6] text-[#57534E] mb-1 border border-[#E5E2DA]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
              {t.waitingForCardsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed">
              {t.waitingForCardsDesc}
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-xs font-semibold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin' : ''}`} />
                <span>{t.refreshStatus}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
