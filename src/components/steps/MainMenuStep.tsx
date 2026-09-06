import React, { useEffect } from 'react';
import {
  HelpCircle,
  FileCheck2,
  PhoneCall,
  CalendarCheck,
  FileText,
  MessageSquare,
  AlertTriangle,
  CalendarClock,
  ArrowRight,
  Clock
} from 'lucide-react';
import { OperatingMode } from '../../types';
import { OperatingStatus, getOperatingStatus } from '../../utils/operatingHours';
import { speechService } from '../../utils/speech';

interface MainMenuStepProps {
  operatingMode?: OperatingMode;
  mode?: OperatingMode;
  operatingStatus?: OperatingStatus;
  highContrast: boolean;
  privacyAgreed?: boolean;
  isConsented?: boolean;
  onSelectService?: () => void;
  onSelectServiceGuide?: () => void;
  onSelectDocs?: () => void;
  onContactStaff?: () => void;
  onSelectStaffCheck?: () => void;
  onReserve?: () => void;
  onSelectReservation?: () => void;
  onSendSms?: () => void;
  onSelectStaffSms?: () => void;
  onEmergency?: () => void;
  onSelectEmergency?: () => void;
  onManageReservations?: () => void;
  onSelectManageReservation?: () => void;
  onGoToDesk?: () => void;
  onSelectCrisisSupport?: () => void;
}

