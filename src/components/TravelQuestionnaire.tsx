import React, { useState } from 'react';
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
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface TravelQuestionnaireProps {
  language: Language;
  initialData?: Partial<TravelData>;
  onComplete: (data: TravelData) => void;
}

export const TravelQuestionnaire: React.FC<TravelQuestionnaireProps> = ({
  language,
  initialData,
  onComplete,
}) => {
  const t = translations[language];

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Form states
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [customDestination, setCustomDestination] = useState(initialData?.customDestination || '');

  const [purpose, setPurpose] = useState(initialData?.purpose || '');
  const [customPurpose, setCustomPurpose] = useState(initialData?.customPurpose || '');

  const [companion, setCompanion] = useState(initialData?.companion || '');
  const [customCompanion, setCustomCompanion] = useState(initialData?.customCompanion || '');

  const [duration, setDuration] = useState(initialData?.duration || '');
  const [budget, setBudget] = useState(initialData?.budget || '');

  const [mustDo, setMustDo] = useState(initialData?.mustDo || '');
  const [mustHave, setMustHave] = useState(initialData?.mustHave || '');
  const [reason, setReason] = useState(initialData?.reason || '');

  const destinationOptions = [
    { label: '제주도 (Đảo Jeju)', value: '제주도', icon: '🏝️' },
    { label: '서울 (Seoul)', value: '서울', icon: '🏙️' },
    { label: '부산 (Busan)', value: '부산', icon: '🌊' },
    { label: '일본 (Nhật Bản)', value: '일본', icon: '🌸' },
    { label: '베트남 (Việt Nam)', value: '베트남', icon: '🏮' },
    { label: '중국 (Trung Quốc)', value: '중국', icon: '🥟' },
    { label: '태국 (Thái Lan)', value: '태국', icon: '🐘' },
    { label: '미국 (Mỹ)', value: '미국', icon: '🗽' },
    { label: '유럽 (Châu Âu)', value: '유럽', icon: '🏰' },
    { label: language === 'ko' ? '직접 입력' : 'Nhập khác', value: '기타', icon: '✏️' },
  ];

  const purposeOptions = [
    { label: language === 'ko' ? '맛있는 음식 먹기' : 'Thưởng thức ẩm thực ngon', value: '맛있는 음식 먹기', icon: '🍜' },
    { label: language === 'ko' ? '쇼핑하기' : 'Mua sắm', value: '쇼핑하기', icon: '🛍️' },
    { label: language === 'ko' ? '자연 풍경 구경' : 'Ngắm cảnh thiên nhiên', value: '자연 풍경 구경', icon: '🏔️' },
    { label: language === 'ko' ? '바다 & 휴양' : 'Biển & Nghỉ dưỡng', value: '바다 & 휴양', icon: '🏖️' },
    { label: language === 'ko' ? '놀이공원 즐기기' : 'Công viên giải trí', value: '놀이공원 즐기기', icon: '🎡' },
    { label: language === 'ko' ? '게임 / 애니메이션 투어' : 'Game & Hoạt hình Anime', value: '게임 / 애니메이션 투어', icon: '🎮' },
    { label: language === 'ko' ? '스포츠 & 액티비티' : 'Thể thao & Hoạt động', value: '스포츠 & 액티비티', icon: '⚽' },
    { label: language === 'ko' ? '역사 & 문화 체험' : 'Lịch sử & Văn hóa', value: '역사 & 문화 체험', icon: '🏛️' },
    { label: language === 'ko' ? '인생 사진 찍기' : 'Chụp ảnh kỷ niệm đẹp', value: '인생 사진 찍기', icon: '📸' },
    { label: language === 'ko' ? '새로운 경험 도전' : 'Trải nghiệm mới lạ', value: '새로운 경험 도전', icon: '✨' },
    { label: language === 'ko' ? '직접 입력' : 'Nhập khác', value: '기타', icon: '✏️' },
  ];

  const companionOptions = [
    { label: language === 'ko' ? '혼자 떠나는 여행' : 'Đi một mình', value: '혼자', icon: '🎒' },
    { label: language === 'ko' ? '가족과 함께' : 'Cùng gia đình', value: '가족', icon: '👨‍👩‍👧‍👦' },
    { label: language === 'ko' ? '가장 친한 친구 1명과' : 'Cùng 1 người bạn thân', value: '가장 친한 친구 1명', icon: '🤝' },
    { label: language === 'ko' ? '친구 여러 명과 신나게' : 'Cùng nhóm bạn bè', value: '친구 여러 명', icon: '🎉' },
    { label: language === 'ko' ? '직접 입력' : 'Nhập khác', value: '기타', icon: '✏️' },
  ];

  const durationOptions = [
    { label: language === 'ko' ? '당일치기' : 'Đi trong ngày', value: '당일치기', icon: '☀️' },
    { label: language === 'ko' ? '1박 2일' : '2 ngày 1 đêm', value: '1박 2일', icon: '🌙' },
    { label: language === 'ko' ? '2박 3일' : '3 ngày 2 đêm', value: '2박 3일', icon: '⭐' },
    { label: language === 'ko' ? '3박 4일' : '4 ngày 3 đêm', value: '3박 4일', icon: '🌟' },
    { label: language === 'ko' ? '4~7일' : '4 ~ 7 ngày', value: '4~7일', icon: '🗓️' },
    { label: language === 'ko' ? '일주일 이상' : 'Hơn 1 tuần', value: '일주일 이상', icon: '✈️' },
  ];

  const budgetOptions = [
    { label: language === 'ko' ? '10만원 이하 (실속형)' : 'Dưới 100 nghìn won', value: '10만원 이하', icon: '🪙' },
    { label: language === 'ko' ? '10~30만원' : '100 ~ 300 nghìn won', value: '10~30만원', icon: '💵' },
    { label: language === 'ko' ? '30~50만원' : '300 ~ 500 nghìn won', value: '30~50만원', icon: '💳' },
    { label: language === 'ko' ? '50~100만원' : '500 nghìn ~ 1 triệu won', value: '50~100만원', icon: '💎' },
    { label: language === 'ko' ? '100만원 이상 (플렉스)' : 'Trên 1 triệu won', value: '100만원 이상', icon: '👑' },
    { label: language === 'ko' ? '예산 상관없음' : 'Không quan trọng ngân sách', value: '예산 상관없음', icon: '✨' },
  ];

  const canGoNext = () => {
    switch (step) {
      case 1:
        return destination === '기타' ? customDestination.trim().length > 0 : destination.length > 0;
      case 2:
        return purpose === '기타' ? customPurpose.trim().length > 0 : purpose.length > 0;
      case 3:
        return companion === '기타' ? customCompanion.trim().length > 0 : companion.length > 0;
      case 4:
        return duration.length > 0;
      case 5:
        return budget.length > 0;
      case 6:
        return mustDo.trim().length > 0;
      case 7:
        return mustHave.trim().length > 0;
      case 8:
        return reason.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const fullData: TravelData = {
        destination,
        customDestination: destination === '기타' ? customDestination : undefined,
        purpose,
        customPurpose: purpose === '기타' ? customPurpose : undefined,
        companion,
        customCompanion: companion === '기타' ? customCompanion : undefined,
        duration,
        budget,
        mustDo,
        mustHave,
        reason,
      };
      onComplete(fullData);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Progress Card */}
      <div className="mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E2DA] shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-[#78716C] mb-2">
          <span className="flex items-center gap-1.5 text-[#C25E3E] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {t.questionTitle}
          </span>
          <span className="font-mono text-[11px] tracking-wider text-[#57534E]">
            {t.stepIndicator} {step} / {totalSteps}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#EFECE6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C25E3E] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Box */}
      <div className="bg-white rounded-3xl border border-[#E5E2DA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        {/* STEP 1: Destination */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qDestination}</h2>
                <p className="text-xs text-[#78716C]">{t.qDestinationSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {destinationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDestination(opt.value)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all text-sm font-semibold ${
                    destination === opt.value
                      ? 'border-[#C25E3E] bg-[#FDF8F5] text-[#1A1A1A] ring-2 ring-[#C25E3E]/20 shadow-xs'
                      : 'border-[#E5E2DA] hover:border-[#D0CBC0] bg-[#FCFBF9] text-[#44403C]'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>

            {destination === '기타' && (
              <div className="pt-2 animate-fadeIn">
                <input
                  type="text"
                  maxLength={30}
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  placeholder={language === 'ko' ? '가고 싶은 여행지를 직접 입력하세요 (예: 런던, 괌, 강릉)' : 'Nhập điểm đến bạn muốn...'}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-2 focus:ring-[#C25E3E]/20 text-sm text-[#1A1A1A]"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Purpose */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qPurpose}</h2>
                <p className="text-xs text-[#78716C]">{t.qPurposeSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {purposeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPurpose(opt.value)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all text-sm font-semibold ${
                    purpose === opt.value
                      ? 'border-[#C25E3E] bg-[#FDF8F5] text-[#1A1A1A] ring-2 ring-[#C25E3E]/20 shadow-xs'
                      : 'border-[#E5E2DA] hover:border-[#D0CBC0] bg-[#FCFBF9] text-[#44403C]'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>

            {purpose === '기타' && (
              <div className="pt-2">
                <input
                  type="text"
                  maxLength={40}
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder={language === 'ko' ? '원하는 여행 목적을 직접 입력하세요' : 'Nhập mục đích chuyến đi...'}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-2 focus:ring-[#C25E3E]/20 text-sm text-[#1A1A1A]"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Companion */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qCompanion}</h2>
                <p className="text-xs text-[#78716C]">{t.qCompanionSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {companionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCompanion(opt.value)}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all text-sm font-semibold ${
                    companion === opt.value
                      ? 'border-[#C25E3E] bg-[#FDF8F5] text-[#1A1A1A] ring-2 ring-[#C25E3E]/20 shadow-xs'
                      : 'border-[#E5E2DA] hover:border-[#D0CBC0] bg-[#FCFBF9] text-[#44403C]'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {companion === '기타' && (
              <div className="pt-2">
                <input
                  type="text"
                  maxLength={30}
                  value={customCompanion}
                  onChange={(e) => setCustomCompanion(e.target.value)}
                  placeholder={language === 'ko' ? '함께 가고 싶은 사람을 직접 적어주세요' : 'Nhập người bạn muốn đi cùng...'}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-2 focus:ring-[#C25E3E]/20 text-sm text-[#1A1A1A]"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Duration */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qDuration}</h2>
                <p className="text-xs text-[#78716C]">{t.qDurationSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {durationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all text-sm font-semibold ${
                    duration === opt.value
                      ? 'border-[#C25E3E] bg-[#FDF8F5] text-[#1A1A1A] ring-2 ring-[#C25E3E]/20 shadow-xs'
                      : 'border-[#E5E2DA] hover:border-[#D0CBC0] bg-[#FCFBF9] text-[#44403C]'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Budget */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qBudget}</h2>
                <p className="text-xs text-[#78716C]">{t.qBudgetSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {budgetOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBudget(opt.value)}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all text-sm font-semibold ${
                    budget === opt.value
                      ? 'border-[#C25E3E] bg-[#FDF8F5] text-[#1A1A1A] ring-2 ring-[#C25E3E]/20 shadow-xs'
                      : 'border-[#E5E2DA] hover:border-[#D0CBC0] bg-[#FCFBF9] text-[#44403C]'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Must-Do Activity */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qMustDo}</h2>
                <p className="text-xs text-[#78716C]">{t.qMustDoSub}</p>
              </div>
            </div>

            <div className="pt-2">
              <textarea
                rows={3}
                maxLength={100}
                value={mustDo}
                onChange={(e) => setMustDo(e.target.value)}
                placeholder={t.qMustDoPlaceholder}
                className="w-full p-4 rounded-2xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-[#1A1A1A] text-sm font-medium leading-relaxed resize-none"
                autoFocus
              />
              <div className="flex justify-between items-center text-xs text-[#A8A29E] mt-1.5 px-1">
                <span>{language === 'ko' ? '예: 야시장 길거리 음식 먹기, 해변에서 일몰 보기' : 'VD: Ăn đồ ăn chợ đêm, ngắm hoàng hôn...'}</span>
                <span>{mustDo.length}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Must-Have Item */}
        {step === 7 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Luggage className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qMustHave}</h2>
                <p className="text-xs text-[#78716C]">{t.qMustHaveSub}</p>
              </div>
            </div>

            <div className="pt-2">
              <textarea
                rows={3}
                maxLength={100}
                value={mustHave}
                onChange={(e) => setMustHave(e.target.value)}
                placeholder={t.qMustHavePlaceholder}
                className="w-full p-4 rounded-2xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-[#1A1A1A] text-sm font-medium leading-relaxed resize-none"
                autoFocus
              />
              <div className="flex justify-between items-center text-xs text-[#A8A29E] mt-1.5 px-1">
                <span>{language === 'ko' ? '예: 스마트폰, 편한 운동화, 셀카봉, 간식' : 'VD: Điện thoại, giày êm, gậy selfie...'}</span>
                <span>{mustHave.length}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Personal Reason */}
        {step === 8 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFE6] text-[#57534E] flex items-center justify-center border border-[#E5E2DA]">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">{t.qReason}</h2>
                <p className="text-xs text-[#78716C]">{t.qReasonSub}</p>
              </div>
            </div>

            <div className="pt-2">
              <textarea
                rows={3}
                maxLength={120}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.qReasonPlaceholder}
                className="w-full p-4 rounded-2xl border border-[#DCD8CF] bg-white focus:border-[#C25E3E] focus:ring-3 focus:ring-[#C25E3E]/15 text-[#1A1A1A] text-sm font-medium leading-relaxed resize-none"
                autoFocus
              />
              <div className="flex justify-between items-center text-xs text-[#A8A29E] mt-1.5 px-1">
                <span>{language === 'ko' ? '예: 공부 스트레스를 풀고 소중한 추억을 만들고 싶어서' : 'VD: Xả stress học tập, tạo kỷ niệm đẹp...'}</span>
                <span>{reason.length}/120</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons (Back & Next) */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E5E2DA]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              step === 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-[#EFECE6] hover:bg-[#E5E2DA] text-[#57534E]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.prev}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C25E3E] hover:bg-[#A84B2F] text-white font-bold text-sm shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-98"
          >
            <span>{step === totalSteps ? t.submit : t.next}</span>
            {step === totalSteps ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
