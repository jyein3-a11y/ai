import React, { useEffect } from 'react';
import { ShieldCheck, HelpCircle, UserCheck, ArrowRight } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface ConsentStepProps {
  highContrast: boolean;
  declinedMode?: boolean;
  mode?: string;
  operatingMode?: string;
  onAgree: () => void;
  onDecline: () => void;
  onProceedGeneralService?: () => void;
  onGoToDesk?: () => void;
}

export const ConsentStep: React.FC<ConsentStepProps> = ({
  highContrast,
  declinedMode = false,
  onAgree,
  onDecline,
  onProceedGeneralService,
  onGoToDesk
}) => {
  useEffect(() => {
    if (!declinedMode) {
      speechService.speak(
        '서비스 이용을 위해 필요한 정보를 확인합니다. 안전한 상담 및 안내를 위해 동의 여부를 선택해 주세요.'
      );
    } else {
      speechService.speak(
        '괜찮습니다. 개인정보 없이도 안내를 도와드릴 수 있어요. 원하시는 버튼을 눌러주세요.'
      );
    }
  }, [declinedMode]);

  if (declinedMode) {
    return (
      <div id="step-consent-declined" className="w-full max-w-3xl mx-auto py-4 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-xl border-2 text-center w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
            }`}
          >
            <HelpCircle className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            괜찮습니다. 개인정보 없이도 안내를 도와드릴 수 있어요.
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 leading-relaxed font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            개인정보가 필요하지 않은 일반 서비스 안내를 보시거나,
            <br />
            담당 직원의 창구에서 바로 1:1 대면 안내를 받으실 수 있습니다.
          </p>

          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <button
              id="btn-general-service-guide"
              onClick={onProceedGeneralService}
              className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black flex items-center justify-between shadow-md transition-all active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
              }`}
            >
              <span>[① 일반 서비스 안내 보기]</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <button
              id="btn-go-to-desk-direct"
              onClick={onGoToDesk}
              className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-bold flex items-center justify-between border-2 transition-all active:scale-95 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-md shadow-emerald-200'
              }`}
            >
              <span>[🙋 직원 창구로 바로 가기]</span>
              <UserCheck className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="step-consent" className="w-full max-w-3xl mx-auto py-4 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-xl border-2 text-center w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
            highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
          }`}
        >
          <ShieldCheck className="w-9 h-9 sm:w-10 sm:h-10" />
        </div>

        <h2
          className={`text-2xl sm:text-4xl font-black mb-3 sm:mb-4 tracking-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          서비스 이용을 위해 필요한 정보를 확인합니다.
        </h2>

        <p
          className={`text-base sm:text-lg mb-6 leading-relaxed font-medium ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          보호안내원은 한국법무보호복지공단 방문 대상자의 상담 예약, 담당 직원 확인,
          서류 안내를 위해 필요한 최소한의 정보만 이용합니다.
        </p>

        {/* Policy Box */}
        <div
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl mb-8 text-left text-sm sm:text-base border-2 ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="font-black mb-1.5 flex items-center gap-1.5 text-blue-700 dark:text-yellow-300">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>개인정보 수집 및 이용 안내</span>
          </div>
          <ul className="list-disc list-inside space-y-1 opacity-90 text-xs sm:text-sm">
            <li>수집 목적: 방문 상담 예약, 담당 직원 확인, 문자 안내 발송</li>
            <li>수집 항목: 성명, 연락처 (상담 예약 시)</li>
            <li>이용 기간: 안내 종료 및 화면 종료 즉시 파기</li>
            <li>동의를 거부하실 수 있으며, 미동의 시에도 일반 안내 및 직원 창구 이용이 가능합니다.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <button
            id="btn-consent-agree"
            onClick={onAgree}
            className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black shadow-lg transition-all active:scale-95 ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            [동의하고 시작하기]
          </button>

          <button
            id="btn-consent-decline"
            onClick={onDecline}
            className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-bold border-2 transition-all active:scale-95 ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            [동의하지 않음]
          </button>
        </div>
      </div>
    </div>
  );
};
