import { ServiceItem, StaffMember, Reservation, VisitRecord } from '../types';

export const OFFICIAL_AGENCY_NAME = '한국법무보호복지공단';
export const CHATBOT_NAME = '보호안내원';

// 실제 운영기관 기준 공식 연락처
export const OFFICIAL_CONTACTS = {
  mainPhone: '1588-4113', // 공단 대표번호
  emergencyPhone: '02-3482-1400', // 공단 긴급 상황 안내전화
  crisisHotline109: '109', // 자살예방 상담전화 (국가 공식)
  crisisHotline1577: '1577-0199', // 정신건강 위기상담전화 (국가 공식)
  policePhone: '112',
};

// 한국법무보호복지공단 실제 공식 주요 사업 및 필요 서류
// (지침 준수: 범죄경력, 보호관찰 이력 등 민감정보는 텍스트로 노출하지 않음)
export const SYSTEM_SERVICES: ServiceItem[] = [
  {
    id: 'housing',
    name: '주거지원',
    iconName: 'Home',
    shortDesc: '안정적인 보금자리를 위한 LH 임대주택 등 주거 지원',
    helpQuestion: '잠잘 곳이나 안정적으로 머물 집이 필요하신가요?',
    requiredDocs: [
      {
        id: 'id_card',
        name: '신분증 (주민등록증, 운전면허증 등)',
        iconName: 'CreditCard',
        description: '본인 확인을 위한 신분증'
      },
      {
        id: 'resident_cert',
        name: '주민등록 관련 서류 (주민등록등본 또는 초본)',
        iconName: 'FileText',
        description: '최근 3개월 이내 발급된 등본 또는 초본'
      },
      {
        id: 'income_cert',
        name: '기타 필요한 서류 (소득 또는 재산 확인 서류)',
        iconName: 'FolderCheck',
        description: '해당 시 준비해 오시는 서류'
      }
    ]
  },
  {
    id: 'job',
    name: '취업지원',
    iconName: 'Briefcase',
    shortDesc: '허그일자리지원 프로그램, 직업훈련 및 취업 알선',
    helpQuestion: '일자리를 찾거나 직업 교육을 배우고 싶으신가요?',
    requiredDocs: [
      {
        id: 'id_card',
        name: '신분증 (주민등록증, 운전면허증 등)',
        iconName: 'CreditCard',
        description: '본인 확인을 위한 신분증'
      },
      {
        id: 'resume_doc',
        name: '주민등록 관련 서류 (주민등록등본)',
        iconName: 'FileText',
        description: '주소지 확인용 주민등록등본'
      },
      {
        id: 'career_doc',
        name: '기타 필요한 서류 (자격증 사본 또는 통장 사본)',
        iconName: 'FolderCheck',
        description: '자격증이나 수당 지급용 통장이 있는 경우'
      }
    ]
  },
  {
    id: 'emergency',
    name: '긴급지원',
    iconName: 'AlertCircle',
    shortDesc: '갑작스러운 위기 상황을 위한 긴급 생계비 및 원호 지원',
    helpQuestion: '당장 식사나 치료, 긴급한 생계 도움이 필요하신가요?',
    requiredDocs: [
      {
        id: 'id_card',
        name: '신분증 (주민등록증, 운전면허증 등)',
        iconName: 'CreditCard',
        description: '본인 확인용 신분증'
      },
      {
        id: 'resident_cert',
        name: '주민등록 관련 서류 (주민등록등본)',
        iconName: 'FileText',
        description: '가구원 확인용 등본'
      },
      {
        id: 'medical_doc',
        name: '기타 필요한 서류 (진료확인서 또는 영수증)',
        iconName: 'FolderCheck',
        description: '의료비나 긴급 사유를 증빙할 수 있는 서류'
      }
    ]
  },
  {
    id: 'dormitory',
    name: '숙식지원',
    iconName: 'BedDouble',
    shortDesc: '생활관 입소를 통한 안전한 의식주 무료 제공',
    helpQuestion: '당장 지낼 곳이 없어 생활관에서 식사와 숙박을 제공받고 싶으신가요?',
    requiredDocs: [
      {
        id: 'id_card',
        name: '신분증 (주민등록증, 운전면허증 등)',
        iconName: 'CreditCard',
        description: '본인 확인을 위한 신분증'
      },
      {
        id: 'resident_cert',
        name: '주민등록 관련 서류 (주민등록등본 또는 초본)',
        iconName: 'FileText',
        description: '기본 신원 확인 서류'
      },
      {
        id: 'health_check',
        name: '기타 필요한 서류 (건강검진표 또는 소견서)',
        iconName: 'FolderCheck',
        description: '단체생활 가능 여부 확인 서류 (추후 제출 가능)'
      }
    ]
  },
  {
    id: 'family_counsel',
    name: '기타 (가족지원 / 심리상담)',
    iconName: 'HeartHandshake',
    shortDesc: '가족관계 회복 지원 및 심리·정서 안정 상담',
    helpQuestion: '가족과의 갈등을 풀고 싶거나 마음이 답답해 심리상담이 필요하신가요?',
    requiredDocs: [
      {
        id: 'id_card',
        name: '신분증 (주민등록증, 운전면허증 등)',
        iconName: 'CreditCard',
        description: '본인 확인을 위한 신분증'
      },
      {
        id: 'resident_cert',
        name: '주민등록 관련 서류 (가족관계증명서 또는 등본)',
        iconName: 'FileText',
        description: '가족관계 확인을 위한 서류'
      },
      {
        id: 'counsel_req',
        name: '기타 필요한 서류',
        iconName: 'FolderCheck',
        description: '상담 시 필요한 관련 서류'
      }
    ]
  }
];

