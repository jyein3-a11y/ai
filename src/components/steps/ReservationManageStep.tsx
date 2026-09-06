import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  CalendarDays,
  XCircle,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Reservation, StaffMember, VisitRecord } from '../../types';
import { INITIAL_VISIT_HISTORY } from '../../data/systemData';
import { speechService } from '../../utils/speech';
import { VisitHistoryDashboard } from '../VisitHistoryDashboard';

interface ReservationManageStepProps {
  reservations: Reservation[];
  visitRecords?: VisitRecord[];
  availableDates: string[];
  timeSlotsByDate: Record<string, string[]>;
  staffList: StaffMember[];
  highContrast: boolean;
  onUpdateReservation: (updated: Reservation) => void;
  onCancelReservation: (resId: string) => void;
  onCallDesk: () => void;
  onGoHome: () => void;
}

export const ReservationManageStep: React.FC<ReservationManageStepProps> = ({
  reservations,
  visitRecords = INITIAL_VISIT_HISTORY,
  availableDates,
  timeSlotsByDate,
  staffList,
  highContrast,
  onUpdateReservation,
  onCancelReservation,
  onCallDesk,
  onGoHome
}) => {
  // 모드: 'list' | 'change_date' | 'change_time' | 'change_confirm' | 'change_success' | 'cancel_confirm' | 'cancel_success' | 'staff_changed_notice'
  const [subMode, setSubMode] = useState<
    | 'list'
    | 'change_date'
    | 'change_time'
    | 'change_confirm'
    | 'change_success'
    | 'cancel_confirm'
    | 'cancel_success'
    | 'staff_changed_notice'
  >('list');

  // 서브 탭: 'dashboard' (방문 이력 대시보드) | 'reservations' (예약 일정 관리)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations'>('dashboard');

  const [targetRes, setTargetRes] = useState<Reservation | null>(
    reservations[0] || null
  );

  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');

  useEffect(() => {
    if (subMode === 'list') {
      if (activeTab === 'dashboard') {
        speechService.speak(
          '사용자 서비스 방문 이력 대시보드입니다. 월별 방문 추이와 서비스별 통계를 차트로 확인하실 수 있습니다.'
        );
      } else {
        speechService.speak('기존 상담 예약 내역을 확인하고 변경 또는 취소하실 수 있습니다.');
      }
    } else if (subMode === 'cancel_confirm') {
      speechService.speak('예약을 취소하시겠습니까? 네 취소합니다 또는 아니오를 선택해 주세요.');
    } else if (subMode === 'staff_changed_notice') {
      speechService.speak(
        '죄송합니다. 담당 직원의 일정이 변경되어 기존 예약 시간에 상담이 어렵습니다. 다른 시간 예약하기나 담당 직원에게 문의하기를 이용해 주세요.'
      );
    }
  }, [subMode, activeTab]);

  // 1. 메인 목록 화면 (방문 이력 대시보드 및 예약 관리)
  if (subMode === 'list') {
    return (
      <div id="reservation-manage-container" className="w-full max-w-4xl mx-auto py-3 px-2 flex flex-col items-center">
        {/* Top Header Card */}
        <div
          className={`w-full p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] border-2 shadow-xl mb-6 transition-all text-center ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100 shadow-slate-200/60'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 text-left">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-[#EFF6FF] text-[#3B82F6]'
                }`}
              >
                <CalendarDays className="w-8 h-8" />
              </div>
              <div>
                <h2
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${
                    highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
                  }`}
                >
                  상담 이력 및 예약 관리
                </h2>
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    highContrast ? 'text-yellow-300/80' : 'text-slate-500'
                  }`}
                >
                  서비스 방문 이력 시각화 대시보드와 예정된 예약 일정을 확인하세요.
                </p>
              </div>
            </div>

            {/* Quick Home / Call Desk Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={onGoHome}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                [처음으로]
              </button>
            </div>
          </div>

          {/* Navigation Tabs (대시보드 vs 예약 일정 관리) */}
          <div
            className={`flex items-center justify-center p-1.5 rounded-2xl border-2 my-5 max-w-lg mx-auto ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400'
                : 'bg-slate-100 border-slate-200'
            }`}
            role="tablist"
          >
            <button
              id="tab-btn-visit-dashboard"
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? highContrast
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'bg-white text-[#3B82F6] shadow-md border border-slate-200'
                  : highContrast
                  ? 'text-yellow-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>[📊 방문 이력 대시보드]</span>
            </button>

            <button
              id="tab-btn-reservations-manage"
              role="tab"
              aria-selected={activeTab === 'reservations'}
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? highContrast
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'bg-white text-[#3B82F6] shadow-md border border-slate-200'
                  : highContrast
                  ? 'text-yellow-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>[📅 예약 관리 ({reservations.length}건)]</span>
            </button>
          </div>

          {/* Tab 1: 서비스 방문 이력 시각화 대시보드 */}
          {activeTab === 'dashboard' && (
            <div className="w-full mt-2">
              <VisitHistoryDashboard
                visitRecords={visitRecords}
                highContrast={highContrast}
              />

              {/* Bottom Quick Action: Next Reservation Info */}
              {reservations.length > 0 ? (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition-all ${
                    highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                      : 'bg-blue-50/80 border-blue-200 text-slate-800'
                  }`}
                >
                  <div>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'
                      }`}
                    >
                      예약 대기 중
                    </span>
                    <h4 className="text-base sm:text-lg font-black mt-1">
                      다음 상담 예약: {reservations[0].serviceName} ({reservations[0].date} {reservations[0].time})
                    </h4>
                    <p className="text-xs sm:text-sm opacity-80 font-medium">
                      담당 직원: <strong className="font-bold">{reservations[0].staffName}</strong> 님 ({reservations[0].location})
                    </p>
                  </div>

                  <button
                    id="btn-goto-reservations-tab"
                    onClick={() => setActiveTab('reservations')}
                    className={`px-5 py-3 rounded-xl font-black text-sm sm:text-base whitespace-nowrap cursor-pointer shadow active:scale-95 transition-all ${
                      highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                        : 'bg-[#3B82F6] text-white hover:bg-blue-600 shadow-blue-200'
                    }`}
                  >
                    [📅 예약 일정 변경·취소하기]
                  </button>
                </div>
              ) : (
                <div className="text-center pt-2">
                  <p className="text-sm font-semibold opacity-75 mb-3">
                    현재 예약된 일정이 없습니다. 필요 시 새로운 상담을 신청하실 수 있습니다.
                  </p>
                  <button
                    onClick={onGoHome}
                    className={`px-6 py-3 rounded-2xl font-black text-sm sm:text-base shadow active:scale-95 transition-all ${
                      highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                        : 'bg-[#3B82F6] text-white hover:bg-blue-600'
                    }`}
                  >
                    [새로운 상담 신청하기]
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: 예약 관리 (일정 변경 / 취소) */}
          {activeTab === 'reservations' && (
            <div className="w-full mt-2 text-left">
              {reservations.length === 0 ? (
                <div className="py-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <CalendarDays className="w-8 h-8" />
                  </div>
                  <h3
                    className={`text-xl sm:text-2xl font-black mb-2 tracking-tight ${
                      highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
                    }`}
                  >
                    등록된 예약 내역이 없습니다
                  </h3>
                  <p
                    className={`text-sm sm:text-base mb-6 font-medium ${
                      highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
                    }`}
                  >
                    새로운 상담 예약을 진행하시거나 지난 방문 이력 대시보드를 확인하세요.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow active:scale-95 transition-all ${
                        highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                          : 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      [📊 방문 이력 대시보드 보기]
                    </button>
                    <button
                      onClick={onGoHome}
                      className={`py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow active:scale-95 transition-all ${
                        highContrast
                          ? 'bg-zinc-900 border border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                          : 'bg-[#3B82F6] text-white hover:bg-blue-600'
                      }`}
                    >
                      [새 상담 예약 진행]
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                    <p
                      className={`text-sm sm:text-base font-bold ${
                        highContrast ? 'text-yellow-300/80' : 'text-slate-600'
                      }`}
                    >
                      변경하거나 취소하실 예약을 선택해 주세요.
                    </p>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="text-xs sm:text-sm font-bold text-[#3B82F6] dark:text-yellow-300 hover:underline cursor-pointer"
                    >
                      ← [📊 방문 이력 차트 보기]
                    </button>
                  </div>

                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl border-2 transition-all ${
                        highContrast
                          ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span
                            className={`text-xs sm:text-sm font-black px-3 py-1 rounded-lg ${
                              highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-[#3B82F6]'
                            }`}
                          >
                            {res.serviceName}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black mt-2">
                            {res.date} {res.time}
                          </h3>
                        </div>
                        <span className="text-sm font-bold opacity-75">{res.location}</span>
                      </div>

                      <div className="text-sm sm:text-base opacity-80 mb-5 font-medium">
                        담당 직원: <strong className="font-black text-slate-900 dark:text-yellow-300">{res.staffName}</strong>님 | 신청자: {res.clientName}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* [📅 예약 변경하기] */}
                        <button
                          id={`btn-manage-change-${res.id}`}
                          onClick={() => {
                            setTargetRes(res);
                            setSubMode('change_date');
                          }}
                          className={`flex-1 py-4 px-5 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer ${
                            highContrast
                              ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                              : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
                          }`}
                        >
                          <Calendar className="w-5 h-5" />
                          <span>[📅 예약 변경하기]</span>
                        </button>

                        {/* [❌ 예약 취소하기] */}
                        <button
                          id={`btn-manage-cancel-${res.id}`}
                          onClick={() => {
                            setTargetRes(res);
                            setSubMode('cancel_confirm');
                          }}
                          className={`flex-1 py-4 px-5 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 border-2 active:scale-95 transition-all cursor-pointer ${
                            highContrast
                              ? 'border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <XCircle className="w-5 h-5" />
                          <span>[❌ 예약 취소하기]</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 직원 일정 변경 알림 테스트 버튼 */}
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 mt-4">
            <button
              onClick={() => setSubMode('staff_changed_notice')}
              className="text-xs text-slate-400 hover:underline cursor-pointer"
            >
              (13. 직원 일정 변경 또는 상담 불가 안내 화면 보기)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 11. 예약 변경 - 2단계: 변경할 날짜 선택
  if (subMode === 'change_date' && targetRes) {
    return (
      <div id="change-date-view" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <h2
            className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "변경하실 날짜를 선택해주세요."
          </h2>
          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            기존 예약: {targetRes.date} {targetRes.time}
          </p>

          <div className="flex flex-col gap-3.5 mb-8">
            {availableDates.map((dStr) => (
              <button
                key={dStr}
                onClick={() => {
                  setNewDate(dStr);
                  setSubMode('change_time');
                }}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 font-black text-lg sm:text-2xl flex items-center justify-between active:scale-95 transition-all hover:shadow-lg ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-50 border-slate-200 hover:border-[#3B82F6] text-slate-900'
                }`}
              >
                <span>{dStr}</span>
                <ArrowRight className="w-6 h-6 opacity-60 text-[#3B82F6]" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setSubMode('list')}
            className="text-sm sm:text-base font-bold text-slate-600 dark:text-yellow-300 hover:underline"
          >
            [예약 목록으로 돌아가기]
          </button>
        </div>
      </div>
    );
  }

  // 11. 예약 변경 - 3단계: 변경 가능한 시간 조회 및 선택
  if (subMode === 'change_time' && targetRes) {
    const timesForDate = timeSlotsByDate[newDate] || [];

    return (
      <div id="change-time-view" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <h2
            className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "{newDate}에 변경 가능한 시간을 선택해주세요."
          </h2>

          <div className="grid grid-cols-2 gap-3.5 my-8">
            {timesForDate.map((tStr) => (
              <button
                key={tStr}
                onClick={() => {
                  setNewTime(tStr);
                  setSubMode('change_confirm');
                }}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 font-black text-xl sm:text-3xl flex items-center justify-center gap-2.5 active:scale-95 transition-all hover:shadow-lg ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                    : 'bg-slate-50 border-slate-200 hover:border-[#3B82F6] text-slate-900'
                }`}
              >
                <Clock className="w-6 h-6 text-[#3B82F6]" />
                <span>[{tStr}]</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setSubMode('change_date')}
            className="text-sm sm:text-base font-bold text-slate-600 dark:text-yellow-300 hover:underline"
          >
            ← [날짜 다시 선택]
          </button>
        </div>
      </div>
    );
  }

  // 11. 예약 변경 - 4단계: 변경 내용 확인 & 확정
  if (subMode === 'change_confirm' && targetRes) {
    const handleConfirmChange = () => {
      const updated: Reservation = {
        ...targetRes,
        date: newDate,
        time: newTime
      };
      onUpdateReservation(updated);
      setSubMode('change_success');
      speechService.speak('상담 예약 변경이 완료되었습니다.');
    };

    return (
      <div id="change-confirm-view" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <h2
            className={`text-2xl sm:text-4xl font-black mb-4 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            예약 변경 내용을 확인해주세요
          </h2>

          <div
            className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl mb-8 text-left border-2 text-base sm:text-xl ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-zinc-800 opacity-70">
              <span className="font-medium">기존 일정</span>
              <span className="font-black">{targetRes.date} {targetRes.time}</span>
            </div>
            <div className="flex justify-between py-3 font-black text-[#3B82F6] dark:text-yellow-300 text-xl sm:text-2xl">
              <span>변경할 일정</span>
              <span>{newDate} {newTime}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200 dark:border-zinc-800">
              <span className="opacity-70 font-medium">담당 직원</span>
              <span className="font-black">{targetRes.staffName}님</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5">
            <button
              onClick={handleConfirmChange}
              className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              [변경 확정]
            </button>

            <button
              onClick={() => setSubMode('change_time')}
              className={`py-5 px-8 rounded-2xl sm:rounded-3xl text-lg font-bold border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              [↩ 다시 선택]
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 11. 예약 변경 완료
  if (subMode === 'change_success') {
    return (
      <div id="change-success-view" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-emerald-100'
          }`}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mb-3 text-emerald-600 dark:text-yellow-300 tracking-tight">
            상담 예약이 성공적으로 변경되었습니다.
          </h2>
          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            변경 내역이 대상자 및 담당 직원에게 문자로 발송되었습니다.
          </p>
          <button
            onClick={onGoHome}
            className={`py-4 sm:py-5 px-8 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black shadow-lg active:scale-95 transition-all ${
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

  // 12. 예약 취소 확인 화면 (프롬프트 엄격 일치)
  if (subMode === 'cancel_confirm' && targetRes) {
    const handleConfirmCancel = () => {
      onCancelReservation(targetRes.id);
      setSubMode('cancel_success');
      speechService.speak('예약이 취소되었습니다.');
    };

    return (
      <div id="step-reserve-cancel" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-rose-200'
          }`}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-rose-100 text-rose-600'
            }`}
          >
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 text-rose-700 dark:text-yellow-300 tracking-tight">
            "예약을 취소하시겠습니까?"
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            취소 대상: {targetRes.serviceName} ({targetRes.date} {targetRes.time})
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <button
              id="btn-cancel-yes"
              onClick={handleConfirmCancel}
              className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'
              }`}
            >
              [네, 취소합니다]
            </button>

            <button
              id="btn-cancel-no"
              onClick={() => setSubMode('list')}
              className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-xl font-bold border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              [아니요]
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 12. 예약 취소 완료 화면 (프롬프트 엄격 일치)
  if (subMode === 'cancel_success') {
    return (
      <div id="cancel-success-view" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${
              highContrast ? 'text-yellow-300' : 'text-[#1E293B]'
            }`}
          >
            "예약이 취소되었습니다."
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            예약 취소 사실이 대상자 및 담당 직원에게 문자로 발송되었습니다.
          </p>

          <button
            onClick={onGoHome}
            className={`py-4 sm:py-5 px-8 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black shadow-lg active:scale-95 transition-all ${
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

  // 13. 직원의 일정 변경 또는 상담 불가 화면 (프롬프트 엄격 일치)
  if (subMode === 'staff_changed_notice') {
    return (
      <div id="staff-schedule-changed-view" className="w-full max-w-3xl mx-auto py-3 px-2 flex justify-center">
        <div
          className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-2 text-center shadow-xl w-full transition-all ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400'
              : 'bg-white text-slate-900 border-amber-200'
          }`}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 leading-snug tracking-tight">
            "죄송합니다.
            <br />
            담당 직원의 일정이 변경되어 기존 예약 시간에 상담이 어렵습니다."
          </h2>

          <p
            className={`text-base sm:text-lg mb-8 font-medium ${
              highContrast ? 'text-yellow-300/80' : 'text-[#334155]'
            }`}
          >
            담당 직원의 공무 출장 또는 긴급 일정으로 인해 다른 시간으로 예약을 도와드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                if (targetRes) setSubMode('change_date');
                else onGoHome();
              }}
              className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-black shadow-lg active:scale-95 transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              [다른 시간 예약하기]
            </button>

            <button
              onClick={onCallDesk}
              className={`flex-1 py-5 px-6 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-bold border-2 active:scale-95 transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300 hover:bg-zinc-800'
                  : 'bg-[#10B981] text-white border-[#10B981] hover:bg-emerald-600 shadow-md shadow-emerald-200'
              }`}
            >
              [담당 직원에게 문의하기]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
