import React, { useEffect, useState } from 'react';
import { AlertTriangle, Phone, Heart, UserCheck, X, PhoneCall, ShieldAlert } from 'lucide-react';
import { speechService } from '../../utils/speech';
import { OFFICIAL_CONTACTS } from '../../data/systemData';

interface EmergencyStepProps {
  isCrisisMode: boolean;
  highContrast: boolean;
  onCallDesk: () => void;
  onCancel: () => void;
}

export const EmergencyStep: React.FC<EmergencyStepProps> = ({
  isCrisisMode,
  highContrast,
  onCallDesk,
  onCancel
}) => {
  const [dialingNumber, setDialingNumber] = useState<string | null>(null);

  useEffect(() => {
    if (isCrisisMode) {
      speechService.speak('많이 힘드셨겠어요. 혼자 견디지 않으셔도 됩니다. 위기상담전화나 지금 바로 직원과 이야기하실 수 있습니다.');
    } else {
      speechService.speak('긴급한 상황인가요? 긴급한 도움이 필요한 경우 아래 버튼을 눌러주세요.');
    }
  }, [isCrisisMode]);

  const handleDial = (phone: string, label: string) => {
    setDialingNumber(`${label} (${phone})`);
    speechService.speak(`${label} ${phone} 번호로 연결합니다.`);
    // tel: link trigger
    setTimeout(() => {
      window.location.href = `tel:${phone}`;
    }, 600);
  };

  // 7-2 정서적 위기 상황 대응 화면
  if (isCrisisMode) {
    return (
      <div id="step-crisis-support" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-rose-100 shadow-xl'
          }`}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-rose-100 text-rose-600 animate-pulse">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-600 dark:text-yellow-300 leading-tight">
            "많이 힘드셨겠어요.
            <br />
            혼자 견디지 않으셔도 됩니다."
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 leading-relaxed font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            언제든 당신의 이야기를 진심으로 들어줄 전문 상담사와 공단 직원이 함께 있습니다.
            <br />
            지금 바로 전문 상담을 연결해 드릴게요.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {/* [📞 위기상담전화 연결] */}
            <button
              id="btn-crisis-dial-109"
              onClick={() => handleDial(OFFICIAL_CONTACTS.crisisHotline109, '자살예방 상담전화')}
              className={`w-full py-5 px-6 sm:px-8 rounded-2xl sm:rounded-3xl text-xl font-black flex items-center justify-between shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <PhoneCall className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-lg sm:text-xl">[📞 위기상담전화 연결]</div>
                  <div className="text-xs sm:text-sm font-bold opacity-90">
                    자살예방 상담전화 (국번없이 109 / 24시간 운영)
                  </div>
                </div>
              </div>
              <span className="text-sm font-black bg-white/20 px-3 py-1.5 rounded-xl">통화 연결</span>
            </button>

            {/* 정신건강 위기상담전화 */}
            <button
              id="btn-crisis-dial-1577"
              onClick={() => handleDial(OFFICIAL_CONTACTS.crisisHotline1577, '정신건강 위기상담전화')}
              className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-2xl sm:rounded-3xl text-lg font-bold flex items-center justify-between border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-amber-500 text-white hover:bg-amber-600 border-amber-500 shadow-md shadow-amber-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Phone className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-base sm:text-lg font-black">정신건강 위기상담전화 연결</div>
                  <div className="text-xs font-bold opacity-90">
                    보건복지부 (1577-0199 / 24시간 상담)
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg">통화 연결</span>
            </button>

            {/* [🙋 지금 바로 직원과 이야기하기] */}
            <button
              id="btn-crisis-call-desk-now"
              onClick={onCallDesk}
              className={`w-full py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-black flex items-center justify-center gap-3 border-2 shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white border-[#3B82F6] shadow-blue-200'
              }`}
            >
              <UserCheck className="w-7 h-7" />
              <span>[🙋 지금 바로 직원과 이야기하기]</span>
            </button>
          </div>

          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border-2 ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            ※ AI는 직접 심리 상담을 진행하지 않으며, 공인된 전문 상담 기관과 사람에게 신속히 연결해 드립니다.
          </div>
        </div>
      </div>
    );
  }

  // 7-1 일반 긴급전화 화면 (프롬프트 엄격 일치)
  return (
    <div id="step-emergency-confirm" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-rose-200 shadow-xl'
        }`}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-rose-100 text-rose-600">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-black mb-2 text-rose-700 dark:text-yellow-300">
          "긴급한 상황인가요?"
        </h2>

        <p
          className={`text-lg sm:text-2xl font-black mb-8 ${
            highContrast ? 'text-yellow-300/90' : 'text-[#1E293B]'
          }`}
        >
          "긴급한 도움이 필요한 경우 아래 버튼을 눌러주세요."
        </p>

        <div
          className={`p-5 rounded-2xl sm:rounded-3xl mb-8 text-left text-sm sm:text-base border-2 ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="font-black mb-1 flex items-center gap-1.5 text-rose-700 dark:text-yellow-300 text-base">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>긴급전화 이용 안내</span>
          </div>
          <p className="opacity-80 font-medium">
            공단 긴급 당직 번호 ({OFFICIAL_CONTACTS.emergencyPhone})로 즉시 연결됩니다.
            긴급하지 않은 일반적인 문의는 담당 직원 전화 또는 문자 기능을 이용해 주시기 바랍니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            id="btn-emergency-connect"
            onClick={() => handleDial(OFFICIAL_CONTACTS.emergencyPhone, '한국법무보호복지공단 긴급전화')}
            className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
            }`}
          >
            <PhoneCall className="w-6 h-6" />
            <span>[📞 긴급전화 연결]</span>
          </button>

          <button
            id="btn-emergency-cancel"
            onClick={onCancel}
            className={`py-5 px-8 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5 inline mr-1" />
            <span>[취소]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
