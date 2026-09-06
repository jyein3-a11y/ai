import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { speechService } from '../utils/speech';

interface InactivityModalProps {
  isOpen: boolean;
  highContrast: boolean;
  onContinue: () => void;
  onTimeout: () => void;
}

export const InactivityModal: React.FC<InactivityModalProps> = ({
  isOpen,
  highContrast,
  onContinue,
  onTimeout
}) => {
  const [countdown, setCountdown] = useState<number>(30);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(30);
      return;
    }

    setCountdown(30);
    speechService.speak('오랫동안 화면 조작이 없었습니다. 계속 이용하시겠어요? 30초 후 처음 화면으로 돌아갑니다.');

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // When countdown reaches 0 while modal is open, trigger timeout
  useEffect(() => {
    if (isOpen && countdown === 0) {
      onTimeoutRef.current();
    }
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  return (
    <div
      id="inactivity-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-title"
    >
      <div
        id="inactivity-modal"
        className={`w-full max-w-md p-6 sm:p-8 rounded-[32px] sm:rounded-[36px] text-center shadow-2xl border-2 transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        <div
          className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 ${
            highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-amber-100 text-amber-600'
          }`}
        >
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h3
          id="inactivity-title"
          className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          계속 이용하시겠어요?
        </h3>

        <p
          className={`text-base mb-5 font-medium leading-relaxed ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          개인정보 보호를 위해 아무런 조작이 없으면 자동으로 처음 화면으로 돌아갑니다.
        </p>

        <div
          className={`py-3.5 px-4 rounded-2xl text-lg font-black mb-6 ${
            highContrast ? 'bg-zinc-900 text-yellow-400' : 'bg-rose-50 text-rose-700'
          }`}
        >
          <span>{countdown}초 후 자동 종료됩니다</span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            id="btn-inactivity-continue"
            onClick={onContinue}
            className={`w-full py-4 sm:py-4.5 rounded-2xl text-lg font-black shadow-lg transition-all active:scale-95 ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            [네, 계속 이용할게요]
          </button>

          <button
            id="btn-inactivity-reset"
            onClick={onTimeout}
            className={`w-full py-3.5 rounded-2xl text-base font-bold border-2 transition-all active:scale-95 ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              <span>[처음 화면으로 가기]</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
