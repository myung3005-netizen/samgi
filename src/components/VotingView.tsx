import React, { useState } from 'react';
import { Language, TravelCard, Participant } from '../types';
import { translations } from '../translations';
import {
  Heart,
  MapPin,
  Compass,
  Users,
  Calendar,
  Wallet,
  Sparkles,
  CheckCircle2,
  Lock,
  Vote,
  AlertCircle,
} from 'lucide-react';

interface VotingViewProps {
  language: Language;
  currentParticipant: Participant;
  cards: TravelCard[];
  votingClosed: boolean;
  onVote: (targetParticipantId: string) => Promise<void>;
  isVoting: boolean;
  hasVoted: boolean;
  votedTargetId?: string;
  onBackToScript: () => void;
}

export const VotingView: React.FC<VotingViewProps> = ({
  language,
  currentParticipant,
  cards,
  votingClosed,
  onVote,
  isVoting,
  hasVoted,
  votedTargetId,
  onBackToScript,
}) => {
  const t = translations[language];

  const [selectedCardForVote, setSelectedCardForVote] = useState<TravelCard | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenVoteConfirm = (card: TravelCard) => {
    if (hasVoted || votingClosed || card.participantId === currentParticipant.id) return;
    setErrorMsg(null);
    setSelectedCardForVote(card);
  };

  const handleConfirmVote = async () => {
    if (!selectedCardForVote) return;
    try {
      await onVote(selectedCardForVote.participantId);
      setSelectedCardForVote(null);
    } catch (err: any) {
      setErrorMsg(err.message || t.errorGeneric);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#1A1A1A] text-[#F9F8F6] rounded-3xl p-6 sm:p-8 border border-[#2D2D2D] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#3D3D3D] text-[11px] font-bold text-[#E5E2DA]">
              <Vote className="w-4 h-4 text-[#C25E3E]" />
              <span>{language === 'ko' ? '여행 카드 투표' : 'Bình chọn thẻ du lịch'}</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#F9F8F6]">
              {t.votingTitle}
            </h1>
            <p className="text-[#A8A29E] text-xs sm:text-sm font-normal max-w-xl leading-relaxed">
              {t.votingSubtitle}
            </p>
          </div>

          <button
            onClick={onBackToScript}
            className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] border border-[#3D3D3D] text-[#E5E2DA] text-xs font-semibold transition-colors"
          >
            <span>{language === 'ko' ? '내 발표문 보기' : 'Xem lại bài thuyết trình'}</span>
          </button>
        </div>
      </div>

      {/* Status Banners */}
      {hasVoted && (
        <div className="p-4 rounded-2xl bg-[#F3EFE6] border border-[#E5E2DA] text-[#2D4030] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#2D4030] shrink-0" />
          <div className="text-sm font-semibold">
            <span>{t.voteSuccessTitle}</span> {t.voteSuccessMessage}
          </div>
        </div>
      )}

      {votingClosed && (
        <div className="p-4 rounded-2xl bg-[#F8F6F0] border border-[#E5E2DA] text-[#57534E] flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#C25E3E] shrink-0" />
          <div className="text-sm font-semibold">
            {t.votingClosedNotice}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FDF8F5] border border-[#F5C2BC] text-[#8B3A2B] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#8B3A2B] shrink-0" />
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card) => {
          const isMyCard = card.participantId === currentParticipant.id;
          const isVotedThis = votedTargetId === card.participantId;

          return (
            <div
              key={card.participantId}
              id={`travel-card-${card.participantId}`}
              className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                isMyCard
                  ? 'border-[#2D4030] ring-2 ring-[#2D4030]/10 shadow-sm'
                  : isVotedThis
                  ? 'border-[#C25E3E] ring-2 ring-[#C25E3E]/20 shadow-sm'
                  : 'border-[#E5E2DA] hover:border-[#DCD8CF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
              }`}
            >
              {/* Card Top */}
              <div className="p-6 space-y-4">
                {/* Destination & Student Name Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EFE6] border border-[#E5E2DA] text-[#57534E] text-xs font-mono font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#C25E3E]" />
                      <span>{card.destination}</span>
                    </span>
                    <h3 className="font-editorial text-lg font-bold text-[#1A1A1A] pt-1">
                      {card.displayName}의 여행
                    </h3>
                  </div>

                  {isMyCard && (
                    <span className="px-3 py-1 rounded-xl bg-[#EFECE6] text-[#57534E] text-xs font-mono font-bold">
                      {t.myTripBadge}
                    </span>
                  )}

                  {isVotedThis && (
                    <span className="px-3 py-1 rounded-xl bg-[#F3EFE6] border border-[#E5E2DA] text-[#2D4030] text-xs font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4030]" />
                      <span>내가 투표함</span>
                    </span>
                  )}
                </div>

                {/* Short Description Quote */}
                <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E5E2DA] text-[#1A1A1A] text-xs sm:text-sm font-editorial-body italic leading-relaxed">
                  "{card.shortDescription}"
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-[#57534E] pt-1">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8F6F0] border border-[#E5E2DA]/50">
                    <Compass className="w-3.5 h-3.5 text-[#57534E] shrink-0" />
                    <span className="truncate">{card.theme}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8F6F0] border border-[#E5E2DA]/50">
                    <Users className="w-3.5 h-3.5 text-[#57534E] shrink-0" />
                    <span className="truncate">{card.companion}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8F6F0] border border-[#E5E2DA]/50">
                    <Calendar className="w-3.5 h-3.5 text-[#57534E] shrink-0" />
                    <span className="truncate">{card.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8F6F0] border border-[#E5E2DA]/50">
                    <Wallet className="w-3.5 h-3.5 text-[#57534E] shrink-0" />
                    <span className="truncate">{card.budget}</span>
                  </div>
                </div>

                {/* Key Activity */}
                <div className="text-xs text-[#1A1A1A] flex items-start gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C25E3E] shrink-0 mt-0.5" />
                  <span className="font-semibold">{card.mustDo}</span>
                </div>
              </div>

              {/* Card Bottom Button */}
              <div className="p-4 bg-[#FCFBF9] border-t border-[#E5E2DA]">
                {isMyCard ? (
                  <div className="py-2.5 text-center text-xs font-semibold text-[#A8A29E]">
                    {t.myTripDesc}
                  </div>
                ) : (
                  <button
                    id={`vote-btn-${card.participantId}`}
                    type="button"
                    onClick={() => handleOpenVoteConfirm(card)}
                    disabled={hasVoted || votingClosed || isVoting}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      isVotedThis
                        ? 'bg-[#2D4030] text-white shadow-xs pointer-events-none'
                        : hasVoted || votingClosed
                        ? 'bg-[#EFECE6] text-[#A8A29E] cursor-not-allowed'
                        : 'bg-[#C25E3E] hover:bg-[#A84B2F] text-white shadow-sm active:scale-98'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isVotedThis ? 'fill-current' : ''}`} />
                    <span>{isVotedThis ? '투표 완료된 여행' : t.voteBtn}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedCardForVote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl p-6 sm:p-7 space-y-5 animate-scaleUp text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF8F5] text-[#C25E3E] mx-auto flex items-center justify-center border border-[#F5C2BC]">
              <Heart className="w-8 h-8 fill-[#C25E3E]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                {t.voteConfirmTitle}
              </h3>
              <p className="text-sm text-[#78716C] leading-relaxed">
                <span className="font-bold text-[#1A1A1A]">[{selectedCardForVote.displayName}의 {selectedCardForVote.destination} 여행]</span>
                <br />
                {t.voteConfirmMessage}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCardForVote(null)}
                disabled={isVoting}
                className="py-3 px-4 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-sm font-semibold transition-all"
              >
                {t.cancel}
              </button>
              <button
                id="confirm-vote-submit-btn"
                type="button"
                onClick={handleConfirmVote}
                disabled={isVoting}
                className="py-3 px-4 rounded-xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isVoting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{t.confirm}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
