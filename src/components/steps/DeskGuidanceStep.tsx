import React, { useEffect } from 'react';
import { MapPin, UserCheck, CheckCircle2, RotateCcw, Building2 } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface DeskGuidanceStepProps {
  highContrast: boolean;
  onCallDeskBell: () => void;
  onGoHome: () => void;
}

export const DeskGuidanceStep: React.FC<DeskGuidanceStepProps> = ({
  highContrast,
  onCallDeskBell,
  onGoHome
}) => {
  useEffect(() => {
    speechService.speak(
      '한국법무보호복지공단 1층 안내 창구로 이동해 주세요. 직원이 따뜻하고 친절하게 대면 상담을 도와드립니다.'
    );
  }, []);

  return (
    <div id="step-desk-guidance" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
            highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
          }`}
        >
          <Building2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h2
          className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          1층 직원 창구로 안내해 드립니다
        </h2>

        <p
          className={`text-base sm:text-lg mb-8 font-medium leading-relaxed ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          개인정보 입력 없이도 본관 안내 데스크에서
          <br />
          담당 직원과 1:1로 직접 편안하게 상담받으실 수 있습니다.
        </p>

        <div
          className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl mb-8 text-left border-2 ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-lg sm:text-xl mb-2 text-[#3B82F6] dark:text-yellow-300">
            <MapPin className="w-5 h-5" />
            <span>창구 위치 안내</span>
          </div>
          <p className="text-base sm:text-lg font-black mb-1 text-slate-900 dark:text-yellow-300">
            본관 1층 통합민원안내실 (1~3번 창구)
          </p>
          <p className="text-sm sm:text-base opacity-75 font-medium">
            키오스크 우측 복도를 따라 10m 직진하시면 바로 안내데스크가 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
          <button
            id="btn-desk-ring-bell"
            onClick={onCallDeskBell}
            className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            <UserCheck className="w-5 h-5 inline mr-1.5" />
            <span>[창구에 알리기]</span>
          </button>

          <button
            id="btn-desk-home"
            onClick={onGoHome}
            className={`py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-base font-bold border-2 active:scale-95 transition-all ${
              highContrast
                ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-900'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4 inline mr-1.5" />
            <span>[처음으로]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
