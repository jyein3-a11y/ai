import React, { useEffect } from 'react';
import { AlertOctagon, RefreshCw, UserCheck, RotateCcw } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface SystemErrorStepProps {
  highContrast: boolean;
  onRetry: () => void;
  onCallDesk: () => void;
  onGoHome: () => void;
}

export const SystemErrorStep: React.FC<SystemErrorStepProps> = ({
  highContrast,
  onRetry,
  onCallDesk,
  onGoHome
}) => {
  useEffect(() => {
    speechService.speak(
      '현재 시스템에 연결되지 않아 처리하지 못했습니다. 다시 시도하시거나 직원에게 문의해 주세요.'
    );
  }, []);

  return (
    <div id="step-system-error" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-rose-200'
        }`}
      >
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
            highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
          }`}
        >
          <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-700 dark:text-yellow-300 tracking-tight">
          "현재 시스템에 연결되지 않아 처리하지 못했습니다."
        </h2>

        <p
          className={`text-base sm:text-lg mb-8 font-medium leading-relaxed ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          공단 내부 전산망 통신이 지연되고 있습니다.
          <br />
          임의의 정보를 만들지 않고, 직원이 직접 확인하여 신속하게 도와드리겠습니다.
        </p>

        {/* Action buttons strictly matching prompt */}
        <div className="flex flex-col gap-3.5 max-w-md mx-auto">
          <button
            id="btn-error-retry"
            onClick={onRetry}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            <RefreshCw className="w-5 h-5" />
            <span>[다시 시도하기]</span>
          </button>

          <button
            id="btn-error-call-staff"
            onClick={onCallDesk}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold flex items-center justify-center gap-2 border-2 active:scale-95 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : 'bg-[#10B981] hover:bg-emerald-600 text-white border-[#10B981] shadow-md shadow-emerald-200'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>[직원에게 문의하기]</span>
          </button>

          <button
            id="btn-error-home"
            onClick={onGoHome}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl sm:rounded-3xl text-base font-bold border-2 transition-all active:scale-95 ${
              highContrast
                ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-900'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>[처음으로]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
