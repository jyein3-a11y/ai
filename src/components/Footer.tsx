import React, { useState, useEffect } from 'react';
import { UserCheck, PhoneCall, ArrowLeft, RotateCcw, HeartPulse, Clock, Calendar } from 'lucide-react';
import { OperatingStatus, getOperatingStatus } from '../utils/operatingHours';
import { OperatingMode } from '../types';

interface FooterProps {
  highContrast: boolean;
  canGoBack?: boolean;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  onGoBack?: () => void;
  onBack?: () => void;
  onGoHome?: () => void;
  onHome?: () => void;
  onCallStaff: () => void;
  crisisActive?: boolean;
  onOpenCrisis?: () => void;
  showNavControls?: boolean;
  isBusiness?: boolean;
  operatingMode?: OperatingMode;
  operatingStatus?: OperatingStatus;
  onExit?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  highContrast,
  canGoBack,
  showBackButton,
  showHomeButton = true,
  onGoBack,
  onBack,
  onGoHome,
  onHome,
  onCallStaff,
  crisisActive = false,
  onOpenCrisis,
  showNavControls = true,
  isBusiness,
  operatingMode,
  operatingStatus: externalStatus
}) => {
  const [internalStatus, setInternalStatus] = useState<OperatingStatus>(() =>
    getOperatingStatus(operatingMode ?? (isBusiness !== undefined ? (isBusiness ? 'business' : 'after_hours') : null))
  );

  useEffect(() => {
    const update = () => {
      const modeToUse = operatingMode ?? (isBusiness !== undefined ? (isBusiness ? 'business' : 'after_hours') : null);
      setInternalStatus(getOperatingStatus(modeToUse));
    };
    update();
    const interval = setInterval(update, 15000); // 15초마다 시간 및 상태 갱신
    return () => clearInterval(interval);
  }, [operatingMode, isBusiness]);

  const currentStatus = externalStatus || internalStatus;
  const isCurrentlyWorking = currentStatus.isBusiness;

  const handleBack = onGoBack || onBack;
  const handleHome = onGoHome || onHome;
  const allowBack = showBackButton !== undefined ? showBackButton : Boolean(canGoBack);

  return (
    <footer
      id="app-footer"
      className={`sticky bottom-0 z-40 w-full border-t-4 transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-white border-[#E2E8F0] text-slate-900 shadow-xl'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 sm:py-5 flex flex-col gap-3">
        {/* 7-2 정서적 위기 상담 지속 노출 배너 */}
        {crisisActive && (
          <div
            id="persistent-crisis-banner"
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 font-bold text-xs sm:text-base animate-pulse ${
              highContrast
                ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
                : 'bg-amber-50 text-amber-950 border-amber-300 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500 shrink-0" />
              <span>[혼자 견디지 마세요] 마음이 힘드실 땐 24시간 언제든 상담 가능합니다</span>
            </div>
            {onOpenCrisis && (
              <button
                id="btn-footer-crisis-call"
                onClick={onOpenCrisis}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1 shrink-0 ${
                  highContrast
                    ? 'bg-yellow-400 text-black'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>[📞 위기상담 연결]</span>
              </button>
            )}
          </div>
        )}

        {/* 3-column / responsive grid matching Design HTML */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 sm:gap-4">
          {/* Left Navigation Buttons: [처음으로], [뒤로가기] */}
          <div className="flex items-center gap-2 sm:gap-3 justify-start">
            {showNavControls && showHomeButton && handleHome && (
              <button
                id="btn-footer-home"
                onClick={handleHome}
                className={`flex items-center justify-center gap-1.5 px-4 sm:px-8 py-2.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-xl border-2 transition-all active:scale-95 ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>처음으로</span>
              </button>
            )}

            {showNavControls && allowBack && handleBack && (
              <button
                id="btn-footer-back"
                onClick={handleBack}
                className={`flex items-center justify-center gap-1.5 px-4 sm:px-8 py-2.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-xl border-2 transition-all active:scale-95 ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>뒤로가기</span>
              </button>
            )}
          </div>

          {/* Center Info Text reflecting accurate business days, hours, and staff presence */}
          <div className="text-center order-last md:order-none px-2">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span
                className={`font-extrabold text-xs sm:text-sm ${
                  highContrast ? 'text-yellow-300' : 'text-slate-700'
                }`}
              >
                {currentStatus.dateStr} {currentStatus.timeStr}
              </span>
              <span
                className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
                  currentStatus.statusType === 'holiday'
                    ? highContrast
                      ? 'bg-zinc-800 text-yellow-300 border border-yellow-400'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                    : currentStatus.statusType === 'after_hours'
                    ? highContrast
                      ? 'bg-zinc-800 text-yellow-300 border border-yellow-400'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                    : currentStatus.statusType === 'lunch'
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                    : highContrast
                    ? 'bg-yellow-400 text-black'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {currentStatus.statusBadge}
              </span>
            </div>

            {/* 영업일 및 운영시간 기본 안내 */}
            <p
              className={`text-[11px] sm:text-xs font-semibold mt-0.5 opacity-80 ${
                highContrast ? 'text-yellow-300/80' : 'text-slate-500'
              }`}
            >
              운영시간: 평일(월~금) 09:00~18:00 (토·일·공휴일 휴무)
            </p>

            {/* 직원 재실 / 부재 상세 문구 (사용자 요청 반영) */}
            <p
              className={`font-black text-xs sm:text-sm mt-1 transition-colors ${
                isCurrentlyWorking
                  ? highContrast
                    ? 'text-yellow-300'
                    : 'text-emerald-700'
                  : highContrast
                  ? 'text-yellow-400'
                  : 'text-rose-600'
              }`}
            >
              {currentStatus.staffStatusText}
            </p>
          </div>

          {/* Right Staff Call Button matching Design HTML */}
          <div className="flex justify-end">
            <button
              id="btn-fixed-call-staff"
              onClick={onCallStaff}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl sm:rounded-3xl text-lg sm:text-2xl font-black transition-all active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#EF4444] hover:bg-red-600 text-white shadow-lg shadow-red-200'
              }`}
            >
              <span className="text-2xl sm:text-3xl">🙋</span>
              <span>직원 호출</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

