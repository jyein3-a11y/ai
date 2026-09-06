import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, MessageSquare, Calendar, Phone, X, BellRing } from 'lucide-react';
import { OperatingMode } from '../types';
import { OperatingStatus, getOperatingStatus } from '../utils/operatingHours';
import { speechService } from '../utils/speech';

interface StaffCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatingMode?: OperatingMode;
  mode?: OperatingMode;
  operatingStatus?: OperatingStatus;
  highContrast: boolean;
  onNavigateToSms?: () => void;
  onGoToSms?: () => void;
  onNavigateToReserve?: () => void;
  onGoToReservation?: () => void;
}

export const StaffCallModal: React.FC<StaffCallModalProps> = ({
  isOpen,
  onClose,
  operatingMode,
  mode,
  operatingStatus: externalStatus,
  highContrast,
  onNavigateToSms,
  onGoToSms,
  onNavigateToReserve,
  onGoToReservation
}) => {
  const [callingState, setCallingState] = useState<'calling' | 'success'>('calling');

  const resolvedMode = operatingMode || mode;
  const status = externalStatus || getOperatingStatus(resolvedMode);
  const isBusiness = status.isBusiness;
  const isHoliday = status.statusType === 'holiday';

  const handleSms = onNavigateToSms || onGoToSms;
  const handleReserve = onNavigateToReserve || onGoToReservation;

  useEffect(() => {
    if (!isOpen) return;

    if (isBusiness) {
      setCallingState('calling');
      speechService.speak('직원을 호출하고 있습니다. 잠시만 기다려주세요.');
      const timer = setTimeout(() => {
        setCallingState('success');
        speechService.speak('직원 호출이 완료되었습니다. 담당 직원이 자리로 안내해 드릴 예정입니다.');
      }, 1200);
      return () => clearTimeout(timer);
    } else if (isHoliday) {
      speechService.speak('지금은 휴일이라 직원이 자리에 없습니다. 문자 문의를 남기시거나 상담 예약을 이용하실 수 있습니다.');
    } else {
      speechService.speak('지금은 업무시간이 지난 야간이라 직원이 자리에 없습니다. 문자 문의를 남기시거나 상담 예약을 이용하실 수 있습니다.');
    }
  }, [isOpen, isBusiness, isHoliday]);

  if (!isOpen) return null;

  return (
    <div
      id="staff-call-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="staff-call-modal"
        className={`w-full max-w-lg p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl border-2 transition-all relative ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        <button
          id="btn-close-staff-call-modal"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {isBusiness ? (
          /* 업무시간: 즉시 직원 호출 */
          <div className="text-center py-4">
            <div
              className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-5 ${
                callingState === 'calling'
                  ? 'bg-blue-100 text-[#3B82F6] animate-pulse'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {callingState === 'calling' ? (
                <BellRing className="w-10 h-10 sm:w-12 sm:h-12 animate-spin" />
              ) : (
                <UserCheck className="w-10 h-10 sm:w-12 sm:h-12" />
              )}
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${
                highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
              }`}
            >
              {callingState === 'calling' ? '직원을 부르는 중입니다' : '직원 호출이 완료되었습니다'}
            </h3>

            <p
              className={`text-base sm:text-lg leading-relaxed mb-6 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              {callingState === 'calling'
                ? '안내 데스크와 담당 직원에게 신호를 보내고 있습니다.'
                : '담당 직원이 계신 곳으로 곧 오실 예정입니다. 잠시만 편히 기다려주세요.'}
            </p>

            <div
              className={`p-5 rounded-2xl mb-6 text-sm sm:text-base border-2 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <p className="font-black mb-1">안내 창구 위치</p>
              <p className="font-medium">본관 1층 안내데스크 앞 상담 대기석</p>
            </div>

            <button
              id="btn-staff-call-confirm"
              onClick={onClose}
              className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              [확인]
            </button>
          </div>
        ) : (
          /* 비업무시간/휴일: 직원이 자리에 없습니다 안내 + 운영시간/영업일 공지 */
          <div className="text-center py-2">
            <div
              className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-yellow-300">
              {status.statusBadge}
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${
                highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
              }`}
            >
              {isHoliday
                ? '지금은 휴일이라 직원이 자리에 없습니다.'
                : '지금은 업무시간이 지나 직원이 자리에 없습니다.'}
            </h3>

            <div
              className={`max-w-md mx-auto p-3.5 rounded-2xl mb-4 text-xs sm:text-sm font-semibold border ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div>공단 영업일: 평일 (월요일 ~ 금요일)</div>
              <div>공단 영업시간: 09:00 ~ 18:00 (토·일·공휴일 휴무)</div>
            </div>

            <p
              className={`text-sm sm:text-base leading-relaxed mb-6 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              {isHoliday
                ? '주말 및 공휴일에는 직원의 즉시 대면 상담이 어렵습니다.'
                : '오늘 업무시간이 종료되었습니다.'}
              <br />
              문자를 남겨주시면 다음 영업일 출근 후 확인하여 연락드리며,
              <br />
              원하시는 평일 날짜로 상담을 미리 예약하실 수 있습니다.
            </p>

            <div className="flex flex-col gap-3.5">
              <button
                id="btn-call-modal-sms"
                onClick={() => {
                  onClose();
                  if (handleSms) handleSms();
                }}
                className={`w-full py-4 px-5 rounded-2xl sm:rounded-3xl text-base sm:text-lg font-black flex items-center justify-center gap-2 border-2 shadow-sm transition-all active:scale-95 ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white border-[#3B82F6] shadow-blue-200'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>[💬 문자로 문의 남기기]</span>
              </button>

              <button
                id="btn-call-modal-reserve"
                onClick={() => {
                  onClose();
                  if (handleReserve) handleReserve();
                }}
                className={`w-full py-4 px-5 rounded-2xl sm:rounded-3xl text-base sm:text-lg font-black flex items-center justify-center gap-2 border-2 shadow-sm transition-all active:scale-95 ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-[#10B981] hover:bg-emerald-600 text-white border-[#10B981] shadow-emerald-200'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>[📅 다음 상담 예약하기]</span>
              </button>

              <button
                id="btn-call-modal-cancel"
                onClick={onClose}
                className={`w-full py-3.5 rounded-2xl sm:rounded-3xl text-base font-bold border-2 transition-all active:scale-95 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                [확인]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
