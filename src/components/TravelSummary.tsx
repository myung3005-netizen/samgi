import React from 'react';
import { Language, TravelData } from '../types';
import { translations } from '../translations';
import {
  MapPin,
  Compass,
  Users,
  Calendar,
  Wallet,
  Sparkles,
  Luggage,
  Heart,
  ArrowLeft,
  Wand2,
} from 'lucide-react';

interface TravelSummaryProps {
  language: Language;
  travelData: TravelData;
  onEdit: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const TravelSummary: React.FC<TravelSummaryProps> = ({
  language,
  travelData,
  onEdit,
  onGenerate,
  isGenerating,
}) => {
  const t = translations[language];

  const destination = travelData.customDestination || travelData.destination || '-';
  const purpose = travelData.customPurpose || travelData.purpose || '-';
  const companion = travelData.customCompanion || travelData.companion || '-';
  const duration = travelData.duration || '-';
  const budget = travelData.budget || '-';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1A1A1A] p-6 sm:p-8 text-[#F9F8F6] border-b border-[#2D2D2D]">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xl">✈️</span>
            <h1 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#F9F8F6]">{t.summaryTitle}</h1>
          </div>
          <p className="text-[#A8A29E] text-xs sm:text-sm">{t.summarySubtitle}</p>
        </div>

        {/* Content list */}
        <div className="p-6 sm:p-8 space-y-4 bg-[#FCFBF9]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Destination */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center shrink-0 border border-[#E5E2DA]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] font-semibold text-[#78716C] tracking-wider uppercase">{t.summaryDestination}</span>
                <span className="block text-sm font-bold text-[#1A1A1A] truncate">{destination}</span>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center shrink-0 border border-[#E5E2DA]">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] font-semibold text-[#78716C] tracking-wider uppercase">{t.summaryPurpose}</span>
                <span className="block text-sm font-bold text-[#1A1A1A] truncate">{purpose}</span>
              </div>
            </div>

            {/* Companion */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center shrink-0 border border-[#E5E2DA]">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] font-semibold text-[#78716C] tracking-wider uppercase">{t.summaryCompanion}</span>
                <span className="block text-sm font-bold text-[#1A1A1A] truncate">{companion}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center shrink-0 border border-[#E5E2DA]">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] font-semibold text-[#78716C] tracking-wider uppercase">{t.summaryDuration}</span>
                <span className="block text-sm font-bold text-[#1A1A1A] truncate">{duration}</span>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E2DA] sm:col-span-2">
              <div className="w-9 h-9 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center shrink-0 border border-[#E5E2DA]">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[11px] font-semibold text-[#78716C] tracking-wider uppercase">{t.summaryBudget}</span>
                <span className="block text-sm font-bold text-[#1A1A1A]">{budget}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 pt-2">
            {/* Must Do */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#78716C] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C25E3E]" />
                <span className="font-mono text-[11px] tracking-wider uppercase">{t.summaryMustDo}</span>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{travelData.mustDo || '-'}</p>
            </div>

            {/* Must Have */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#78716C] mb-1">
                <Luggage className="w-3.5 h-3.5 text-[#57534E]" />
                <span className="font-mono text-[11px] tracking-wider uppercase">{t.summaryMustHave}</span>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{travelData.mustHave || '-'}</p>
            </div>

            {/* Reason */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E2DA]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#78716C] mb-1">
                <Heart className="w-3.5 h-3.5 text-[#8B3A2B]" />
                <span className="font-mono text-[11px] tracking-wider uppercase">{t.summaryReason}</span>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{travelData.reason || '-'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E5E2DA] gap-3">
            <button
              type="button"
              onClick={onEdit}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E] text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.prev}</span>
            </button>

            <button
              id="generate-script-btn"
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white font-bold text-sm sm:text-base shadow-sm active:scale-98 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.generatingScript}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>{t.generateScriptBtn}</span>
                </>
              )}
            </button>
          </div>

          {isGenerating && (
            <p className="text-center text-xs text-[#C25E3E] font-medium animate-pulse pt-2">
              {t.generatingScriptDesc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
