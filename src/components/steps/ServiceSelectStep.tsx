import React, { useState, useEffect } from 'react';
import { Home, Briefcase, AlertCircle, BedDouble, HeartHandshake, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../types';
import { speechService } from '../../utils/speech';

interface ServiceSelectStepProps {
  services: ServiceItem[];
  highContrast: boolean;
  onSelectService: (service: ServiceItem) => void;
  intent?: 'guide' | 'docs';
  onUnknownService?: () => void;
}

export const ServiceSelectStep: React.FC<ServiceSelectStepProps> = ({
  services,
  highContrast,
  onSelectService,
  intent = 'guide'
}) => {
  const [isHelping, setIsHelping] = useState(false);
  const [helpIndex, setHelpIndex] = useState(0);

  useEffect(() => {
    if (!isHelping) {
      if (intent === 'docs') {
        speechService.speak('어떤 사업을 신청하시나요? 신청하시려는 사업을 누르시면 필요한 서류를 안내해 드립니다.');
      } else {
        speechService.speak('어떤 도움이 필요하신가요? 주거지원, 취업지원, 긴급지원, 숙식지원, 기타 중에서 눌러주세요.');
      }
    } else {
      const current = services[helpIndex];
      if (current) {
        if (intent === 'docs') {
          speechService.speak(`${current.name} 서류를 확인하시겠습니까? ${current.helpQuestion} 맞으시면 예, 아니면 아니오를 눌러주세요.`);
        } else {
          speechService.speak(`${current.helpQuestion} 맞으시면 예, 아니면 아니오를 눌러주세요.`);
        }
      }
    }
  }, [isHelping, helpIndex, services, intent]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-8 h-8 text-blue-600" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 text-indigo-600" />;
      case 'AlertCircle':
        return <AlertCircle className="w-8 h-8 text-rose-600" />;
      case 'BedDouble':
        return <BedDouble className="w-8 h-8 text-emerald-600" />;
      default:
        return <HeartHandshake className="w-8 h-8 text-purple-600" />;
    }
  };

  // '잘 모르겠습니다' 1문 1답 가이드
  if (isHelping) {
    const currentService = services[helpIndex];

    if (!currentService) {
      return (
        <div id="service-help-finish" className="w-full max-w-xl mx-auto py-6 px-2 text-center">
          <div
            className={`p-8 rounded-3xl border-2 shadow-lg ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <h3 className="text-2xl font-extrabold mb-4">
              담당 직원과 직접 상담하시는 것이 가장 좋습니다
            </h3>
            <p className="text-base mb-6 opacity-85">
              원하시는 내용을 찾기 어려우실 때는 직원이 직접 친절하게 안내해 드립니다.
            </p>
            <button
              id="btn-help-fallback-service"
              onClick={() => setIsHelping(false)}
              className="w-full py-4 rounded-2xl text-lg font-bold bg-blue-700 text-white"
            >
              [처음 목록으로 돌아가기]
            </button>
          </div>
        </div>
      );
    }

    return (
      <div id="service-help-guide" className="w-full max-w-xl mx-auto py-4 px-2">
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 shadow-lg text-center transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-amber-100 text-amber-700">
            <HelpCircle className="w-9 h-9" />
          </div>

          <div className="text-sm font-bold text-blue-600 mb-2">
            질문 {helpIndex + 1} / {services.length}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black mb-6 leading-tight">
            {currentService.helpQuestion}
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              id="btn-help-answer-yes"
              onClick={() => onSelectService(currentService)}
              className={`flex-1 py-5 px-6 rounded-2xl text-xl font-extrabold shadow-md flex items-center justify-center gap-2 active:scale-98 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Check className="w-6 h-6" />
              <span>{intent === 'docs' ? `[예, ${currentService.name} 서류 확인]` : '[예, 맞습니다]'}</span>
            </button>

            <button
              id="btn-help-answer-no"
              onClick={() => setHelpIndex((prev) => prev + 1)}
              className={`flex-1 py-5 px-6 rounded-2xl text-xl font-bold border-2 active:scale-98 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{intent === 'docs' ? '[다른 사업 알아보기]' : '[아니오]'}</span>
            </button>
          </div>

          <button
            id="btn-help-cancel"
            onClick={() => {
              setIsHelping(false);
              setHelpIndex(0);
            }}
            className="text-sm font-semibold opacity-70 hover:opacity-100 underline mt-2"
          >
            [전체 목록 직접 보기]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="step-service-select" className="w-full max-w-4xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-xl border-2 text-center w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        {intent === 'docs' ? (
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm sm:text-base font-extrabold shadow-xs ${
                highContrast
                  ? 'bg-yellow-400 text-black border border-yellow-400'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              📋 사업별 필요 서류 확인 단계
            </span>
          </div>
        ) : null}

        <p
          className={`text-lg sm:text-2xl font-medium mb-2 sm:mb-3 leading-relaxed ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          {intent === 'docs'
            ? '신청하실 사업을 선택해 주세요'
            : '안녕하세요. 한국법무보호복지공단입니다.'}
        </p>

        <h2
          className={`text-3xl sm:text-5xl font-black mb-3 sm:mb-4 leading-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          {intent === 'docs' ? '어떤 사업을 신청하시나요?' : '어떤 도움이 필요하신가요?'}
        </h2>

        {intent === 'docs' ? (
          <p
            className={`text-base sm:text-lg mb-6 sm:mb-8 font-medium ${
              highContrast ? 'text-yellow-300/90' : 'text-slate-600'
            }`}
          >
            신청하시려는 사업을 선택하시면 준비해 오실 필수 서류 목록과 발급 방법을 안내해 드립니다.
          </p>
        ) : (
          <p
            className={`text-base sm:text-lg mb-6 sm:mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-slate-500'
            }`}
          >
            지원받고자 하시는 분야를 선택해 주세요.
          </p>
        )}

        {/* 2-column Vibrant Grid strictly matching Design HTML */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {services.map((srv) => {
            // Theme colors from Vibrant Palette
            const getVibrantStyle = (id: string) => {
              if (highContrast) {
                return 'bg-zinc-900 border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-800';
              }
              switch (id) {
                case 'housing':
                  return 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-200';
                case 'job':
                  return 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200';
                case 'emergency':
                  return 'bg-[#F59E0B] hover:bg-amber-600 text-white shadow-lg shadow-amber-200';
                case 'dormitory':
                  return 'bg-[#8B5CF6] hover:bg-purple-600 text-white shadow-lg shadow-purple-200';
                default:
                  return 'bg-[#0EA5E9] hover:bg-sky-600 text-white shadow-lg shadow-sky-200';
              }
            };

            const getEmoji = (id: string) => {
              switch (id) {
                case 'housing':
                  return '🏠';
                case 'job':
                  return '💼';
                case 'emergency':
                  return '🆘';
                case 'dormitory':
                  return '🛏';
                default:
                  return '🤝';
              }
            };

            return (
              <button
                key={srv.id}
                id={`btn-service-${srv.id}`}
                onClick={() => onSelectService(srv)}
                className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] hover:scale-105 transition-all duration-200 active:scale-95 text-center ${getVibrantStyle(
                  srv.id
                )}`}
              >
                <span className="text-5xl sm:text-6xl mb-3 sm:mb-4 select-none">{getEmoji(srv.id)}</span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{srv.name}</span>
                <span className="text-xs sm:text-sm font-medium opacity-90 mb-2">{srv.shortDesc}</span>
                {intent === 'docs' && (
                  <span
                    className={`mt-1 px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold ${
                      highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/25 text-white border border-white/40'
                    }`}
                  >
                    필요 서류 확인하기 →
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* [❓ 잘 모르겠습니다 (질문하기)] matching Design HTML */}
        <div className="flex justify-center">
          <button
            id="btn-service-unknown"
            onClick={() => {
              setIsHelping(true);
              setHelpIndex(0);
            }}
            className={`text-lg sm:text-2xl font-bold underline underline-offset-8 transition-colors ${
              highContrast
                ? 'text-yellow-300 hover:text-yellow-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ❓ 잘 모르겠습니다 (질문하기)
          </button>
        </div>
      </div>
    </div>
  );
};
