import { OperatingMode } from '../types';

export interface OperatingStatus {
  now: Date;
  dateStr: string; // e.g., "9월 5일 (토)"
  timeStr: string; // e.g., "22:06"
  dayOfWeekName: string; // e.g., "토요일"
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isBusinessDay: boolean; // 평일(월~금)이면서 공휴일이 아님
  isBusinessHours: boolean; // 09:00 ~ 18:00
  isLunchTime: boolean; // 12:00 ~ 13:00
  isBusiness: boolean; // 실제 업무 중인지 여부 (모드 오버라이드 반영)
  statusType: 'business' | 'lunch' | 'after_hours' | 'holiday';
  statusBadge: string;
  staffStatusText: string;
  hoursNotice: string;
  operatingDaysNotice: string;
}

// 대한민국 법정 고정 공휴일 (월-일)
const KOREAN_FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': '신정',
  '03-01': '3·1절',
  '05-05': '어린이날',
  '06-06': '현충일',
  '08-15': '광복절',
  '10-03': '개천절',
  '10-09': '한글날',
  '12-25': '성탄절',
};

// 주요 음력 및 대체 공휴일 (2024~2027 주요 공휴일 매핑)
const KNOWN_SPECIAL_HOLIDAYS: Record<string, string> = {
  // 2025년
  '2025-01-28': '설날 연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날 연휴',
  '2025-05-06': '대체공휴일',
  '2025-10-05': '추석 연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석 연휴',
  '2025-10-08': '대체공휴일',
  // 2026년
  '2026-02-16': '설날 연휴',
  '2026-02-17': '설날',
  '2026-02-18': '설날 연휴',
  '2026-05-24': '부처님오신날',
  '2026-05-25': '대체공휴일',
  '2026-09-24': '추석 연휴',
  '2026-09-25': '추석',
  '2026-09-26': '추석 연휴',
};

const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const DAY_SHORT_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 현재 일시와 영업일, 영업시간 규칙을 계산하여 운영 상태를 반환합니다.
 * @param manualOverride 사용자가 테스트용으로 강제 토글한 모드 (null이면 실시간 계산)
 * @param customDate 테스트나 특정 일시 기준 계산을 위한 Date 객체
 */
export function getOperatingStatus(
  manualOverride?: OperatingMode | null,
  customDate?: Date
): OperatingStatus {
  const now = customDate || new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const day = now.getDay(); // 0: 일, 6: 토

  const monthStr = String(month).padStart(2, '0');
  const dateNumStr = String(date).padStart(2, '0');
  const mmdd = `${monthStr}-${dateNumStr}`;
  const yyyymmdd = `${year}-${monthStr}-${dateNumStr}`;

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const hoursStr = String(hours).padStart(2, '0');
  const minsStr = String(minutes).padStart(2, '0');
  const timeStr = `${hoursStr}:${minsStr}`;
  const dateStr = `${month}월 ${date}일 (${DAY_SHORT_NAMES[day]})`;
  const dayOfWeekName = DAY_NAMES[day];

  // 1. 주말 여부 (토요일: 6, 일요일: 0)
  const isWeekend = day === 0 || day === 6;

  // 2. 공휴일 확인
  let isHoliday = isWeekend;
  let holidayName: string | undefined = undefined;

  if (isWeekend) {
    holidayName = day === 0 ? '일요일 (주말 휴무)' : '토요일 (주말 휴무)';
  }

  if (KOREAN_FIXED_HOLIDAYS[mmdd]) {
    isHoliday = true;
    holidayName = KOREAN_FIXED_HOLIDAYS[mmdd];
  } else if (KNOWN_SPECIAL_HOLIDAYS[yyyymmdd]) {
    isHoliday = true;
    holidayName = KNOWN_SPECIAL_HOLIDAYS[yyyymmdd];
  }

  const isBusinessDay = !isHoliday;

  // 3. 시간대 확인 (영업시간: 09:00 ~ 18:00, 점심시간: 12:00 ~ 13:00)
  const isMorning = timeInMinutes < 540; // < 09:00
  const isEvening = timeInMinutes >= 1080; // >= 18:00
  const isLunchTime = isBusinessDay && timeInMinutes >= 720 && timeInMinutes < 780; // 12:00 ~ 13:00
  const isBusinessHours = isBusinessDay && timeInMinutes >= 540 && timeInMinutes < 1080;

  // 4. 상태 타입 판별
  let naturalStatusType: 'business' | 'lunch' | 'after_hours' | 'holiday';
  if (isHoliday) {
    naturalStatusType = 'holiday';
  } else if (isLunchTime) {
    naturalStatusType = 'lunch';
  } else if (isBusinessHours) {
    naturalStatusType = 'business';
  } else {
    naturalStatusType = 'after_hours';
  }

  // 5. 모드 오버라이드 적용 (사용자가 수동 토글한 경우)
  const effectiveMode: OperatingMode =
    manualOverride !== null && manualOverride !== undefined
      ? manualOverride
      : naturalStatusType === 'business' || naturalStatusType === 'lunch'
      ? 'business'
      : 'after_hours';

  const isBusiness = effectiveMode === 'business';

  // 6. 정확하고 친절한 문구 생성 (프롬프트 엄격 반영)
  let statusBadge = '';
  let staffStatusText = '';

  const operatingDaysNotice = '공단 영업일: 평일(월~금) | 휴무일: 토요일, 일요일, 법정 공휴일';
  const hoursNotice = '공단 영업시간: 09:00 ~ 18:00 (점심시간: 12:00 ~ 13:00)';

  if (manualOverride) {
    // 수동 오버라이드 상태일 때
    if (manualOverride === 'business') {
      statusBadge = '● 업무시간 (수동 전환됨)';
      staffStatusText = '직원이 자리에 있습니다. (창구 상담 및 지원 신청 접수 가능)';
    } else {
      statusBadge = '○ 휴일 및 야간 (수동 전환됨)';
      staffStatusText = '직원이 자리에 없습니다. (문자 남기기 또는 상담 예약 이용)';
    }
  } else {
    // 실시간 날짜/시간 기준
    if (isHoliday) {
      statusBadge = `휴일 (${holidayName || '주말·공휴일'})`;
      staffStatusText = '휴일이라 직원이 자리에 없습니다. (당직 및 24시간 비상콜센터 운영)';
    } else if (isMorning) {
      statusBadge = '업무 개시 전 (야간)';
      staffStatusText = '업무시간(09:00~18:00) 전이라 직원이 자리에 없습니다. (09:00 업무 시작)';
    } else if (isEvening) {
      statusBadge = '업무시간 종료 (야간)';
      staffStatusText = '오늘 업무시간(09:00~18:00)이 종료되어 직원이 자리에 없습니다. (익일 09:00 업무 시작)';
    } else if (isLunchTime) {
      statusBadge = '점심시간 (12:00~13:00)';
      staffStatusText = '직원 점심시간(12:00~13:00)입니다. (13:00부터 정상 상담 가능)';
    } else {
      statusBadge = '● 정상 업무시간 (09:00~18:00)';
      staffStatusText = '직원이 자리에 있습니다. (창구 대면 상담 및 신청 가능)';
    }
  }

  return {
    now,
    dateStr,
    timeStr,
    dayOfWeekName,
    isWeekend,
    isHoliday,
    holidayName,
    isBusinessDay,
    isBusinessHours,
    isLunchTime,
    isBusiness,
    statusType: isBusiness ? (isLunchTime ? 'lunch' : 'business') : (isHoliday ? 'holiday' : 'after_hours'),
    statusBadge,
    staffStatusText,
    hoursNotice,
    operatingDaysNotice,
  };
}