// 실제 시스템에 등록된 직원 목록
export const INITIAL_STAFF_LIST: StaffMember[] = [
  {
    id: 'staff_1',
    name: '김보호',
    department: '상담지원팀 / 주임',
    phone: '02-3482-1411',
    isAvailable: true
  },
  {
    id: 'staff_2',
    name: '이희망',
    department: '취업지원팀 / 대리',
    phone: '02-3482-1422',
    isAvailable: true
  },
  {
    id: 'staff_3',
    name: '박사랑',
    department: '생활관지원팀 / 팀장',
    phone: '02-3482-1433',
    isAvailable: true
  },
  {
    id: 'staff_4',
    name: '정나눔',
    department: '가족복지팀 / 주임',
    phone: '02-3482-1444',
    isAvailable: false // 연결 불가 테스트용 직원
  }
];

// 등록된 내담자 샘플 (이름 또는 전화번호로 실제 시스템 확인 가능)
export const REGISTERED_CLIENTS: Record<string, { name: string; phone: string; assignedStaffId: string }> = {
  '홍길동': { name: '홍길동', phone: '010-1234-5678', assignedStaffId: 'staff_1' },
  '김철수': { name: '김철수', phone: '010-2345-6789', assignedStaffId: 'staff_2' },
  '이영희': { name: '이영희', phone: '010-3456-7890', assignedStaffId: 'staff_3' }
};

// 예약 가능한 날짜 목록 (시스템 조회 기준)
export const AVAILABLE_DATES = [
  '2026-09-08 (화)',
  '2026-09-09 (수)',
  '2026-09-10 (목)',
  '2026-09-11 (금)',
  '2026-09-15 (화)'
];

// 날짜별 실제 예약 가능 시간 목록
export const AVAILABLE_TIMES_MAP: Record<string, string[]> = {
  '2026-09-08 (화)': ['10:00', '11:00', '14:00', '15:00', '16:00'],
  '2026-09-09 (수)': ['10:00', '11:00', '14:00', '15:00'],
  '2026-09-10 (목)': ['11:00', '14:00', '15:00'],
  '2026-09-11 (금)': ['10:00', '14:00'],
  '2026-09-15 (화)': [] // 예약 가능한 시간이 없는 날짜 테스트용
};

