import React, { useState, useEffect } from 'react';
import { Language, RevisionRecord } from '../types';
import { translations } from '../translations';
import {
  Sparkles,
  Edit3,
  CheckCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  X,
  Send,
  AlertCircle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScriptEditorProps {
  language: Language;
  sentences: string[];
  revisionCount: number;
  onReviseSentence: (sentenceIndex: number, request: string) => Promise<void>;
  onFinalize: () => Promise<void>;
  isRevising: boolean;
  isFinalizing: boolean;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  language,
  sentences,
  revisionCount,
  onReviseSentence,
  onFinalize,
  isRevising,
  isFinalizing,
}) => {
  const t = translations[language];

  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number | null>(null);
  const [revisionRequest, setRevisionRequest] = useState('');
  const [lastRevisedIndex, setLastRevisedIndex] = useState<number | null>(null);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [showTip, setShowTip] = useState(true);

  // Clear highlight after 5 seconds
  useEffect(() => {
    if (lastRevisedIndex !== null) {
      const timer = setTimeout(() => {
        setLastRevisedIndex(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastRevisedIndex]);

  const handleOpenRevision = (index: number) => {
    setSelectedSentenceIndex(index);
    setRevisionRequest('');
  };

  const handleCloseRevision = () => {
    setSelectedSentenceIndex(null);
    setRevisionRequest('');
  };

  const handleApplySuggestion = (text: string) => {
    setRevisionRequest(text);
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSentenceIndex === null || !revisionRequest.trim() || isRevising) return;

    const targetIdx = selectedSentenceIndex;
    await onReviseSentence(targetIdx, revisionRequest.trim());
    setLastRevisedIndex(targetIdx);
    handleCloseRevision();
  };

  const handleConfirmFinalize = async () => {
    setShowFinalizeConfirm(false);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
    await onFinalize();
  };

  const suggestions = [
    t.suggestion1,
    t.suggestion2,
    t.suggestion3,
    t.suggestion4,
    t.suggestion5,
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Banner with Instructions */}
      <div className="bg-[#1A1A1A] text-[#F9F8F6] rounded-3xl p-6 sm:p-7 border border-[#2D2D2D] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#3D3D3D] text-[11px] font-bold tracking-wide text-[#E5E2DA]">
              <Sparkles className="w-3.5 h-3.5 text-[#C25E3E]" />
              <span>{t.scriptEditorTitle}</span>
            </div>
            <h1 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#F9F8F6]">
              {t.scriptEditorInstruction}
            </h1>
            <p className="text-[#A8A29E] text-xs sm:text-sm font-normal">
              {t.sentenceClickHint}
            </p>
          </div>

          {/* Revision count badge */}
          <div className="shrink-0 bg-[#2A2A2A] px-3.5 py-2 rounded-2xl border border-[#3D3D3D] text-center">
            <span className="block text-[10px] uppercase font-bold text-[#A8A29E] font-mono">
              {t.revisionCountBadge}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#F9F8F6] font-mono">
              {revisionCount}
            </span>
          </div>
        </div>
      </div>

      {/* Sentences Container */}
      <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 sm:p-8 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA] text-xs font-bold text-[#78716C]">
          <span className="font-medium">{language === 'ko' ? '📝 문장을 터치하여 수정해 보세요' : '📝 Bấm vào từng câu để chỉnh sửa'}</span>
          <span className="font-mono text-[11px]">{language === 'ko' ? `총 ${sentences.length}개 문장` : `Tổng cộng ${sentences.length} câu`}</span>
        </div>

        {/* List of Sentences */}
        <div className="space-y-3 pt-2">
          {sentences.map((sentence, index) => {
            const isJustRevised = lastRevisedIndex === index;
            return (
              <div
                key={index}
                id={`sentence-card-${index}`}
                onClick={() => handleOpenRevision(index)}
                role="button"
                tabIndex={0}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                  isJustRevised
                    ? 'border-[#C25E3E] bg-[#FDF8F5] ring-2 ring-[#C25E3E]/20 shadow-xs'
                    : 'border-[#E5E2DA] hover:border-[#C25E3E]/60 hover:bg-[#FDFBF7] bg-[#FCFBF9] text-[#1A1A1A]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Number Badge */}
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors font-mono ${
                      isJustRevised
                        ? 'bg-[#C25E3E] text-white shadow-xs'
                        : 'bg-[#EFECE6] group-hover:bg-[#1A1A1A] group-hover:text-white text-[#57534E]'
                    }`}
                  >
                    {index + 1}
                  </span>

                  {/* Sentence text */}
                  <p className="flex-1 font-editorial-body text-base sm:text-lg font-normal leading-relaxed tracking-normal text-[#1A1A1A]">
                    {sentence}
                  </p>

                  {/* Edit icon indicator */}
                  <div className="shrink-0 text-[#A8A29E] group-hover:text-[#C25E3E] transition-colors pt-0.5">
                    <Edit3 className="w-4 h-4" />
                  </div>
                </div>

                {/* Just revised badge */}
                {isJustRevised && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#C25E3E] text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FDF8F5]" />
                    <span>{language === 'ko' ? '방금 수정됨!' : 'Vừa chỉnh sửa!'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 mt-6 border-t border-[#E5E2DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#78716C] text-center sm:text-left">
            {language === 'ko'
              ? '✨ 만족할 때까지 원하는 만큼 자유롭게 고친 후 완료 버튼을 눌러주세요.'
              : '✨ Chỉnh sửa thoải mái cho đến khi bạn hài lòng rồi bấm nút Hoàn tất.'}
          </div>

          <button
            id="finalize-script-btn"
            type="button"
            onClick={() => setShowFinalizeConfirm(true)}
            disabled={isFinalizing || isRevising}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#2D4030] hover:bg-[#1E2E21] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
          >
            {isFinalizing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'ko' ? '발표문 완성 중...' : 'Đang hoàn tất...'}</span>
              </div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{t.finalizeScriptBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Revision Modal / Sheet */}
      {selectedSentenceIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#1A1A1A] p-5 text-[#F9F8F6] flex items-center justify-between border-b border-[#2D2D2D]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#C25E3E]" />
                <h3 className="font-editorial font-bold text-lg text-[#F9F8F6]">{t.revisionModalTitle}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#2A2A2A] border border-[#3D3D3D] text-[#E5E2DA] font-mono">
                  {selectedSentenceIndex + 1}번 문장
                </span>
              </div>
              <button
                onClick={handleCloseRevision}
                disabled={isRevising}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-[#A8A29E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitRevision} className="p-6 space-y-5 bg-[#FCFBF9]">
              {/* Selected Original Sentence Box */}
              <div className="space-y-1.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#78716C] font-mono text-[11px]">
                  {t.selectedSentenceLabel}
                </span>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5E2DA] text-[#1A1A1A] text-sm font-editorial-body italic leading-relaxed">
                  "{sentences[selectedSentenceIndex]}"
                </div>
              </div>

              {/* Prompt & Input */}
              <div className="space-y-2">
                <label
                  htmlFor="revision-request-input"
                  className="block text-sm font-bold text-[#1A1A1A]"
                >
                  {t.revisionModalPrompt}
                </label>
                <textarea
                  id="revision-request-input"
                  rows={3}
                  maxLength={150}
                  value={revisionRequest}
                  onChange={(e) => setRevisionRequest(e.target.value)}
                  placeholder={t.revisionModalPlaceholder}
                  className="w-full p-3.5 rounded-2xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-[#1A1A1A] text-sm font-medium leading-relaxed resize-none transition-all"
                  autoFocus
                  disabled={isRevising}
                />
              </div>

              {/* Inspiration Suggestions */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-[#78716C] font-mono text-[11px] uppercase">
                  {t.revisionSuggestionsLabel}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      disabled={isRevising}
                      className="text-xs px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F3EFE6] hover:text-[#1A1A1A] border border-[#E5E2DA] text-[#57534E] transition-all font-medium active:scale-95 text-left shadow-xs"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E2DA]">
                <button
                  type="button"
                  onClick={handleCloseRevision}
                  disabled={isRevising}
                  className="px-4 py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-sm font-semibold transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  id="submit-revision-btn"
                  type="submit"
                  disabled={!revisionRequest.trim() || isRevising}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white font-bold text-sm shadow-sm active:scale-98 transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isRevising ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.revisingSentence}</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.revisingBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Finalize Confirmation Modal */}
      {showFinalizeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5E2DA] shadow-2xl p-6 sm:p-7 space-y-5 animate-scaleUp text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F3EFE6] text-[#2D4030] mx-auto flex items-center justify-center border border-[#E5E2DA]">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                {t.finalizeConfirmTitle}
              </h3>
              <p className="text-sm text-[#78716C] leading-relaxed">
                {t.finalizeConfirmMessage}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#E5E2DA] text-xs text-[#78716C] font-mono">
              {language === 'ko'
                ? `현재 총 ${revisionCount}회의 수정을 거친 완성된 발표문입니다.`
                : `Bài thuyết trình đã trải qua ${revisionCount} lần chỉnh sửa.`}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinalizeConfirm(false)}
                className="py-3 px-4 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-sm font-semibold transition-all"
              >
                {t.continueRevisingBtn}
              </button>
              <button
                id="confirm-finalize-btn"
                type="button"
                onClick={handleConfirmFinalize}
                className="py-3 px-4 rounded-xl bg-[#2D4030] hover:bg-[#1E2E21] text-white text-sm font-bold shadow-sm transition-all"
              >
                {t.confirmFinalizeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
