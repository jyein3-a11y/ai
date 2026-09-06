import React, { useState, useEffect } from 'react';
import { User, Phone, MessageSquare, Search, AlertCircle, HelpCircle } from 'lucide-react';
import { StaffMember } from '../../types';
import { speechService } from '../../utils/speech';

interface StaffCheckStepProps {
  staffList: StaffMember[];
  registeredClients: Record<string, { name: string; phone: string; assignedStaffId: string }>;
  highContrast: boolean;
  onCallStaff: (staff: StaffMember) => void;
  onSmsStaff: (staff: StaffMember) => void;
  onCallDesk: () => void;
}

export const StaffCheckStep: React.FC<StaffCheckStepProps> = ({
  staffList,
  registeredClients,
  highContrast,
  onCallStaff,
  onSmsStaff,
  onCallDesk
}) => {
  const [queryName, setQueryName] = useState<string>('');
  const [matchedStaff, setMatchedStaff] = useState<StaffMember | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    speechService.speak('내담자 성함을 입력하시거나 아래 등록된 이름을 누르시면 담당 직원을 확인해 드립니다.');
  }, []);

  const handleSearch = (nameToSearch: string) => {
    const trimmed = nameToSearch.trim();
    if (!trimmed) return;

    setHasSearched(true);
    const client = registeredClients[trimmed];

    if (client && client.assignedStaffId) {
      const staff = staffList.find((s) => s.id === client.assignedStaffId);
      if (staff) {
        setMatchedStaff(staff);
        speechService.speak(`담당 직원은 ${staff.name}님입니다. 전화하기나 문자 보내기를 누르실 수 있습니다.`);
        return;
      }
    }

    setMatchedStaff(null);
    speechService.speak('담당 직원을 확인할 수 없습니다. 직원에게 문의해주세요.');
  };

  return (
    <div id="step-staff-check" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
      <div
        className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 shadow-xl text-center w-full transition-all ${
          highContrast
            ? 'bg-black text-yellow-300 border-yellow-400'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
            highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
          }`}
        >
          <User className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h2
          className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
            highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
          }`}
        >
          담당 직원 확인
        </h2>
        <p
          className={`text-base sm:text-lg mb-8 font-medium ${
            highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
          }`}
        >
          성함을 입력하여 공단 시스템에 배정된 담당 직원을 조회합니다.
        </p>

        {/* Input & Search */}
        <div className="flex gap-2 max-w-md mx-auto mb-4">
          <input
            id="input-staff-search-name"
            type="text"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(queryName)}
            placeholder="성함 입력 (예: 홍길동)"
            className={`flex-1 px-5 py-4 rounded-2xl sm:rounded-3xl border-2 text-lg font-bold outline-none transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300 placeholder-yellow-600'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#3B82F6]'
            }`}
          />
          <button
            id="btn-staff-search-submit"
            onClick={() => handleSearch(queryName)}
            className={`px-6 sm:px-8 py-4 rounded-2xl sm:rounded-3xl font-black text-lg transition-all active:scale-95 shrink-0 ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-200'
            }`}
          >
            <Search className="w-5 h-5 inline mr-1" />
            <span>조회</span>
          </button>
        </div>

        {/* Sample quick buttons for easy touching */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap text-sm">
          <span className="opacity-70 font-medium">등록 성함 예시:</span>
          {Object.keys(registeredClients).map((sampleName) => (
            <button
              key={sampleName}
              onClick={() => {
                setQueryName(sampleName);
                handleSearch(sampleName);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all active:scale-95 ${
                highContrast
                  ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {sampleName}
            </button>
          ))}
        </div>

        {/* Search Results matching exact prompt text */}
        {hasSearched && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
            {matchedStaff ? (
              /* 담당 직원이 있는 경우 */
              <div className="text-center">
                <div
                  className={`text-2xl sm:text-3xl font-black mb-4 ${
                    highContrast ? 'text-yellow-300' : 'text-[#3B82F6]'
                  }`}
                >
                  "담당 직원은 {matchedStaff.name}님입니다."
                </div>

                <div
                  className={`max-w-md mx-auto p-5 rounded-2xl sm:rounded-3xl mb-6 text-left border-2 ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200 dark:border-zinc-700">
                    <span className="opacity-70 text-sm font-medium">소속/직급</span>
                    <span className="font-extrabold">{matchedStaff.department}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 pt-2">
                    <span className="opacity-70 text-sm font-medium">내선 전화</span>
                    <span
                      className={`font-black ${
                        highContrast ? 'text-yellow-400' : 'text-[#3B82F6]'
                      }`}
                    >
                      {matchedStaff.phone}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
                  <button
                    id="btn-matched-staff-call"
                    onClick={() => onCallStaff(matchedStaff)}
                    className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                      highContrast
                        ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                        : 'bg-[#10B981] hover:bg-emerald-600 text-white shadow-emerald-200'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                    <span>[📞 전화하기]</span>
                  </button>

                  <button
                    id="btn-matched-staff-sms"
                    onClick={() => onSmsStaff(matchedStaff)}
                    className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                      highContrast
                        ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                        : 'bg-[#8B5CF6] hover:bg-purple-600 text-white shadow-purple-200'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>[💬 문자 보내기]</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 담당 직원이 확인되지 않는 경우 (프롬프트 엄격 준수) */
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-rose-100 text-rose-600">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div className="text-xl sm:text-2xl font-black mb-2 text-rose-700 dark:text-yellow-300">
                  "담당 직원을 확인할 수 없습니다. 직원에게 문의해주세요."
                </div>

                <p className="text-sm opacity-80 mb-6 font-medium">
                  임의의 직원 정보를 안내하지 않으며, 창구 직원이 즉시 배정 내역을 확인해 드립니다.
                </p>

                <button
                  id="btn-staff-not-found-desk"
                  onClick={onCallDesk}
                  className={`py-4 sm:py-5 px-8 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                    highContrast
                      ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                      : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                  }`}
                >
                  [🙋 직원에게 문의하기]
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