export const MainMenuStep: React.FC<MainMenuStepProps> = ({
  operatingMode,
  mode,
  operatingStatus: externalStatus,
  highContrast,
  privacyAgreed,
  isConsented,
  onSelectService,
  onSelectServiceGuide,
  onSelectDocs,
  onContactStaff,
  onSelectStaffCheck,
  onReserve,
  onSelectReservation,
  onSendSms,
  onSelectStaffSms,
  onEmergency,
  onSelectEmergency,
  onManageReservations,
  onSelectManageReservation,
  onGoToDesk,
  onSelectCrisisSupport
}) => {
  const currentMode = operatingMode || mode;
  const status = externalStatus || getOperatingStatus(currentMode);
  const isBusiness = status.isBusiness;
  const isHoliday = status.statusType === 'holiday';
  const hasAgreed = privacyAgreed ?? isConsented ?? true;

  const handleSelectService = () => {
    if (onSelectService) onSelectService();
    else if (onSelectServiceGuide) onSelectServiceGuide();
  };

  const handleSelectDocs = () => {
    if (onSelectDocs) onSelectDocs();
    else if (onSelectService) onSelectService();
    else if (onSelectServiceGuide) onSelectServiceGuide();
  };

  const handleContactStaff = () => {
    if (hasAgreed) {
      if (onContactStaff) onContactStaff();
      else if (onSelectStaffCheck) onSelectStaffCheck();
    } else {
      if (onGoToDesk) onGoToDesk();
      else if (onContactStaff) onContactStaff();
      else if (onSelectStaffCheck) onSelectStaffCheck();
    }
  };

  const handleReserve = () => {
    if (hasAgreed) {
      if (onReserve) onReserve();
      else if (onSelectReservation) onSelectReservation();
    } else {
      if (onGoToDesk) onGoToDesk();
      else if (onReserve) onReserve();
      else if (onSelectReservation) onSelectReservation();
    }
  };

  const handleSendSms = () => {
    if (onSendSms) onSendSms();
    else if (onSelectStaffSms) onSelectStaffSms();
  };

  const handleEmergency = () => {
    if (onEmergency) onEmergency();
    else if (onSelectEmergency) onSelectEmergency();
    else if (onSelectCrisisSupport) onSelectCrisisSupport();
  };

  const handleManageReservations = () => {
    if (onManageReservations) onManageReservations();
    else if (onSelectManageReservation) onSelectManageReservation();
  };

  useEffect(() => {
    if (isBusiness) {
      speechService.speak('안녕하세요. 한국법무보호복지공단입니다. 무엇을 도와드릴까요? 원하시는 메뉴를 눌러주세요.');
    } else if (isHoliday) {
      speechService.speak(
        '안녕하세요. 한국법무보호복지공단입니다. 오늘은 휴일로 직원이 근무하지 않는 날입니다. 서비스 알아보기, 서류 안내 확인, 문자 남기기, 상담 예약하기 메뉴를 이용하실 수 있습니다.'
      );
    } else {
      speechService.speak(
        '안녕하세요. 한국법무보호복지공단입니다. 지금은 업무시간 외 야간입니다. 서비스 알아보기, 서류 안내 확인, 문자 남기기, 상담 예약하기 메뉴를 이용하실 수 있습니다.'
      );
    }
  }, [isBusiness, isHoliday]);

  return (
    <div id="step-main-menu" className="w-full max-w-4xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-xl border-2 text-center w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        {/* Operating schedule info badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-3 border bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700">
          <Clock className="w-3.5 h-3.5 text-[#3B82F6] dark:text-yellow-400" />
          <span>공단 운영시간: 평일(월~금) 09:00 ~ 18:00 (토·일·공휴일 휴무)</span>
        </div>

        <p
          className={`text-lg sm:text-2xl font-medium mb-2 sm:mb-3 leading-relaxed ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          안녕하세요. 한국법무보호복지공단입니다.
        </p>

        <h2
          className={`text-3xl sm:text-5xl font-black mb-3 leading-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          {isBusiness
            ? '어떤 도움이 필요하신가요?'
            : isHoliday
            ? '지금은 휴일(쉬는 날)입니다.'
            : '지금은 업무시간 종료(야간)입니다.'}
        </h2>

        {/* Operating & Staff presence status banner */}
        <div
          className={`max-w-2xl mx-auto p-3.5 sm:p-4 rounded-2xl mb-6 sm:mb-8 text-sm sm:text-base font-bold border-2 ${
            isBusiness
              ? highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{isBusiness ? '✅' : '📢'}</span>
            <span>{status.staffStatusText}</span>
          </div>
          {!isBusiness && (
            <div className="text-xs sm:text-sm font-medium mt-1 opacity-90">
              지원 사업 및 필요 서류를 미리 확인하시거나, 문자 남기기 또는 원하시는 날짜로 상담을 예약하실 수 있습니다.
            </div>
          )}
        </div>

        {/* Main Menu Grid in Vibrant Palette */}
        {isBusiness ? (
          /* 업무시간인 경우 */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* ① 어떤 서비스를 받을지 알아보기 */}
            <button
              id="btn-menu-service"
              onClick={handleSelectService}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">🏠</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [① 지원 서비스 알아보기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                주거, 취업, 긴급지원 등 공단 지원 사업 알아보기
              </span>
            </button>

            {/* ② 필요한 서류 확인하기 */}
            <button
              id="btn-menu-docs"
              onClick={handleSelectDocs}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">📋</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [② 필요한 서류 확인하기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                가지고 오신 서류를 체크리스트로 간편하게 확인
              </span>
            </button>

            {/* ③ 담당 직원에게 연락하기 */}
            <button
              id="btn-menu-staff"
              onClick={handleContactStaff}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#8B5CF6] hover:bg-purple-600 text-white shadow-lg shadow-purple-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">📞</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [③ 담당 직원에게 연락하기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                {hasAgreed
                  ? '내 담당 직원 확인 후 전화나 문자로 연결'
                  : '개인정보 미동의 시 창구 안내로 연결'}
              </span>
            </button>

            {/* ④ 상담 예약하기 */}
            <button
              id="btn-menu-reserve"
              onClick={handleReserve}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#F59E0B] hover:bg-amber-600 text-white shadow-lg shadow-amber-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">📅</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [④ 상담 예약하기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                원하는 날짜와 시간을 골라 대면 상담 예약
              </span>
            </button>
          </div>
        ) : (
          /* 비업무시간인 경우 */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* ① 서비스 알아보기 */}
            <button
              id="btn-menu-night-service"
              onClick={handleSelectService}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">🏠</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [① 서비스 알아보기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                공단에서 지원받을 수 있는 사업 내용 안내
              </span>
            </button>

            {/* ② 필요한 서류 안내 보기 */}
            <button
              id="btn-menu-night-docs"
              onClick={handleSelectDocs}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">📋</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [② 필요한 서류 안내 보기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                방문 시 챙겨오실 필수 서류 미리 확인
              </span>
            </button>

            {/* ③ 문자 남기기 */}
            <button
              id="btn-menu-night-sms"
              onClick={handleSendSms}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#8B5CF6] hover:bg-purple-600 text-white shadow-lg shadow-purple-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">💬</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [③ 문자 남기기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                직원이 출근 후 확인할 수 있도록 문의 남기기
              </span>
            </button>

            {/* ④ 상담 예약하기 */}
            <button
              id="btn-menu-night-reserve"
              onClick={handleReserve}
              className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#F59E0B] hover:bg-amber-600 text-white shadow-lg shadow-amber-200'
              }`}
            >
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">📅</span>
              <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                [④ 상담 예약하기]
              </span>
              <span className="text-xs sm:text-sm font-medium opacity-90">
                다음 일하는 날 방문 상담 미리 신청
              </span>
            </button>

            {/* ⑤ 긴급전화 (비업무시간) */}
            <button
              id="btn-menu-night-emergency"
              onClick={handleEmergency}
              className={`sm:col-span-2 flex items-center justify-center gap-4 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-102 transition-all duration-200 active:scale-95 text-center ${
                highContrast
                  ? 'bg-yellow-400 border-2 border-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#EF4444] hover:bg-red-600 text-white shadow-lg shadow-red-200'
              }`}
            >
              <span className="text-4xl sm:text-5xl">🆘</span>
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-black">[⑤ 긴급전화]</div>
                <div className="text-xs sm:text-sm font-medium opacity-90">
                  위기 상황 발생 시 긴급 당직 번호 및 위기상담전화 연결
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Additional Reservation Management Bar */}
        {hasAgreed && (
          <div className="pt-2 flex justify-center">
            <button
              id="btn-menu-manage-reservations"
              onClick={handleManageReservations}
              className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg border-2 transition-all active:scale-95 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <CalendarClock className="w-5 h-5" />
              <span>[📅 기존 예약 변경 및 취소하기]</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
