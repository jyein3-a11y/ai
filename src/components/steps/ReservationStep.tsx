import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  UserCheck,
  CalendarCheck,
  MessageSquare,
  MapPin,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Reservation, ServiceItem, StaffMember } from '../../types';
import { speechService } from '../../utils/speech';

interface ReservationStepProps {
  availableDates: string[];
  timeSlotsByDate: Record<string, string[]>;
  staffList: StaffMember[];
  services: ServiceItem[];
  selectedService?: ServiceItem;
  highContrast: boolean;
  onReservationCreated: (res: Reservation) => void;
  onCallDesk: () => void;
  onGoHome: () => void;
}

export const ReservationStep: React.FC<ReservationStepProps> = ({
  availableDates,
  timeSlotsByDate,
  staffList,
  services,
  selectedService,
  highContrast,
  onReservationCreated,
  onCallDesk,
  onGoHome
}) => {
  // 단계: 'date' | 'time' | 'confirm' | 'complete' | 'conflict_error' | 'system_error'
  const [step, setStep] = useState<
    'date' | 'time' | 'confirm' | 'complete' | 'conflict_error' | 'system_error'
  >('date');

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('홍길동');
  const [clientPhone, setClientPhone] = useState<string>('010-1234-5678');
  const [currentService, setCurrentService] = useState<ServiceItem>(
    selectedService || services[0]
  );
  const [assignedStaff, setAssignedStaff] = useState<StaffMember>(staffList[0]);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // 시뮬레이션용 시스템 오류 플래그
  const [systemDateError, setSystemDateError] = useState(false);
  const [systemTimeError, setSystemTimeError] = useState(false);

  useEffect(() => {
    if (step === 'date') {
      speechService.speak('상담받으실 날짜를 선택해주세요.');
    } else if (step === 'time') {
      speechService.speak(`${selectedDate}에 가능한 시간을 선택해주세요.`);
    } else if (step === 'confirm') {
      speechService.speak('예약 내용을 확인해주세요. 확인 후 예약 확정을 눌러주세요.');
    } else if (step === 'complete') {
      speechService.speak('상담 예약이 완료되었습니다. 안내 문자가 발송되었습니다.');
    }
  }, [step, selectedDate]);

  // 8-1 날짜 선택 단계
  if (step === 'date') {
    if (systemDateError || availableDates.length === 0) {
      return (
        <div id="reservation-date-error" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
          <div
            className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white text-slate-900 border-rose-200'
            }`}
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <AlertCircle className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-700 dark:text-yellow-300">
              "지금은 예약 가능한 날짜를 확인할 수 없습니다."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              예약 시스템 연결이 원활하지 않습니다. 아래 버튼 중에서 선택해 주세요.
            </p>

            <div className="flex flex-col gap-3.5 max-w-md mx-auto">
              <button
                id="btn-res-date-retry"
                onClick={() => setSystemDateError(false)}
                className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                }`}
              >
                <RefreshCw className="w-5 h-5 inline mr-1.5" />
                <span>[다시 시도하기]</span>
              </button>

              <button
                id="btn-res-date-call-staff"
                onClick={onCallDesk}
                className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-[#10B981] hover:bg-emerald-600 text-white border-[#10B981] shadow-md shadow-emerald-200'
                }`}
              >
                <UserCheck className="w-5 h-5 inline mr-1.5" />
                <span>[직원에게 문의하기]</span>
              </button>

              <button
                id="btn-res-date-home"
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
        </div>
      );
    }

    return (
      <div id="step-reserve-date" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
            }`}
          >
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div
            className={`text-sm sm:text-base font-black mb-1 ${
              highContrast ? 'text-yellow-400' : 'text-[#3B82F6]'
            }`}
          >
            [1단계 / 날짜 선택]
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "상담받으실 날짜를 선택해주세요."
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            공단 시스템에서 조회된 실제 예약 가능일입니다.
          </p>

          <div className="flex flex-col gap-3.5 mb-8">
            {availableDates.map((dateStr) => (
              <button
                key={dateStr}
                id={`btn-res-date-${dateStr}`}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setStep('time');
                }}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left font-black text-lg sm:text-2xl flex items-center justify-between transition-all hover:shadow-lg active:scale-95 ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-50 border-slate-200 hover:border-[#3B82F6] text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-[#3B82F6]'
                    }`}
                  >
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <span>{dateStr}</span>
                </div>
                <ArrowRight className="w-6 h-6 opacity-60 text-[#3B82F6]" />
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setSystemDateError(true)}
              className="text-xs text-slate-400 hover:underline"
            >
              (시스템 날짜 조회 실패 시뮬레이션)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 8-2 시간 선택 단계 (필수 단계)
  if (step === 'time') {
    const timesForDate = timeSlotsByDate[selectedDate] || [];

    // 시간 조회 실패 시스템 오류인 경우
    if (systemTimeError) {
      return (
        <div id="reservation-time-error" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
          <div
            className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white text-slate-900 border-rose-200'
            }`}
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <AlertCircle className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-700 dark:text-yellow-300">
              "지금은 가능한 시간을 확인할 수 없습니다."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              선택하신 날짜의 예약 시간 목록을 불러오지 못했습니다. 다음 행동을 선택해주세요.
            </p>

            <div className="flex flex-col gap-3.5 max-w-md mx-auto">
              <button
                id="btn-time-retry"
                onClick={() => setSystemTimeError(false)}
                className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                }`}
              >
                <RefreshCw className="w-5 h-5 inline mr-1.5" />
                <span>[다시 시도하기]</span>
              </button>

              <button
                id="btn-time-other-date"
                onClick={() => setStep('date')}
                className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-5 h-5 inline mr-1.5" />
                <span>[다른 날짜 선택]</span>
              </button>

              <button
                id="btn-time-call-desk"
                onClick={onCallDesk}
                className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 bg-zinc-900'
                    : 'bg-[#10B981] text-white hover:bg-emerald-600 border-[#10B981] shadow-md shadow-emerald-200'
                }`}
              >
                <UserCheck className="w-5 h-5 inline mr-1.5" />
                <span>[직원에게 문의하기]</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 예약 가능한 시간이 없는 경우 (프롬프트 엄격 일치)
    if (timesForDate.length === 0) {
      return (
        <div id="reservation-no-time" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
          <div
            className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
              highContrast
                ? 'bg-black text-yellow-300 border-yellow-400'
                : 'bg-white text-slate-900 border-amber-200'
            }`}
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
                highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Clock className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              "선택하신 날짜에는 예약 가능한 시간이 없습니다."
            </h2>

            <p
              className={`text-base sm:text-lg mb-8 font-medium ${
                highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
              }`}
            >
              해당 일자의 모든 상담 일정이 마감되었습니다. 다른 날짜를 선택해 주시거나 직원에게 문의해 주세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
              <button
                id="btn-no-time-other-date"
                onClick={() => setStep('date')}
                className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                    : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                }`}
              >
                <span>[다른 날짜 선택]</span>
              </button>

              <button
                id="btn-no-time-call-desk"
                onClick={onCallDesk}
                className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-[#10B981] text-white hover:bg-emerald-600 border-[#10B981] shadow-md shadow-emerald-200'
                }`}
              >
                <span>[직원에게 문의하기]</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 정상 시간 선택 화면
    return (
      <div id="step-reserve-time" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div
            className={`text-sm sm:text-base font-black mb-1 ${
              highContrast ? 'text-yellow-400' : 'text-[#3B82F6]'
            }`}
          >
            [2단계 / 시간 선택]
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "{selectedDate}에 가능한 시간을 선택해주세요."
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            원하시는 상담 시간을 하나 눌러주세요.
          </p>

          <div className="grid grid-cols-2 gap-3.5 mb-8">
            {timesForDate.map((timeStr) => (
              <button
                key={timeStr}
                id={`btn-time-slot-${timeStr.replace(':', '')}`}
                onClick={() => {
                  setSelectedTime(timeStr);
                  setStep('confirm');
                }}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 font-black text-xl sm:text-3xl flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-95 ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-50 border-slate-200 hover:border-[#3B82F6] text-slate-900 shadow-sm'
                }`}
              >
                <Clock className="w-6 h-6 text-[#3B82F6]" />
                <span>[{timeStr}]</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400">
            <button onClick={() => setStep('date')} className="hover:underline font-bold text-slate-600 dark:text-yellow-400">
              ← [날짜 다시 선택]
            </button>
            <button onClick={() => setSystemTimeError(true)} className="hover:underline">
              (시간 조회 실패 시뮬레이션)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 9. 예약 확정 및 중복 방지 검증 단계
  if (step === 'confirm') {
    const handleConfirmBooking = () => {
      // 예약 중복 방지: 확정 직전에 재확인 (시뮬레이션)
      const isAlreadyBooked = false; // 기본 정상

      if (isAlreadyBooked) {
        setStep('conflict_error');
        speechService.speak('죄송합니다. 방금 다른 예약이 등록되어 해당 시간은 이용할 수 없습니다.');
        return;
      }

      const newReservation: Reservation = {
        id: `res_${Date.now()}`,
        clientName: clientName || '홍길동',
        clientPhone: clientPhone || '010-1234-5678',
        serviceId: currentService.id,
        serviceName: currentService.name,
        date: selectedDate,
        time: selectedTime,
        staffName: assignedStaff.name,
        location: '본관 2층 1상담실',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setCreatedReservation(newReservation);
      onReservationCreated(newReservation);
      setStep('complete');
    };

    return (
      <div id="step-reserve-confirm" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-blue-100 text-[#3B82F6]'
            }`}
          >
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div
            className={`text-sm sm:text-base font-black mb-1 ${
              highContrast ? 'text-yellow-400' : 'text-[#3B82F6]'
            }`}
          >
            [3단계 / 예약 내용 확인]
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-4 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "예약 내용을 확인해주세요."
          </h2>

          {/* Details Box strictly matching prompt layout */}
          <div
            className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl mb-8 text-left border-2 text-base sm:text-xl ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <ul className="space-y-4 font-black">
              <li className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-zinc-800">
                <span className="opacity-70 font-medium">• 상담 서비스</span>
                <span className="text-[#3B82F6] dark:text-yellow-300 font-black">{currentService.name}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-zinc-800">
                <span className="opacity-70 font-medium">• 날짜</span>
                <span>{selectedDate}</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-zinc-800">
                <span className="opacity-70 font-medium">• 시간</span>
                <span className="text-emerald-600 dark:text-yellow-400">{selectedTime}</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="opacity-70 font-medium">• 담당 직원</span>
                <span>{assignedStaff.name}님 ({assignedStaff.department})</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5">
            <button
              id="btn-res-confirm-final"
              onClick={handleConfirmBooking}
              className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              <span>[✅ 예약 확정]</span>
            </button>

            <button
              id="btn-res-reselect"
              onClick={() => setStep('time')}
              className={`py-5 px-8 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>[↩ 다시 선택]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 예약 중복 발생 시 (프롬프트 엄격 일치)
  if (step === 'conflict_error') {
    return (
      <div id="reservation-conflict" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-rose-200'
          }`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
            }`}
          >
            <AlertCircle className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-700 dark:text-yellow-300">
            "죄송합니다. 방금 다른 예약이 등록되어 해당 시간은 이용할 수 없습니다."
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            동시간대 중복 방지 시스템에 의해 다른 시간 또는 다른 날짜를 선택해 주시기 바랍니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto">
            <button
              id="btn-conflict-other-time"
              onClick={() => setStep('time')}
              className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              <span>[다른 시간 선택]</span>
            </button>

            <button
              id="btn-conflict-other-date"
              onClick={() => setStep('date')}
              className={`flex-1 py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>[다른 날짜 선택]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 10. 예약 완료 및 문자 안내 단계 (프롬프트 엄격 일치)
  if (step === 'complete' && createdReservation) {
    return (
      <div id="step-reserve-complete" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 text-emerald-600 dark:text-yellow-300">
            "상담 예약이 완료되었습니다."
          </h2>

          <div
            className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl mb-8 text-left border-2 text-base sm:text-lg ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <ul className="space-y-3">
              <li className="flex justify-between py-1.5 border-b border-slate-200 dark:border-zinc-800">
                <span className="opacity-70 font-medium">날짜</span>
                <span className="font-black">{createdReservation.date}</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-slate-200 dark:border-zinc-800">
                <span className="opacity-70 font-medium">시간</span>
                <span className="font-black text-emerald-600 dark:text-yellow-400">{createdReservation.time}</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-slate-200 dark:border-zinc-800">
                <span className="opacity-70 font-medium">담당 직원</span>
                <span className="font-black">{createdReservation.staffName}</span>
              </li>
              <li className="flex justify-between py-1.5">
                <span className="opacity-70 font-medium">장소</span>
                <span className="font-black">{createdReservation.location}</span>
              </li>
            </ul>
          </div>

          {/* 문자 발송 안내 내역 (프롬프트 엄격 일치) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {/* 대상자 문자 */}
            <div
              className={`p-5 rounded-2xl border-2 text-xs sm:text-sm ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-blue-50/70 border-blue-200 text-slate-800'
              }`}
            >
              <div className="font-black text-[#3B82F6] dark:text-yellow-300 mb-2 flex items-center gap-1.5 text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>대상자 문자 (발송 완료)</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line font-medium opacity-90">
                "상담 예약이 완료되었습니다.
                날짜: {createdReservation.date}
                시간: {createdReservation.time}
                담당 직원: {createdReservation.staffName}"
              </p>
            </div>

            {/* 직원 문자 */}
            <div
              className={`p-5 rounded-2xl border-2 text-xs sm:text-sm ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-emerald-50/70 border-emerald-200 text-slate-800'
              }`}
            >
              <div className="font-black text-emerald-600 dark:text-yellow-300 mb-2 flex items-center gap-1.5 text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>직원 문자 (발송 완료)</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line font-medium opacity-90">
                "상담 예약이 등록되었습니다.
                대상자: {createdReservation.clientName}
                날짜: {createdReservation.date}
                시간: {createdReservation.time}"
              </p>
            </div>
          </div>

          <button
            id="btn-res-complete-home"
            onClick={onGoHome}
            className={`w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black shadow-lg active:scale-95 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
            }`}
          >
            [확인 및 처음으로]
          </button>
        </div>
      </div>
    );
  }

  return null;
};
