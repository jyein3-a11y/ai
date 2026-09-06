import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckCircle2, AlertTriangle, Phone, RotateCcw, RefreshCw } from 'lucide-react';
import { StaffMember } from '../../types';
import { speechService } from '../../utils/speech';

interface StaffSmsStepProps {
  staff?: StaffMember;
  highContrast: boolean;
  onGoToCall: () => void;
  onGoHome: () => void;
}

export const StaffSmsStep: React.FC<StaffSmsStepProps> = ({
  staff,
  highContrast,
  onGoToCall,
  onGoHome
}) => {
  const [content, setContent] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  // 상태: 'form' | 'sending' | 'success' | 'failure'
  const [status, setStatus] = useState<'form' | 'sending' | 'success' | 'failure'>('form');

  useEffect(() => {
    speechService.speak('직원에게 전달할 내용을 입력해주세요. 입력 후 문자 보내기를 눌러주세요.');
  }, []);

  const quickPhrases = [
    '필요한 서류와 신청 방법에 대해 문의드립니다.',
    '상담 가능한 일정을 확인하고 싶습니다.',
    '방문 시간 관련하여 연락 부탁드립니다.',
    '주거지원 상담을 받고 싶습니다.'
  ];

  const handleSend = () => {
    if (!content.trim()) {
      speechService.speak('문자 내용을 입력해 주세요.');
      return;
    }

    setStatus('sending');
    speechService.speak('문자를 발송하고 있습니다. 잠시만 기다려주세요.');

    // 실제 문자 발송 시스템 연동 시뮬레이션
    setTimeout(() => {
      // 90% 성공률 시뮬레이션
      const success = true;
      if (success) {
        setStatus('success');
        speechService.speak('문자가 정상적으로 접수되었습니다.');
      } else {
        setStatus('failure');
        speechService.speak('문자를 보내지 못했습니다.');
      }
    }, 1500);
  };

  return (
    <div id="step-staff-sms" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 shadow-xl text-center w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        {status === 'form' && (
          <div>
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#F5F3FF] text-[#8B5CF6]'
              }`}
            >
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div
              className={`text-sm sm:text-base font-black mb-1 ${
                highContrast ? 'text-yellow-400' : 'text-[#8B5CF6]'
              }`}
            >
              [💬 {staff ? `${staff.name} 직원에게 문자 보내기` : '담당 직원에게 문자 보내기'}]
            </div>

            <h2
              className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${
                highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
              }`}
            >
              "직원에게 전달할 내용을 입력해주세요."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              직원이 확인 후 남겨주신 번호로 답변을 드립니다.
            </p>

            {/* Sender Contact Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-left">
              <div>
                <label className="block text-sm font-bold mb-1.5 opacity-90">내담자 성함</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 text-base font-bold outline-none transition-all ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#8B5CF6]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 opacity-90">연락받으실 전화번호</label>
                <input
                  type="tel"
                  placeholder="예: 010-1234-5678"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 text-base font-bold outline-none transition-all ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#8B5CF6]'
                  }`}
                />
              </div>
            </div>

            {/* Quick Touch Phrases for accessible input */}
            <div className="mb-4 text-left">
              <div className="text-xs font-bold opacity-70 mb-2">자주 묻는 내용 (누르면 자동 입력):</div>
              <div className="flex flex-wrap gap-2">
                {quickPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setContent(phrase)}
                    className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl border-2 font-bold transition-all active:scale-95 ${
                      highContrast
                        ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm'
                    }`}
                  >
                    + {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div className="mb-6 text-left">
              <label className="block text-sm font-bold mb-1.5 opacity-90">
                [문자 내용 입력]
              </label>
              <textarea
                id="input-sms-content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="직원에게 남기실 문의 내용을 적어주세요."
                className={`w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 text-base font-medium outline-none resize-none leading-relaxed transition-all ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#8B5CF6]'
                }`}
              />
            </div>

            <button
              id="btn-sms-send-submit"
              onClick={handleSend}
              className={`w-full py-5 rounded-2xl sm:rounded-3xl text-xl font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#8B5CF6] hover:bg-purple-600 text-white shadow-purple-200'
              }`}
            >
              <Send className="w-6 h-6" />
              <span>[📨 문자 보내기]</span>
            </button>
          </div>
        )}

        {status === 'sending' && (
          <div className="py-12">
            <div
              className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-spin ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-purple-100 text-purple-700'
              }`}
            >
              <RefreshCw className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">문자를 전송하고 있습니다</h3>
            <p className="text-base opacity-75 font-medium">공단 통신 시스템을 통해 접수 중입니다...</p>
          </div>
        )}

        {/* 발송 성공 (프롬프트 엄격 일치) */}
        {status === 'success' && (
          <div className="py-6 animate-fadeIn">
            <div
              className={`w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3 text-emerald-600 dark:text-yellow-300">
              "문자가 정상적으로 접수되었습니다."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              직원이 확인하는 대로 남겨주신 번호로 신속하게 안내해 드리겠습니다.
            </p>

            <button
              id="btn-sms-success-home"
              onClick={onGoHome}
              className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              [확인 및 처음으로]
            </button>
          </div>
        )}

        {/* 발송 실패 (프롬프트 엄격 일치) */}
        {status === 'failure' && (
          <div className="py-6 animate-fadeIn">
            <div
              className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <AlertTriangle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-700 dark:text-yellow-300">
              "문자를 보내지 못했습니다."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              통신망 오류로 인해 문자가 전송되지 않았습니다. 다시 보내시거나 전화로 문의해 주세요.
            </p>

            {/* Buttons strictly matching prompt */}
            <div className="flex flex-col gap-3.5 max-w-md mx-auto">
              <button
                id="btn-sms-retry"
                onClick={() => setStatus('form')}
                className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span>[다시 보내기]</span>
              </button>

              <button
                id="btn-sms-to-phone"
                onClick={onGoToCall}
                className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold flex items-center justify-center gap-2 border-2 active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-[#10B981] hover:bg-emerald-600 text-white border-[#10B981] shadow-md shadow-emerald-200'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>[전화로 문의하기]</span>
              </button>

              <button
                id="btn-sms-fail-home"
                onClick={onGoHome}
                className={`w-full py-3.5 px-6 rounded-2xl sm:rounded-3xl text-base font-bold border-2 transition-all active:scale-95 ${
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
        )}
      </div>
    </div>
  );
};
