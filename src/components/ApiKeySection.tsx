import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Send,
  RotateCcw,
  Bot,
  ExternalLink,
  Info
} from 'lucide-react';
import { verifyGeminiApiKey, callGemini } from '../utils/geminiApi';

interface ApiKeySectionProps {
  highContrast: boolean;
  apiKey: string;
  isKeyVerified: boolean;
  onKeyVerified: (key: string) => void;
  onResetKey: () => void;
  onStartKiosk: () => void;
}

export const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  highContrast,
  apiKey,
  isKeyVerified,
  onKeyVerified,
  onResetKey,
  onStartKiosk,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  // Quick Interactive AI Ask Console after verification
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputKey.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Google Gemini API Key를 입력해 주세요.',
      });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: null, text: '' });

    const result = await verifyGeminiApiKey(inputKey);
    setLoading(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: result.message || 'Gemini API Key가 안전하게 승인되었습니다.',
      });
      onKeyVerified(inputKey.trim());
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'API Key 검증에 실패했습니다.',
      });
    }
  };

  const handleQuickAsk = async (query: string) => {
    const targetQuery = query || aiPrompt;
    if (!targetQuery.trim() || !apiKey) return;

    setAiPrompt(targetQuery);
    setAiLoading(true);
    setAiResponse(null);

    const systemInstruction =
      '당신은 한국법무보호복지공단의 친절하고 든든한 디지털 보호안내원입니다. 대상자의 안정적인 사회 복귀와 자립을 돕기 위해 주거지원(LH 공공임대), 취업지원(취업성공패키지, 훈련수당), 긴급구호(생계비 50만원), 심리상담에 관해 명쾌하고 따뜻하게 3문장 이내로 핵심만 답변하세요.';

    const result = await callGemini(apiKey, targetQuery, systemInstruction);
    setAiLoading(false);

    if (result.success && result.text) {
      setAiResponse(result.text);
    } else {
      setAiResponse(result.error || '답변을 불러오지 못했습니다.');
    }
  };

  const sampleQuestions = [
    '출소 후 주거 불안을 덜 수 있는 공공임대주택 지원 자격은 어떻게 되나요?',
    '취업성공패키지에 참여하면 직업훈련 수당은 얼마나 받을 수 있나요?',
    '갑작스러운 생계 위기 시 긴급 생계비 50만원은 당일 신청 가능한가요?',
  ];

  return (
    <section
      id="gemini-auth-section"
      className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y transition-all ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-blue-200/80 text-slate-800'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 border shadow-xs bg-white dark:bg-zinc-900 border-blue-200 dark:border-yellow-400 text-[#3B82F6] dark:text-yellow-300">
            <Key className="w-3.5 h-3.5" />
            <span>Server-to-Server Gemini AI Integration</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Gemini API Key 활성화 및 승인
          </h3>
          <p className="text-sm sm:text-base opacity-80 font-medium leading-relaxed">
            보호안내원의 스마트 질의응답 및 맞춤 복지 솔루션 기능을 위해 본인의 Gemini API Key를 활성화하세요.
            CORS 프록시 백엔드를 통해 안전하게 검증됩니다.
          </p>
        </div>

        {/* Card Box */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border-2 transition-all ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-blue-200 shadow-xl shadow-blue-100/50'
          }`}
        >
          {/* Key Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="gemini-api-key-input"
                  className="text-sm sm:text-base font-black flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
                  <span>Google AI Studio API Key</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold inline-flex items-center gap-1 text-[#3B82F6] dark:text-yellow-400 hover:underline"
                >
                  <span>API Key 발급받기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  id="gemini-api-key-input"
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy로 시작하는 Gemini API Key를 입력하세요"
                  disabled={loading || isKeyVerified}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full px-4 sm:px-5 py-4 pr-12 rounded-2xl text-sm sm:text-base font-mono border-2 transition-all outline-none ${
                    highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300 placeholder-yellow-300/40 focus:border-white'
                      : isKeyVerified
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 placeholder-emerald-600/40'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#3B82F6] focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? 'API Key 숨기기' : 'API Key 표시하기'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!isKeyVerified ? (
                <button
                  id="btn-verify-gemini-key"
                  type="submit"
                  disabled={loading || !inputKey.trim()}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>서버에서 유효성 검증 중...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>유효성 확인 및 승인</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div
                    className={`flex-1 py-3.5 px-4 rounded-2xl border flex items-center gap-2.5 ${
                      highContrast
                        ? 'bg-black border-yellow-400 text-yellow-300'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-black">
                      Gemini API Key 승인 완료 (gemini-3.8-flash 활성화)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInputKey('');
                      setStatusMessage({ type: null, text: '' });
                      setAiResponse(null);
                      onResetKey();
                    }}
                    className={`py-3.5 px-4 rounded-2xl border text-sm font-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                      highContrast
                        ? 'bg-zinc-900 border-zinc-700 text-yellow-300 hover:bg-zinc-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>키 초기화</span>
                  </button>
                </div>
              )}
            </div>

            {/* Status Alert Badge */}
            {statusMessage.type && (
              <div
                role="alert"
                className={`p-4 rounded-2xl border flex items-start gap-3 text-sm font-bold animate-fadeIn ${
                  statusMessage.type === 'success'
                    ? highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : highContrast
                    ? 'bg-zinc-900 border-red-500 text-red-300'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="leading-snug">{statusMessage.text}</p>
                  {statusMessage.type === 'success' && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-200/60 dark:border-yellow-400/40 flex flex-wrap items-center gap-3">
                      <p className="text-xs opacity-80">
                        이제 AI 맞춤 질문 시연이나 키오스크에서 스마트 AI 상담을 이용하실 수 있습니다.
                      </p>
                      <button
                        type="button"
                        onClick={onStartKiosk}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all ${
                          highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>메인 키오스크 화면으로 즉시 이동</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Guarantee Notice */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                highContrast
                  ? 'bg-black/80 border-zinc-800 text-yellow-300/90'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">
                <p className="font-bold text-slate-800 dark:text-yellow-300">
                  🔒 입력하신 API Key는 서버나 DB에 저장되지 않으며, 세션 종료 시 즉시 파기됩니다.
                </p>
                <p className="mt-1 opacity-85">
                  서버 로그 및 영구 스토리지에 기록되지 않고 메모리에서 1회성 프록시 통신 후 즉시 소멸하며, 브라우저 탭을 닫으면 프론트엔드 상태에서도 완전히 삭제됩니다.
                </p>
              </div>
            </div>
          </form>

          {/* If Verified: Instant AI Interactive Demonstration Panel */}
          {isKeyVerified && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#3B82F6] dark:text-yellow-400" />
                  <h4 className="font-black text-base sm:text-lg">
                    스마트 AI 보호안내원 실시간 상담 테스트
                  </h4>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-yellow-300">
                  서버 대 서버 통신 활성화됨
                </span>
              </div>

              {/* Sample Question Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickAsk(q)}
                    disabled={aiLoading}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                      highContrast
                        ? 'bg-black border-zinc-700 text-yellow-300 hover:border-yellow-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    💬 {q}
                  </button>
                ))}
              </div>

              {/* Input & Ask Box */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickAsk(aiPrompt)}
                  placeholder="궁금한 공단 지원 사업에 대해 자유롭게 질문해 보세요..."
                  disabled={aiLoading}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border-2 outline-none transition-all ${
                    highContrast
                      ? 'bg-black border-zinc-700 text-yellow-300 focus:border-yellow-400'
                      : 'bg-white border-slate-200 text-slate-800 focus:border-[#3B82F6]'
                  }`}
                />
                <button
                  onClick={() => handleQuickAsk(aiPrompt)}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className={`px-5 py-3 rounded-xl font-black text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-[#3B82F6] hover:bg-blue-600 text-white'
                  }`}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>질문하기</span>
                </button>
              </div>

              {/* AI Response Output */}
              {aiResponse && (
                <div
                  className={`p-5 rounded-2xl border-2 mb-4 animate-fadeIn ${
                    highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300'
                      : 'bg-blue-50/70 border-blue-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-[#3B82F6] dark:text-yellow-400">
                    <Sparkles className="w-4 h-4" />
                    <span>AI 디지털 보호안내원 답변</span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed font-semibold whitespace-pre-line">
                    {aiResponse}
                  </p>
                </div>
              )}

              {/* Continue to Kiosk Banner */}
              <div className="text-center pt-4">
                <button
                  id="btn-start-kiosk-after-verify"
                  onClick={onStartKiosk}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all cursor-pointer ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-300/50'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>[승인 완료! 디지털 보호안내원 무인기 시작하기]</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
