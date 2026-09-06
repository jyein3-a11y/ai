import React, { useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Lock, AlertCircle } from 'lucide-react';
import { speechService } from '../../utils/speech';
import { OperatingStatus } from '../../utils/operatingHours';

interface WelcomeStepProps {
  highContrast: boolean;
  operatingStatus?: OperatingStatus;
  onStartService: () => void;
  onViewLanding?: () => void;
  isKeyVerified?: boolean;
  onRequireKeyApproval?: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  highContrast,
  operatingStatus,
  onStartService,
  onViewLanding,
  isKeyVerified = false,
  onRequireKeyApproval,
}) => {
  useEffect(() => {
    if (!isKeyVerified) {
      speechService.speak(
        '안녕하세요! 한국법무보호복지공단 디지털 무인안내기입니다. 서비스 시작을 위해 먼저 API Key 승인을 받아주세요.'
      );
    } else {
      speechService.speak(
        '안녕하세요! 한국법무보호복지공단에 오신 것을 환영합니다. 화면 중앙의 서비스 시작하기 버튼을 눌러주세요.'
      );
    }
  }, [isKeyVerified]);

  const handleStartClick = () => {
    if (!isKeyVerified) {
      if (onRequireKeyApproval) {
        onRequireKeyApproval();
      }
      return;
    }
    onStartService();
  };

  return (
    <div
      id="step-welcome"
      className="w-full max-w-3xl mx-auto py-6 sm:py-12 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      {/* Welcome Card Container */}
      <div
        className={`w-full p-8 sm:p-14 rounded-[32px] sm:rounded-[40px] shadow-xl border-2 transition-all flex flex-col items-center justify-center ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100 shadow-slate-200/50'
        }`}
      >
        {/* Emblem / Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold mb-6 border bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700">
          <Shield className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
          <span>한국법무보호복지공단 디지털 무인안내기</span>
        </div>

        {/* Friendly Greetings */}
        <p
          className={`text-xl sm:text-2xl font-bold mb-2 tracking-tight ${
            highContrast ? 'text-yellow-300/90' : 'text-slate-600'
          }`}
        >
          안녕하세요, 반갑습니다!
        </p>

        <h1
          className={`text-3xl sm:text-5xl font-black mb-4 sm:mb-6 tracking-tight leading-snug ${
            highContrast ? 'text-yellow-300' : 'text-slate-900'
          }`}
        >
          한국법무보호복지공단에
          <br />
          오신 것을 환영합니다
        </h1>

        <p
          className={`text-base sm:text-lg mb-8 sm:mb-10 max-w-xl leading-relaxed font-medium ${
            highContrast ? 'text-yellow-300/80' : 'text-slate-500'
          }`}
        >
          자립 지원, 주거 지원, 취업 지원 및 상담 신청 등<br className="hidden sm:inline" />
          공단의 다양한 복지 서비스를 편리하게 확인하실 수 있습니다.
        </p>

        {/* Key Required Alert Banner if not verified */}
        {!isKeyVerified && (
          <div
            className={`w-full max-w-md p-4 mb-6 rounded-2xl border-2 flex items-center justify-between gap-3 text-left transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-amber-600 dark:text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-black">Google Gemini API Key 승인 필요</p>
                <p className="text-[11px] sm:text-xs opacity-80 font-medium">
                  키오스크 검사를 시작하려면 먼저 API Key를 승인받아야 합니다.
                </p>
              </div>
            </div>
            {onRequireKeyApproval && (
              <button
                type="button"
                onClick={onRequireKeyApproval}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                승인받기
              </button>
            )}
          </div>
        )}

        {/* Center: Medium-Sized "서비스 시작하기" Button */}
        <div className="my-2 flex flex-col items-center justify-center w-full">
          <button
            id="btn-welcome-start-service"
            onClick={handleStartClick}
            className={`group inline-flex items-center justify-center gap-3 w-auto min-w-[240px] sm:min-w-[280px] max-w-[360px] py-4 sm:py-4.5 px-8 sm:px-10 text-xl sm:text-2xl font-black rounded-2xl sm:rounded-3xl shadow-lg transition-all transform active:scale-95 cursor-pointer ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-yellow-300 shadow-yellow-400/20'
                : isKeyVerified
                ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5'
            }`}
          >
            {isKeyVerified ? (
              <>
                <span>서비스 시작하기</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <Lock className="w-6 h-6" />
                <span>🔒 서비스 시작 (승인 필요)</span>
              </>
            )}
          </button>

          <p
            className={`text-xs sm:text-sm font-semibold mt-4 tracking-normal ${
              highContrast ? 'text-yellow-300/70' : 'text-slate-400'
            }`}
          >
            화면을 터치하면 안내가 시작됩니다.
          </p>

          {onViewLanding && (
            <button
              id="btn-welcome-view-landing"
              onClick={onViewLanding}
              className={`mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold underline underline-offset-4 cursor-pointer transition-all ${
                highContrast
                  ? 'text-yellow-300 hover:text-white'
                  : 'text-[#3B82F6] hover:text-blue-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>공단 지원 혜택 및 앱 특장점 안내 보기</span>
            </button>
          )}
        </div>

        {/* Operating status simple notification if after hours / holiday */}
        {operatingStatus && !operatingStatus.isBusiness && (
          <div
            className={`mt-8 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400/40 text-yellow-300'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            📢 현재는 {operatingStatus.statusBadge}입니다. (서류 안내 확인, 문자 남기기, 상담 예약 이용 가능)
          </div>
        )}
      </div>
    </div>
  );
};