// 기본 등록 예약 샘플
export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res_sample_1',
    clientName: '홍길동',
    clientPhone: '010-1234-5678',
    serviceId: 'housing',
    serviceName: '주거지원',
    date: '2026-09-08 (화)',
    time: '14:00',
    staffName: '김보호',
    location: '본관 2층 1상담실',
    createdAt: '2026-09-01'
  }
];

// 공단 제공 서비스 방문 및 상담 이력 데이터
export const INITIAL_VISIT_HISTORY: VisitRecord[] = [
  {
    id: 'visit_rec_1',
    date: '2026-04-15',
    serviceId: 'job',
    serviceName: '취업지원',
    staffName: '이희망',
    location: '본관 3층 취업상담실',
    purpose: '취업 적성검사 및 진로 초기 심층상담',
    status: 'completed',
    statusLabel: '상담 완료',
    outcomeNotes: '취업성공패키지 연계 및 적합 직종(조리/제빵) 훈련과정 추천'
  },
  {
    id: 'visit_rec_2',
    date: '2026-05-08',
    serviceId: 'housing',
    serviceName: '주거지원',
    staffName: '김보호',
    location: '본관 2층 1상담실',
    purpose: 'LH 공공임대주택 입주 신청서류 및 자격 심사',
    status: 'completed',
    statusLabel: '서류 접수 완료',
    outcomeNotes: '임대보증금 지원 대상자 심사 통과 및 추천서 발급'
  },
  {
    id: 'visit_rec_3',
    date: '2026-05-22',
    serviceId: 'job',
    serviceName: '취업지원',
    staffName: '이희망',
    location: '본관 3층 취업상담실',
    purpose: '직업훈련 참여수당 지급 신청 및 이력서 코칭',
    status: 'completed',
    statusLabel: '지원 완료',
    outcomeNotes: '자기소개서 첨삭 완료 및 모의 면접 지도 진행'
  },
  {
    id: 'visit_rec_4',
    date: '2026-06-18',
    serviceId: 'emergency',
    serviceName: '긴급지원',
    staffName: '정나눔',
    location: '본관 1층 통합복지창구',
    purpose: '긴급 생계비 및 원호 물품 수령 상담',
    status: 'completed',
    statusLabel: '지급 완료',
    outcomeNotes: '긴급 생계 구호비 50만원 지원금 집행 및 식료품 키트 제공'
  },
  {
    id: 'visit_rec_5',
    date: '2026-07-16',
    serviceId: 'housing',
    serviceName: '주거지원',
    staffName: '김보호',
    location: '본관 2층 1상담실',
    purpose: '임대주택 입주 계약 체결 지원 및 사후 관리 안내',
    status: 'completed',
    statusLabel: '계약 완료',
    outcomeNotes: 'LH 임대주택 입주 계약 체결 동행 및 입주 지원금 송금 완료'
  },
  {
    id: 'visit_rec_6',
    date: '2026-08-19',
    serviceId: 'family_counsel',
    serviceName: '심리·가족상담',
    staffName: '정나눔',
    location: '별관 마음나눔상담실',
    purpose: '사회적응 스트레스 완화 및 가족관계 개선 심리상담',
    status: 'completed',
    statusLabel: '상담 완료',
    outcomeNotes: '마음건강 척도 검사 및 가족 상담 2회차 지속 권고'
  },
  {
    id: 'visit_rec_7',
    date: '2026-09-08',
    serviceId: 'housing',
    serviceName: '주거지원',
    staffName: '김보호',
    location: '본관 2층 1상담실',
    purpose: '주거환경 적응 사후관리 및 자립 정착금 지원 심사',
    status: 'scheduled',
    statusLabel: '예약 예정',
    outcomeNotes: '방문 상담 대기 중 (준비서류: 신분증, 통장 사본)'
  }
];

