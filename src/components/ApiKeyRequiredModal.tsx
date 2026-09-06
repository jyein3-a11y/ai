import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowRight,
  X,
  Sparkles,
  Key
} from 'lucide-react';
import { verifyGeminiApiKey } from '../utils/geminiApi';

interface ApiKeyRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  apiKey: string;
  onKeyVerified: (key: string) => void;
  onGoToKeySection?: () => void;
  actionTitle?: string;
}

export const ApiKeyRequiredModal: React.FC<ApiKeyRequiredModalProps> = ({
  isOpen,
  onClose,
  highContrast,
  apiKey,
  onKeyVerified,
  onGoToKeySection,
  actionTitle = '키오스크 검사 및 메뉴'
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  if (!isOpen) return null;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = inputKey.trim().replace(/^["']|["']$/g, '');

    if (!cleanKey) {
      setStatusMessage({
        type: 'error',
        text: 'Google Gemini API Key를 입력해 주세요.',
      });
      return;
    }

    if (cleanKey.length < 20) {
      setStatusMessage({
        type: 'error',
        text: '유효한 Google AI Studio API Key 형식을 확인해 주세요.',
      });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: null, text: '' });

    try {
      const result = await verifyGeminiApiKey(cleanKey);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: result.message || 'API Key가 성공적으로 승인되었습니다!',
        });
        onKeyVerified(cleanKey);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.error || 'API Key 검증에 실패했습니다. 키를 다시 확인해 주세요.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || '검증 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSection = () => {
    onClose();
    if (onGoToKeySection) {
      onGoToKeySection();
    } else {
      const el = document.getElementById('gemini-auth-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const input = document.getElementById('gemini-api-key-input');
          if (input) input.focus();
        }, 500);
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`relative w-full max-w-lg p-6 sm:p-8 rounded-[32px] border-2 shadow-2xl transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 p-2 rounded-full opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center ${
              highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-zinc-800 text-amber-800 dark:text-yellow-300">
              승인 필수 안내
            </span>
            <h3
              id="api-key-modal-title"
              className="text-xl sm:text-2xl font-black tracking-tight mt-0.5"
            >
              Gemini API Key 승인이 필요합니다
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-6 opacity-85 font-medium">
          공단 디지털 무인안내기의 <strong>{actionTitle}</strong> 기능을 이용하시려면,
          먼저 안전한 Google AI Studio API Key 유효성 승인을 완료해야 합니다.
        </p>

        {/* Inline Key Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="modal-api-key-input"
                className="text-xs sm:text-sm font-bold flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-[#3B82F6] dark:text-yellow-400" />
                <span>API Key 직접 입력하여 즉시 승인</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold inline-flex items-center gap-1 text-[#3B82F6] dark:text-yellow-400 hover:underline"
              >
                <span>무료 키 발급</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="modal-api-key-input"
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy... 형식의 API Key를 입력하세요"
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                className={`w-full px-4 py-3.5 pr-11 rounded-xl text-sm font-mono border-2 transition-all outline-none ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300 placeholder-yellow-300/40 focus:border-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#3B82F6] focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'API Key 숨기기' : 'API Key 표시하기'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage.type && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-bold animate-fadeIn ${
                statusMessage.type === 'success'
                  ? highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : highContrast
                  ? 'bg-zinc-900 border-rose-400 text-rose-300'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              id="btn-modal-verify-key"
              type="submit"
              disabled={loading || !inputKey.trim()}
              className={`w-full py-3.5 px-5 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>유효성 검증 중...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>유효성 확인 및 승인받기</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNavigateToSection}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <span>메인 화면의 API Key 승인 섹션으로 이동</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Privacy & Security Note */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-start gap-2 text-[11px] opacity-75">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <p>
            보안 보장: 입력하신 API Key는 브라우저 메모리에만 일회성으로 유지되며 데이터베이스나 서버 디스크에 영구 저장되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
