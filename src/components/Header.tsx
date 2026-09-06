import React from 'react';
import { Volume2, VolumeX, Eye, Sun, Moon, LogOut, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { OperatingMode } from '../types';
import { OperatingStatus, getOperatingStatus } from '../utils/operatingHours';
import { speechService } from '../utils/speech';

interface HeaderProps {
  operatingMode?: OperatingMode;
  mode?: OperatingMode;
  operatingStatus?: OperatingStatus;
  onToggleOperatingMode?: () => void;
  onToggleMode?: () => void;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onCycleFontSize?: () => void;
  onChangeFontSize?: (size: 'normal' | 'large' | 'xlarge') => void;
  onEndSession?: () => void;
  onGoToLanding?: () => void;
  isKeyVerified?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  operatingMode,
  mode,
  operatingStatus: externalStatus,
  onToggleOperatingMode,
  onToggleMode,
  ttsEnabled,
  onToggleTts,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onCycleFontSize,
  onChangeFontSize,
  onEndSession,
  onGoToLanding,
  isKeyVerified
}) => {
  const resolvedMode = operatingMode || mode;
  const status = externalStatus || getOperatingStatus(resolvedMode);
  const isBusiness = status.isBusiness;

  const handleToggleMode = onToggleOperatingMode || onToggleMode;
  
  const handleSelectFontSize = (newSize: 'normal' | 'large') => {
    if (onChangeFontSize) {
      onChangeFontSize(newSize);
    } else if (onCycleFontSize) {
      onCycleFontSize();
    }
    if (ttsEnabled) {
      speechService.speak(
        newSize === 'large' ? '글자가 크게 확대되었습니다.' : '글자가 보통 크기로 변경되었습니다.'
      );
    }
  };

  return (
    <header
      id="app-header"
      className={`w-full border-b transition-colors shadow-sm ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
    >
      {/* Top institution bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-center font-bold transition-transform ${
              highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-[#3B82F6] text-white shadow-md shadow-blue-200'
            }`}
          >
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold tracking-tight text-slate-500 dark:text-yellow-400/80">
              한국법무보호복지공단
            </div>
            <div className="text-2xl sm:text-4xl font-black text-[#1E293B] dark:text-yellow-300 tracking-tight flex items-center gap-2 flex-wrap">
              <span>보호안내원</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold tracking-normal ${
                  status.statusType === 'holiday'
                    ? highContrast
                      ? 'bg-zinc-800 text-yellow-300 border border-yellow-400'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                    : status.statusType === 'after_hours'
                    ? highContrast
                      ? 'bg-zinc-800 text-yellow-300 border border-yellow-400'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                    : isBusiness
                    ? highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : highContrast
                    ? 'bg-zinc-800 text-yellow-300 border border-yellow-400'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {status.statusBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Right side accessibility controls & End session */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Operating Mode Test Simulator Toggle */}
          {handleToggleMode && (
            <button
              id="btn-toggle-operating-mode"
              onClick={handleToggleMode}
              title="운영 시간대 전환 테스트 (업무시간 / 휴일·야간)"
              className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border-2 font-bold transition-all active:scale-95 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">시간대:</span>
              <span>{isBusiness ? '업무시간' : '휴일·야간'}</span>
            </button>
          )}

          {/* High Contrast Toggle matching Design HTML */}
          <button
            id="btn-toggle-high-contrast"
            onClick={onToggleHighContrast}
            aria-label="저시력자를 위한 고대비 모드 전환"
            className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-base border-2 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300'
                : 'bg-[#1E293B] hover:bg-slate-800 text-white border-[#1E293B] shadow-sm'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{highContrast ? '고대비 켜짐' : '고대비 모드'}</span>
          </button>

          {/* Font Size Selector (글자 보통 / 글자 크게 옵션) */}
          <div
            className={`flex items-center p-0.5 sm:p-1 rounded-full border-2 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400'
                : 'bg-slate-100 border-slate-300 shadow-sm'
            }`}
            role="group"
            aria-label="글자 크기 선택"
          >
            <button
              id="btn-font-size-normal"
              type="button"
              onClick={() => handleSelectFontSize('normal')}
              aria-pressed={fontSize === 'normal'}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                fontSize === 'normal'
                  ? highContrast
                    ? 'bg-yellow-400 text-black shadow'
                    : 'bg-white text-blue-800 shadow-sm border border-slate-200'
                  : highContrast
                  ? 'text-yellow-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              글자 보통
            </button>
            <button
              id="btn-font-size-large"
              type="button"
              onClick={() => handleSelectFontSize('large')}
              aria-pressed={fontSize === 'large' || fontSize === 'xlarge'}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer ${
                fontSize === 'large' || fontSize === 'xlarge'
                  ? highContrast
                    ? 'bg-yellow-400 text-black shadow'
                    : 'bg-white text-blue-800 shadow-sm border border-slate-200'
                  : highContrast
                  ? 'text-yellow-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              글자 크게
            </button>
          </div>

          {/* Go to Landing Page */}
          {onGoToLanding && (
            <button
              id="btn-go-to-landing"
              onClick={onGoToLanding}
              aria-label="서비스 소개 랜딩페이지로 이동"
              className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                highContrast
                  ? 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-blue-50 text-blue-800 border-2 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-yellow-400" />
              <span>서비스 소개</span>
              {isKeyVerified && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              )}
            </button>
          )}

          {isKeyVerified && (
            <div className="hidden xl:flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-zinc-900 text-emerald-700 dark:text-yellow-300 border border-emerald-200 dark:border-yellow-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-yellow-400" />
              <span>AI 연동됨</span>
            </div>
          )}

          {/* End Session */}
          <button
            id="btn-end-session"
            onClick={onEndSession}
            aria-label="이용 종료 및 개인정보 삭제"
            className={`flex items-center gap-1 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-bold transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-rose-50 text-rose-700 border-2 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>이용 종료</span>
          </button>
        </div>
      </div>

      {/* TTS Banner: 🔊 전체 내용 들으면서 진행하기 matching Design HTML */}
      <div
        className={`px-4 sm:px-8 py-2.5 border-t transition-colors ${
          highContrast
            ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
            : ttsEnabled
            ? 'bg-blue-50/90 border-[#E2E8F0] text-blue-900'
            : 'bg-slate-50/80 border-[#E2E8F0] text-slate-600'
        }`}
      >
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <button
            id="btn-toggle-tts-main"
            onClick={onToggleTts}
            className={`flex items-center gap-2 text-sm sm:text-xl font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full border-2 transition-all ${
              ttsEnabled
                ? highContrast
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-md shadow-blue-200'
                : highContrast
                ? 'border-yellow-400 text-yellow-300 bg-transparent'
                : 'bg-[#EFF6FF] border-[#3B82F6] text-[#3B82F6] hover:bg-blue-100'
            }`}
          >
            <span className="text-xl sm:text-2xl">🔊</span>
            <span>전체 읽어주기</span>
            <span className="text-xs sm:text-sm font-normal opacity-85 ml-1">
              ({ttsEnabled ? '음성 켜짐' : '음성 꺼짐'})
            </span>
          </button>

          <span className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:inline">
            화면의 큰 버튼을 직접 눌러 진행하실 수도 있습니다
          </span>
        </div>
      </div>
    </header>
  );
};
