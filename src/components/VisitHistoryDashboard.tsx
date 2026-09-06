import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  CalendarCheck,
  CheckCircle,
  FileCheck,
  Building2,
  Briefcase,
  AlertCircle,
  HeartHandshake,
  Clock,
  Filter
} from 'lucide-react';
import { VisitRecord } from '../types';

interface VisitHistoryDashboardProps {
  visitRecords: VisitRecord[];
  highContrast: boolean;
}

export const VisitHistoryDashboard: React.FC<VisitHistoryDashboardProps> = ({
  visitRecords,
  highContrast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 월별 방문 집계 데이터 (4월~9월)
  const monthlyData = [
    { month: '4월', visits: 1, completed: 1, scheduled: 0, desc: '취업 기초상담' },
    { month: '5월', visits: 2, completed: 2, scheduled: 0, desc: '주거 신청 / 이력서' },
    { month: '6월', visits: 1, completed: 1, scheduled: 0, desc: '긴급 생계비' },
    { month: '7월', visits: 1, completed: 1, scheduled: 0, desc: '임대주택 계약' },
    { month: '8월', visits: 1, completed: 1, scheduled: 0, desc: '심리안정 상담' },
    { month: '9월', visits: 1, completed: 0, scheduled: 1, desc: '주거 사후관리 (예정)' }
  ];

  // 서비스 분야별 분포 집계
  const serviceCounts: Record<string, number> = {};
  visitRecords.forEach((r) => {
    serviceCounts[r.serviceName] = (serviceCounts[r.serviceName] || 0) + 1;
  });

  const categoryColorMap: Record<string, { light: string; highContrast: string }> = {
    '주거지원': { light: '#3B82F6', highContrast: '#FACC15' },
    '취업지원': { light: '#10B981', highContrast: '#38BDF8' },
    '긴급지원': { light: '#F59E0B', highContrast: '#FB923C' },
    '심리·가족상담': { light: '#8B5CF6', highContrast: '#C084FC' }
  };

  const categoryPieData = Object.keys(serviceCounts).map((name) => ({
    name,
    value: serviceCounts[name],
    color: categoryColorMap[name]?.light || '#64748B',
    hcColor: categoryColorMap[name]?.highContrast || '#FACC15'
  }));

  // 필터링된 방문 기록
  const filteredRecords =
    selectedCategory === 'all'
      ? visitRecords
      : visitRecords.filter((r) => r.serviceName.includes(selectedCategory));

  // 요약 통계 계산
  const totalVisits = visitRecords.length;
  const completedCount = visitRecords.filter((r) => r.status === 'completed').length;
  const scheduledCount = visitRecords.filter((r) => r.status === 'scheduled').length;

  return (
    <div
      id="visit-history-dashboard"
      className={`w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 mb-8 transition-all text-left ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-white text-slate-800 border-slate-200 shadow-md shadow-slate-100'
      }`}
    >
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              highContrast ? 'bg-zinc-900 text-yellow-300' : 'bg-blue-50 text-[#3B82F6]'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-blue-700'
                }`}
              >
                시각화 리포트
              </span>
              <span className="text-xs opacity-75 font-semibold">대상자: 홍길동 님</span>
            </div>
            <h3
              className={`text-xl sm:text-2xl font-black mt-0.5 tracking-tight ${
                highContrast ? 'text-yellow-300' : 'text-slate-900'
              }`}
            >
              나의 공단 서비스 방문 이력 대시보드
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-medium opacity-80">
          최근 6개월간의 공단 방문 및 상담 통계입니다.
        </p>
      </div>

      {/* KPI Stat Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Card 1: 총 방문 횟수 */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between opacity-80 mb-2">
            <span className="text-xs sm:text-sm font-bold">누적 방문 횟수</span>
            <CalendarCheck className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-4xl font-black">{totalVisits}</span>
            <span className="text-sm font-bold">회</span>
          </div>
          <p className="text-xs opacity-70 mt-1 font-medium">완료 {completedCount}건 / 예정 {scheduledCount}건</p>
        </div>

        {/* Card 2: 최다 이용 서비스 */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between opacity-80 mb-2">
            <span className="text-xs sm:text-sm font-bold">주요 이용 분야</span>
            <Building2 className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black">주거지원</span>
            <span className="text-xs sm:text-sm font-bold opacity-80">(3회)</span>
          </div>
          <p className="text-xs opacity-70 mt-1 font-medium">임대주택 및 보증금 지원</p>
        </div>

        {/* Card 3: 상담 및 지원 완료율 */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between opacity-80 mb-2">
            <span className="text-xs sm:text-sm font-bold">지원 완료율</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-yellow-300">100</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-yellow-300">%</span>
          </div>
          <p className="text-xs opacity-70 mt-1 font-medium">진행 건 전원 적합 판정 완료</p>
        </div>

        {/* Card 4: 다음 방문 예정일 */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/60 text-yellow-300'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center justify-between opacity-80 mb-2">
            <span className="text-xs sm:text-sm font-bold">다음 예정 방문</span>
            <Clock className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
          </div>
          <div className="text-base sm:text-lg font-black leading-tight">
            09월 08일 (화)
          </div>
          <p className="text-xs opacity-75 mt-1 font-semibold">14:00 (주거지원 사후관리)</p>
        </div>
      </div>

      {/* Visual Charts Grid (2 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
        {/* Chart 1: 월별 방문 추이 바 차트 (7 cols) */}
        <div
          className={`lg:col-span-7 p-4 sm:p-5 rounded-2xl border-2 flex flex-col justify-between ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/50 text-yellow-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
              <h4 className="text-base sm:text-lg font-black">월별 방문 및 지원 건수</h4>
            </div>
            <span className="text-xs opacity-70 font-semibold">(단위: 회)</span>
          </div>

          <div className="w-full h-56 sm:h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={highContrast ? '#3f3f46' : '#E2E8F0'}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: highContrast ? '#FACC15' : '#475569',
                    fontSize: 13,
                    fontWeight: 700
                  }}
                  axisLine={{ stroke: highContrast ? '#FACC15' : '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  ticks={[0, 1, 2, 3]}
                  domain={[0, 3]}
                  tick={{
                    fill: highContrast ? '#FACC15' : '#475569',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                  axisLine={{ stroke: highContrast ? '#FACC15' : '#CBD5E1' }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          className={`p-3 rounded-xl shadow-lg border-2 text-xs sm:text-sm ${
                            highContrast
                              ? 'bg-black text-yellow-300 border-yellow-400'
                              : 'bg-white text-slate-800 border-slate-200'
                          }`}
                        >
                          <p className="font-black text-sm mb-1">{label} 방문 이력</p>
                          <p className="font-semibold text-[#3B82F6] dark:text-yellow-300">
                            방문 건수: {data.visits}회
                          </p>
                          <p className="text-xs opacity-80 mt-0.5">{data.desc}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="visits"
                  name="방문 횟수"
                  fill={highContrast ? '#FACC15' : '#3B82F6'}
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs font-bold opacity-80">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-sm ${highContrast ? 'bg-yellow-400' : 'bg-[#3B82F6]'}`}
              />
              <span>방문 상담 완료 (4월~8월)</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-sm border-2 border-dashed ${
                  highContrast ? 'border-yellow-400' : 'border-[#3B82F6]'
                }`}
              />
              <span>예약 예정 (9월)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: 서비스 분야별 분포 도넛 차트 (5 cols) */}
        <div
          className={`lg:col-span-5 p-4 sm:p-5 rounded-2xl border-2 flex flex-col justify-between ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400/50 text-yellow-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400" />
              <h4 className="text-base sm:text-lg font-black">서비스 분야별 비율</h4>
            </div>
            <span className="text-xs opacity-70 font-semibold">(총 7건 기준)</span>
          </div>

          <div className="w-full h-48 sm:h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={highContrast ? entry.hcColor : entry.color}
                      stroke={highContrast ? '#000' : '#fff'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const percent = Math.round(((data.value as number) / totalVisits) * 100);
                      return (
                        <div
                          className={`p-2.5 rounded-xl shadow-lg border-2 text-xs sm:text-sm font-bold ${
                            highContrast
                              ? 'bg-black text-yellow-300 border-yellow-400'
                              : 'bg-white text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>{data.name}: </span>
                          <span className="font-black text-[#3B82F6] dark:text-yellow-300">
                            {data.value}회 ({percent}%)
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs font-extrabold">
            {categoryPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: highContrast ? item.hcColor : item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-black shrink-0 ml-1">
                  {item.value}회 ({Math.round((item.value / totalVisits) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Visit History Timeline Table / List */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#3B82F6] dark:text-yellow-400" />
            <h4 className="text-base sm:text-xl font-black">상세 방문 및 상담 이력</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {filteredRecords.length}건
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold opacity-70 mr-1 hidden sm:inline">분야별 보기:</span>
            {['all', '주거지원', '취업지원', '긴급지원', '심리'].map((cat) => {
              const label =
                cat === 'all'
                  ? '전체'
                  : cat === '심리'
                  ? '심리상담'
                  : cat;
              const isActive =
                cat === 'all'
                  ? selectedCategory === 'all'
                  : selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black shadow'
                        : 'bg-[#3B82F6] text-white shadow-sm'
                      : highContrast
                      ? 'bg-zinc-900 text-yellow-300 border border-yellow-400/40 hover:bg-zinc-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Records List Cards */}
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const isCompleted = record.status === 'completed';
            const isScheduled = record.status === 'scheduled';

            return (
              <div
                key={record.id}
                className={`p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isScheduled
                    ? highContrast
                      ? 'bg-zinc-900 border-yellow-400'
                      : 'bg-blue-50/50 border-blue-200'
                    : highContrast
                    ? 'bg-zinc-950 border-zinc-800 hover:border-yellow-400/50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-slate-500 dark:text-yellow-300/80">
                      {record.date}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                        record.serviceId === 'housing'
                          ? 'bg-blue-100 text-blue-700 dark:bg-zinc-800 dark:text-yellow-300'
                          : record.serviceId === 'job'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-zinc-800 dark:text-cyan-300'
                          : record.serviceId === 'emergency'
                          ? 'bg-amber-100 text-amber-700 dark:bg-zinc-800 dark:text-orange-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-zinc-800 dark:text-purple-300'
                      }`}
                    >
                      {record.serviceName}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isScheduled
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-400 text-white'
                      }`}
                    >
                      {record.statusLabel}
                    </span>
                  </div>

                  <h5 className="text-base sm:text-lg font-black tracking-tight mb-1">
                    {record.purpose}
                  </h5>

                  <p className="text-xs sm:text-sm opacity-80 font-medium">
                    결과 요약: <span className="font-bold">{record.outcomeNotes}</span>
                  </p>
                </div>

                <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-zinc-800 text-xs sm:text-sm font-semibold opacity-85 shrink-0">
                  <div>담당: <strong className="font-black text-slate-900 dark:text-yellow-300">{record.staffName}</strong> 님</div>
                  <div className="opacity-75">{record.location}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
