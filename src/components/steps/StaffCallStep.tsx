import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, MessageSquare, Users, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { StaffMember } from '../../types';
import { speechService } from '../../utils/speech';

interface StaffCallStepProps {
  staff: StaffMember;
  availableAlternativeStaff?: StaffMember;
  highContrast: boolean;
  onGoToSms: () => void;
  onGoHome: () => void;
}

export const StaffCallStep: React.FC<StaffCallStepProps> = ({
  staff,
  availableAlternativeStaff,
  highContrast,
  onGoToSms,
  onGoHome
}) => {
  // 상태: 'dialing' | 'connected' | 'unreachable' | 'transferring' | 'transferred'
  const [callStatus, setCallStatus] = useState<
    'dialing' | 'connected' | 'unreachable' | 'transferring' | 'transferred'
  >('dialing');

  const [countdown, setCountdown] = useState<number>(30);

  useEffect(() => {
    speechService.speak(`${staff.name} 직원에게 전화를 연결하고 있습니다. 잠시만 기다려주세요.`);

    // 실제 전화 연결 시뮬레이션 (staff.isAvailable 기준)
    const dialTimer = setTimeout(() => {
      if (staff.isAvailable) {
        setCallStatus('connected');
        speechService.speak(`${staff.name} 직원과 전화가 연결되었습니다.`);
      } else {
        setCallStatus('unreachable');
        speechService.speak('담당 직원과 연결되지 않았습니다. 문자 남기기나 다른 직원에게 연결하기를 선택하실 수 있습니다.');
      }
    }, 2800);

    return () => clearTimeout(dialTimer);
  }, [staff]);

  // 다른 직원 연결 시작
  const startTransfer = () => {
    setCallStatus('transferring');
    setCountdown(30);
    speechService.speak('잠시 기다려주세요. 다른 직원에게 연결해드릴게요.');
  };

  useEffect(() => {
    if (callStatus !== 'transferring') return;

    if (countdown <= 0) {
      if (availableAlternativeStaff) {
        setCallStatus('transferred');
        speechService.speak(`${availableAlternativeStaff.name} 직원에게 전화가 연결되었습니다.`);
      } else {
        setCallStatus('unreachable');
        speechService.speak('연결 가능한 다른 직원이 없습니다.');
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus, countdown, availableAlternativeStaff]);

  return (
    <div id="step-staff-call" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        {/* Dialing State */}
        {callStatus === 'dialing' && (
          <div className="py-8">
            <div
              className={`w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
              }`}
            >
              <Phone className="w-12 h-12 animate-bounce" />
            </div>
            <h2
              className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
                highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
              }`}
            >
              [📞 {staff.name} 직원에게 전화 연결 중...]
            </h2>
            <p className="text-lg opacity-80 mb-4 font-bold text-[#3B82F6]">
              전화번호: {staff.phone}
            </p>
            <p className="text-sm opacity-70 font-medium">
              실제 시스템에 등록된 번호로 연결 신호를 보내고 있습니다.
            </p>
          </div>
        )}

        {/* Connected State */}
        {callStatus === 'connected' && (
          <div className="py-6 animate-fadeIn">
            <div
              className={`w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black mb-2 text-emerald-600 dark:text-yellow-300">
              담당 직원과 전화가 연결되었습니다.
            </h2>
            <p className="text-base sm:text-lg mb-8 opacity-85 font-medium">
              {staff.name} 직원 ({staff.phone})과 통화 중입니다. 수화기를 들고 말씀해 주세요.
            </p>
            <button
              onClick={onGoHome}
              className={`py-4 sm:py-5 px-8 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-slate-800 text-white hover:bg-slate-900'
              }`}
            >
              [통화 종료 및 처음으로]
            </button>
          </div>
        )}

        {/* Unreachable State (Prompt Exact Match) */}
        {callStatus === 'unreachable' && (
          <div className="py-4 animate-fadeIn">
            <div
              className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <PhoneOff className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-2 text-rose-700 dark:text-yellow-300">
              "담당 직원과 연결되지 않았습니다."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 leading-relaxed font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              현재 통화 중이거나 자리를 비워 연결이 되지 않았습니다.
              <br />
              문자를 남겨주시거나 다른 직원에게 연결해 드릴 수 있습니다.
            </p>

            {/* Buttons strictly matching prompt */}
            <div className="flex flex-col gap-3.5 max-w-md mx-auto">
              <button
                id="btn-call-leave-sms"
                onClick={onGoToSms}
                className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>[💬 문자 남기기]</span>
              </button>

              {availableAlternativeStaff && (
                <button
                  id="btn-call-other-staff"
                  onClick={startTransfer}
                  className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold flex items-center justify-center gap-2 border-2 active:scale-95 transition-all ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>[👤 다른 직원에게 연결하기]</span>
                </button>
              )}

              <button
                id="btn-call-go-home"
                onClick={onGoHome}
                className={`w-full py-3.5 px-6 rounded-2xl sm:rounded-3xl text-base font-bold border-2 transition-all active:scale-95 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4 inline mr-1.5" />
                <span>[↩ 처음으로]</span>
              </button>
            </div>
          </div>
        )}

        {/* Transferring State (30 seconds countdown) */}
        {callStatus === 'transferring' && (
          <div className="py-6">
            <div
              className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>

            <h2
              className={`text-2xl sm:text-4xl font-black mb-3 ${
                highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
              }`}
            >
              "잠시 기다려주세요. 다른 직원에게 연결해드릴게요."
            </h2>

            <p
              className={`text-base sm:text-lg mb-4 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              연결 가능한 다른 직원을 확인하여 교환 중입니다.
            </p>

            <div
              className={`max-w-xs mx-auto py-3.5 px-6 rounded-2xl text-xl font-black mb-6 ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-blue-50 text-blue-800'
              }`}
            >
              대기 시간: {countdown}초
            </div>

            <button
              onClick={() => setCallStatus('unreachable')}
              className="text-sm font-bold opacity-70 underline hover:opacity-100"
            >
              대기 취소하고 다른 방법 선택
            </button>
          </div>
        )}

        {/* Transferred State */}
        {callStatus === 'transferred' && availableAlternativeStaff && (
          <div className="py-6 animate-fadeIn">
            <div
              className={`w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black mb-2 text-emerald-600 dark:text-yellow-300">
              다른 직원과 전화가 연결되었습니다.
            </h2>
            <p className="text-base sm:text-lg mb-8 opacity-85 font-medium">
              대체 상담 직원: {availableAlternativeStaff.name} ({availableAlternativeStaff.department})
            </p>
            <button
              onClick={onGoHome}
              className={`py-4 sm:py-5 px-8 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-slate-800 text-white hover:bg-slate-900'
              }`}
            >
              [통화 종료 및 처음으로]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
