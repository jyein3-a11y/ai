import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  FileText,
  FolderCheck,
  CheckSquare,
  Square,
  AlertCircle,
  Calendar,
  MessageSquare,
  RotateCcw,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { ServiceItem, DocItem, OperatingMode } from '../../types';
import { speechService } from '../../utils/speech';

interface ServiceDocsStepProps {
  service: ServiceItem;
  operatingMode?: OperatingMode;
  mode?: OperatingMode;
  highContrast: boolean;
  onChangeService?: () => void;
  onCallStaff?: () => void;
  onCallStaffForMissing?: () => void;
  onProceedToReserve?: () => void;
  onReserveDate?: () => void;
  onProceedToSms?: () => void;
  onSendSms?: () => void;
  onProceedNext?: () => void;
  onAllDocsChecked?: () => void;
  onResetToHome?: () => void;
  onGoHome?: () => void;
}

export const ServiceDocsStep: React.FC<ServiceDocsStepProps> = ({
  service,
  operatingMode,
  mode,
  highContrast,
  onChangeService,
  onCallStaff,
  onCallStaffForMissing,
  onProceedToReserve,
  onReserveDate,
  onProceedToSms,
  onSendSms,
  onProceedNext,
  onAllDocsChecked,
  onResetToHome,
  onGoHome
}) => {
  const currentMode = operatingMode || mode || 'business';
  const isBusiness = currentMode === 'business';

  const handleCallStaff = () => {
    if (onCallStaff) onCallStaff();
    else if (onCallStaffForMissing) onCallStaffForMissing();
  };

  const handleReserve = () => {
    if (onProceedToReserve) onProceedToReserve();
    else if (onReserveDate) onReserveDate();
  };

  const handleSms = () => {
    if (onProceedToSms) onProceedToSms();
    else if (onSendSms) onSendSms();
  };

  const handleNext = () => {
    if (onProceedNext) onProceedNext();
    else if (onAllDocsChecked) onAllDocsChecked();
    else if (onProceedToReserve) onProceedToReserve();
    else if (onReserveDate) onReserveDate();
  };

  const handleHome = () => {
    if (onResetToHome) onResetToHome();
    else if (onGoHome) onGoHome();
  };

  // 체크된 서류 ID 세트
  const [checkedDocIds, setCheckedDocIds] = useState<Set<string>>(new Set());
  // 결과 확인 단계인지 여부 (업무시간)
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    if (isBusiness) {
      if (!showResult) {
        speechService.speak(
          `${service.name}을 신청하시나요? 가지고 오신 서류를 모두 눌러주세요. 다 누르신 후 선택 완료를 눌러주세요.`
        );
      }
    } else {
      speechService.speak(
        `${service.name}에 필요한 서류를 안내해드릴게요. 지금은 직원이 근무하지 않는 시간이라, 서류를 미리 확인만 하실 수 있어요. 서류는 상담 예약 후 방문하실 때 챙겨오시면 됩니다. 서류가 없어도 예약하실 수 있어요.`
      );
    }
  }, [isBusiness, service.name, showResult]);

  const toggleDoc = (docId: string) => {
    setCheckedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const allChecked = service.requiredDocs.every((d) => checkedDocIds.has(d.id));
  const missingDocs = service.requiredDocs.filter((d) => !checkedDocIds.has(d.id));

  const handleCompleteSelection = () => {
    setShowResult(true);
    if (allChecked) {
      speechService.speak('필요한 서류를 모두 가지고 오셨네요. 다음 단계를 눌러주세요.');
    } else {
      speechService.speak(
        '아래 서류는 확인이 안 됐어요. 서류가 없어도 상담이나 안내는 받으실 수 있어요. 직원을 불러드릴게요.'
      );
    }
  };

  const getDocIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-7 h-7 text-blue-600" />;
      case 'FileText':
        return <FileText className="w-7 h-7 text-emerald-600" />;
      default:
        return <FolderCheck className="w-7 h-7 text-purple-600" />;
    }
  };

  // 3-1 업무시간 - 서류 확인 결과 화면
  if (isBusiness && showResult) {
    if (allChecked) {
      return (
        <div id="docs-result-all-checked" className="w-full max-w-3xl mx-auto py-4 px-2 flex justify-center">
          <div
            className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white text-slate-900 border-slate-100'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <CheckSquare className="w-10 h-10" />
            </div>

            <h2
              className={`text-2xl sm:text-4xl font-black mb-3 ${
                highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
              }`}
            >
              필요한 서류를 모두 가지고 오셨네요.
            </h2>

            <p
              className={`text-base sm:text-lg mb-6 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              모든 서류가 준비되었습니다. 다음 단계로 이동하여 담당 직원을 확인하거나 상담을 진행해 주세요.
            </p>

            <div
              className={`p-5 rounded-2xl sm:rounded-3xl mb-8 text-left border-2 ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="font-black mb-2">확인된 서류 목록:</div>
              <ul className="space-y-2 text-base">
                {service.requiredDocs.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span className="font-semibold">{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <button
                id="btn-docs-next"
                onClick={handleNext}
                className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                }`}
              >
                <span>[다음]</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <button
                id="btn-docs-recheck"
                onClick={() => setShowResult(false)}
                className={`py-4 px-6 rounded-2xl sm:rounded-3xl text-base font-bold border-2 transition-all active:scale-95 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-sm'
                }`}
              >
                [다시 확인하기]
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 일부 서류를 체크하지 않은 경우
    return (
      <div id="docs-result-partial" className="w-full max-w-3xl mx-auto py-4 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-20 h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertCircle className="w-10 h-10" />
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-3 ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            아래 서류는 확인이 안 됐어요.
          </h2>

          <div
            className={`p-5 rounded-2xl sm:rounded-3xl mb-6 text-left border-2 ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="font-black mb-2 text-rose-800">☐ 체크되지 않은 서류 목록</div>
            <ul className="space-y-2">
              {missingDocs.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2 text-base font-semibold">
                  <span className="w-5 h-5 rounded-md border border-rose-400 flex items-center justify-center text-xs text-rose-500 font-black">
                    ✕
                  </span>
                  <span>{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <p
            className={`text-base sm:text-xl font-bold mb-6 leading-relaxed ${
              highContrast ? 'text-yellow-200' : 'text-[#1E293B]'
            }`}
          >
            "서류가 없어도 상담이나 안내는 받으실 수 있어요. 직원을 불러드릴게요."
          </p>

          {/* Action buttons strictly matching prompt */}
          <div className="flex flex-col gap-3.5 max-w-md mx-auto">
            <button
              id="btn-docs-call-staff"
              onClick={handleCallStaff}
              className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              <UserCheck className="w-6 h-6" />
              <span>[🙋 담당 직원 호출하기]</span>
            </button>

            <button
              id="btn-docs-go-reserve"
              onClick={handleReserve}
              className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200'
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-1.5" />
              <span>[예약하기]</span>
            </button>

            <button
              id="btn-docs-recheck-partial"
              onClick={() => setShowResult(false)}
              className={`w-full py-3.5 px-6 rounded-2xl sm:rounded-3xl text-base font-bold border-2 transition-all active:scale-95 ${
                highContrast
                  ? 'border-yellow-400 text-yellow-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RotateCcw className="w-4 h-4 inline mr-1.5" />
              <span>[다시 확인하기]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3-1 업무시간인 경우: 체크리스트 입력 화면
  if (isBusiness) {
    return (
      <div id="step-docs-business" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-xl border-2 text-center w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
            <span
              className={`text-sm sm:text-base font-extrabold px-3.5 py-1 rounded-xl ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-blue-800'
              }`}
            >
              선택한 사업: {service.name}
            </span>
            {onChangeService && (
              <button
                id="btn-docs-change-service"
                onClick={onChangeService}
                className={`text-sm sm:text-base font-bold underline transition-colors cursor-pointer ${
                  highContrast
                    ? 'text-yellow-300 hover:text-yellow-100'
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                [다른 사업 서류 확인하기 🔄]
              </button>
            )}
          </div>
          <h2
            className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "{service.name}을 신청하시나요?"
          </h2>
          <p
            className={`text-lg sm:text-2xl font-black mb-8 ${
              highContrast ? 'text-yellow-200' : 'text-[#3B82F6]'
            }`}
          >
            "가지고 오신 서류를 모두 눌러주세요."
          </p>

          {/* Checklist */}
          <div className="flex flex-col gap-3.5 mb-8 text-left">
            {service.requiredDocs.map((doc) => {
              const isChecked = checkedDocIds.has(doc.id);
              return (
                <button
                  key={doc.id}
                  id={`btn-doc-item-${doc.id}`}
                  onClick={() => toggleDoc(doc.id)}
                  className={`p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] border-2 text-left shadow-sm flex items-center justify-between transition-all active:scale-98 ${
                    isChecked
                      ? highContrast
                        ? 'bg-yellow-400 text-black border-yellow-400 font-extrabold'
                        : 'bg-blue-50/90 border-[#3B82F6] text-blue-950 shadow-sm'
                      : highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                      : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="p-3 rounded-2xl bg-slate-100 dark:bg-black/30 shrink-0">
                      {getDocIcon(doc.iconName)}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black mb-0.5">
                        {isChecked ? '☑ ' : '☐ '}
                        {doc.name}
                      </h3>
                      <p className="text-sm opacity-80">{doc.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-3">
                    {isChecked ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#3B82F6] text-white font-bold text-sm shadow-sm">
                        가져옴
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-xl border-2 border-slate-200 text-slate-500 font-medium text-sm">
                        누르면 선택
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button: [✅ 선택 완료] */}
          <div className="text-center max-w-md mx-auto">
            <button
              id="btn-docs-selection-complete"
              onClick={handleCompleteSelection}
              className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl font-black shadow-lg transition-all active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              [✅ 선택 완료]
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3-2 비업무시간인 경우: 안내 + 예약 버튼만 제공
  return (
    <div id="step-docs-after-hours" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <span
            className={`text-sm sm:text-base font-extrabold px-3.5 py-1 rounded-xl ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-blue-800'
            }`}
          >
            선택한 사업: {service.name}
          </span>
          {onChangeService && (
            <button
              id="btn-docs-afterhours-change-service"
              onClick={onChangeService}
              className={`text-sm sm:text-base font-bold underline transition-colors cursor-pointer ${
                highContrast
                  ? 'text-yellow-300 hover:text-yellow-100'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              [다른 사업 서류 확인하기 🔄]
            </button>
          )}
        </div>

        <h2
          className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          "{service.name}에 필요한 서류를 안내해드릴게요."
        </h2>

        <p
          className={`text-base sm:text-lg mb-6 leading-relaxed font-medium ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          "지금은 직원이 근무하지 않는 시간이라, 서류를 미리 확인만 하실 수 있어요."
        </p>

        {/* Document List (read-only bullet list) */}
        <div
          className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl mb-6 text-left border-2 ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="font-black mb-3 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>필요 서류 목록</span>
          </div>

          <ul className="space-y-3">
            {service.requiredDocs.map((doc) => (
              <li key={doc.id} className="flex items-start gap-3">
                <span className="mt-1 font-bold text-blue-600">•</span>
                <div>
                  <div className="font-extrabold text-base sm:text-lg">{doc.name}</div>
                  <div className="text-sm opacity-80">{doc.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl mb-6 font-extrabold text-base sm:text-lg border-2 ${
            highContrast
              ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          "서류는 상담 예약 후 방문하실 때 챙겨오시면 됩니다."
          <div className="text-sm font-medium mt-1 opacity-90">
            (서류가 없어도 예약하실 수 있어요)
          </div>
        </div>

        {/* Buttons strictly matching prompt */}
        <div className="flex flex-col gap-3.5 max-w-md mx-auto">
          <button
            id="btn-night-reserve-from-docs"
            onClick={handleReserve}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>[📅 상담 예약하기]</span>
          </button>

          <button
            id="btn-night-sms-from-docs"
            onClick={handleSms}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold flex items-center justify-center gap-2 border-2 active:scale-95 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>[💬 문자로 문의 남기기]</span>
          </button>

          <button
            id="btn-night-home-from-docs"
            onClick={handleHome}
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
    </div>
  );
};
