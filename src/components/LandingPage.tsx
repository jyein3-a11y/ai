import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Volume2,
  Calendar,
  PhoneCall,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  HeartHandshake,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Zap,
  Play,
  RotateCcw,
  Smartphone,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { OperatingStatus } from '../utils/operatingHours';
import { speechService } from '../utils/speech';
import { OFFICIAL_AGENCY_NAME, OFFICIAL_CONTACTS } from '../data/systemData';
import { ApiKeySection } from './ApiKeySection';
import { EditorialLookbookReviews } from './EditorialLookbookReviews';

interface LandingPageProps {
  operatingStatus: OperatingStatus;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onStartKiosk: () => void;
  geminiApiKey: string;
  isKeyVerified: boolean;
  onKeyVerified: (key: string) => void;
  onResetKey: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  operatingStatus,
  highContrast,
  onToggleHighContrast,
  onStartKiosk,
  geminiApiKey,
  isKeyVerified,
  onKeyVerified,
  onResetKey,
}) => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'housing' | 'job' | 'emergency' | 'counsel'>('housing');
  const [isPlayingTts, setIsPlayingTts] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsPlayingTts(speaking);
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  const handleTestTts = () => {
    if (isPlayingTts) {
      speechService.stop();
      setIsPlayingTts(false);
    } else {
      setIsPlayingTts(true);
      speechService.speak(
        '안녕하세요! 한국법무보호복지공단 디지털 보호안내원입니다. 주거지원, 취업지원, 긴급구호 등 원하시는 서비스를 쉽고 빠르게 안내해 드립니다.',
        true
      );
    }
  };

  const interactiveServices = {
    housing: {
      title: 'LH 공공임대주택 및 주거지원',
      badge: '최다 이용 서비스',
      description: '출소 후 주거 불안을 해소하고 안정된 보금자리를 마련하도록 임대주택 공급 및 보증금을 지원합니다.',
      benefit: '임대보증금 최대 전액 무이자 지원 및 최장 10년 거주 가능',
      docs: ['신분증 사본', '주민등록등본', '소득금액증명원', '출소증명서류']
    },
    job: {
      title: '취업성공패키지 & 직업훈련',
      badge: '자립 핵심 기반',
      description: '전문 직업상담사와 1:1 심층 상담을 통해 적성에 맞는 직종을 발굴하고 직업훈련 참여수당을 지급합니다.',
      benefit: '직업훈련비 전액 국비지원 + 참여수당 월 최대 28만 4천원 지급',
      docs: ['신분증', '이력서 및 자기소개서', '구직등록필증']
    },
    emergency: {
      title: '긴급 생계비 및 원호 물품 지원',
      badge: '신속 안심 구호',
      description: '갑작스러운 생계 위기, 질병, 사고 시 즉시 자립을 유지할 수 있도록 긴급 생계비와 물품을 신속 지급합니다.',
      benefit: '1인당 최대 50만원 생계비 즉시 지급 및 식료품·생필품 키트 제공',
      docs: ['신분증', '통장 사본', '긴급구호신청서 (현장 작성)']
    },
    counsel: {
      title: '심리안정 & 가족관계 회복 상담',
      badge: '마음건강 케어',
      description: '사회적응 스트레스와 가족 갈등을 완화하기 위해 전문 심리상담사가 1:1 개인상담 및 가족상담을 제공합니다.',
      benefit: '전문 심리검사 무료 실시 및 정기 멘토링 연계',
      docs: ['신분증 (사전 예약 시 별도 지참서류 없음)']
    }
  };

  const faqs = [
    {
      q: '보호안내원 키오스크는 누구나 이용할 수 있나요?',
      a: '네, 한국법무보호복지공단을 방문하신 대상자, 가족, 유관기관 관계자 등 누구나 자유롭게 이용하실 수 있습니다. 글자가 작거나 기계 조작이 낯선 분들을 위해 큰 글씨, 고대비 화면, 친절한 음성 안내가 기본 제공됩니다.'
    },
    {
      q: '개인정보를 입력해도 안전하게 보호되나요?',
      a: '철저하게 보호됩니다. 보호안내원은 개인정보 최소 수집 원칙을 준수하며, 60초 동안 화면 조작이 없을 경우 보안 알림 후 자동으로 세션을 종료하고 입력된 정보를 즉시 파기합니다.'
    },
    {
      q: '공단 업무시간이 끝난 야간이나 주말/공휴일에도 이용할 수 있나요?',
      a: '네! 청사 1층 무인안내기는 365일 상시 작동합니다. 야간 및 휴일에는 자동으로 야간 전용 모드로 전환되어 당직실 비상전화 연결 및 24시간 위기상담전화(109, 1577-0199)를 즉시 안내해 드립니다.'
    },
    {
      q: '기존에 신청한 상담 예약 일정을 바꾸거나 취소할 수도 있나요?',
      a: '물론입니다. [상담 예약 관리] 메뉴에서 본인의 예약 내역을 실시간으로 확인하고 날짜 및 시간을 변경하거나 취소할 수 있으며, 지난 방문 및 지원 통계를 대시보드 차트로 확인하실 수 있습니다.'
    }
  ];

  return (
    <div
      id="landing-page-root"
      className={`min-h-screen w-full transition-colors duration-200 ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* 1. Top Navigation Bar */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all ${
          highContrast
            ? 'bg-black/95 border-yellow-400/80 text-yellow-300'
            : 'bg-white/90 border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-[#3B82F6] text-white shadow-md'
              }`}
            >
              보
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-yellow-300">
                  공식 서비스
                </span>
                <span className="text-xs font-semibold opacity-75">{OFFICIAL_AGENCY_NAME}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none mt-1">
                디지털 보호안내원
              </h1>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <a href="#self-reliance-lookbook" className="text-[#5D8B37] dark:text-yellow-400 hover:underline flex items-center gap-1 font-black">
              <span>자립 후기 (#01)</span>
            </a>
            <a href="#gemini-auth-section" className="text-[#3B82F6] dark:text-yellow-400 hover:underline flex items-center gap-1 font-black">
              <span>Gemini AI 승인</span>
              {isKeyVerified && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </a>
            <a href="#features" className="hover:text-[#3B82F6] dark:hover:text-white transition-colors">
              핵심 특장점
            </a>
            <a href="#services" className="hover:text-[#3B82F6] dark:hover:text-white transition-colors">
              주요 지원 사업
            </a>
            <a href="#dashboard-preview" className="hover:text-[#3B82F6] dark:hover:text-white transition-colors">
              방문 대시보드
            </a>
            <a href="#faq" className="hover:text-[#3B82F6] dark:hover:text-white transition-colors">
              자주 묻는 질문
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Operating Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                operatingStatus.isBusiness
                  ? highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  operatingStatus.isBusiness ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{operatingStatus.isBusiness ? '업무시간 운영 중' : '야간/휴일 안심 대응'}</span>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="고대비 모드 전환"
            >
              {highContrast ? '고대비 끄기' : '고대비 켜기'}
            </button>

            {/* Start Kiosk Button */}
            <button
              id="nav-btn-start-kiosk"
              onClick={onStartKiosk}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              <span>키오스크 시작</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Inspired by the Lookbook Editorial Design (Olive green, Asymmetric curve, Circles & Dots, Serif) */}
      <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-tl-[48px] sm:rounded-tl-[64px] rounded-br-[40px] sm:rounded-br-[56px] rounded-tr-3xl rounded-bl-3xl shadow-2xl transition-all ${
            highContrast
              ? 'bg-zinc-950 border-2 border-yellow-400 text-yellow-300'
              : 'bg-[#5F8D3E] text-white'
          }`}
        >
          {/* Circular Graphic Orbits & Playful Geometric Accent Dots (Design Elements from Image) */}
          <div className="absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-white/20 pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-white/15 pointer-events-none" />
          <div className="absolute -bottom-10 right-1/3 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />

          {/* Yellow and Coral-Orange Accent Circles (Directly from Image) */}
          <div className="absolute top-6 left-1/4 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FF5722] shadow-md pointer-events-none opacity-90 animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFE600] shadow-md pointer-events-none" />
          <div className="absolute top-2/3 left-1/3 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FF5722] shadow-md pointer-events-none" />
          <div className="absolute bottom-12 left-44 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFE600] shadow-md pointer-events-none" />

          {/* Grid Split Layout: Left Graphic Typography / Right Editorial Hope Photography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Left Column: Typographic & Graphic Hero */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
              <div>
                {/* Top Header Tag: 2026 / SS */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-white/20 backdrop-blur-xs border border-white/30 text-white dark:text-yellow-300">
                    <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-ping" />
                    <span>한국법무보호복지공단 디지털 무인안내원</span>
                  </div>

                  <div className="text-right text-base sm:text-lg font-black tracking-widest opacity-90">
                    2026<br />
                    <span className="font-bold opacity-80">SS</span>
                  </div>
                </div>

                {/* Big Editorial Title: Best / Review / Care */}
                <div className="mb-8">
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] drop-shadow-xs">
                    Best<br />
                    <span className="font-extrabold text-[#F4F8F0] dark:text-yellow-200">Review</span><br />
                    Care
                  </h2>
                </div>

                {/* Korean Editorial Subtext */}
                <div className="max-w-xl space-y-2 mb-8">
                  <p className="text-lg sm:text-xl font-black tracking-tight text-white dark:text-yellow-300">
                    믿고 찾는 자립 지원 베스트 케어
                  </p>
                  <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
                    지난 한 해 가장 많은 추천과 감사를 받은 공단 4대 핵심 서비스.
                    <br className="hidden sm:inline" />
                    작은 글씨와 복잡한 서류 절차의 막막함, 친절한 음성 안내(TTS)와
                    돋보기 큰 글씨로 <strong>30초 만에 해결</strong>해 드립니다.
                  </p>
                </div>
              </div>

              {/* Action Buttons & Category Tags */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <button
                    id="hero-btn-launch-kiosk"
                    onClick={onStartKiosk}
                    className={`px-6 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer ${
                      highContrast
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                        : 'bg-white hover:bg-stone-100 text-[#5F8D3E] shadow-stone-900/20'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-[#5F8D3E] dark:text-black" />
                    <span>[무인안내기 키오스크 체험]</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#gemini-auth-section"
                    className={`px-5 py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 active:scale-95 transition-all cursor-pointer ${
                      highContrast
                        ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                        : 'bg-black/20 hover:bg-black/30 border-white/40 text-white backdrop-blur-xs'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FFE600]" />
                    <span>{isKeyVerified ? '✨ Gemini 승인됨' : '🔑 Gemini API Key'}</span>
                  </a>

                  <button
                    onClick={handleTestTts}
                    disabled={isPlayingTts}
                    className="px-4 py-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingTts ? 'animate-bounce text-[#FFE600]' : ''}`} />
                    <span>{isPlayingTts ? '안내 중...' : '음성 미리듣기'}</span>
                  </button>
                </div>

                {/* Vertical / Horizontal Category Tags (From image: SANDALS, SLINGBACKS, SNEAKERS) */}
                <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest opacity-75 border-t border-white/20 pt-4">
                  <span>#HOUSING</span>
                  <span>•</span>
                  <span>#CAREER</span>
                  <span>•</span>
                  <span>#EMERGENCY</span>
                  <span>•</span>
                  <span>#COUNSEL</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Photograph with Hope & Daylight Mood (Figure in warm sunlit meadow) */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-stone-300">
              <img
                src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80"
                alt="자립의 희망과 햇살 가득한 새로운 시작"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              
              {/* Badge on Photo */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 backdrop-blur-md text-white border border-white/20">
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>새로운 내일을 향한 발걸음</span>
                </p>
                <p className="text-xs sm:text-sm font-medium opacity-90">
                  혼자가 아닙니다. 공단 보호안내원이 언제나 당신의 재도약을 함께합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Social Proof Strip under Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-left">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-[#5F8D3E] dark:text-yellow-400 font-black text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>100% 음성 지원</span>
            </div>
            <p className="text-xs opacity-75 font-medium">모든 화면을 소리로 읽어주는 배려</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-yellow-400 font-black text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>60초 자동 보호</span>
            </div>
            <p className="text-xs opacity-75 font-medium">미조작 시 개인정보 즉시 파기</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-yellow-400 font-black text-sm">
              <Clock className="w-4 h-4" />
              <span>24시간 안심 대응</span>
            </div>
            <p className="text-xs opacity-75 font-medium">야간·휴일 위기상담(109) 연동</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-yellow-400 font-black text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>시각화 대시보드</span>
            </div>
            <p className="text-xs opacity-75 font-medium">나의 방문 이력과 통계 한눈에</p>
          </div>
        </div>
      </section>

      {/* 2-1. Lookbook Editorial Reviews Section (#01. SELF-RELIANCE STORIES) */}
      <EditorialLookbookReviews
        highContrast={highContrast}
        onSelectService={(serviceKey) => {
          setActiveInteractiveTab(serviceKey);
          const el = document.getElementById('services');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onStartKiosk={onStartKiosk}
      />

      {/* 2-1. Gemini API Key Activation & Verification Section (CORS-safe server-to-server) */}
      <ApiKeySection
        highContrast={highContrast}
        apiKey={geminiApiKey}
        isKeyVerified={isKeyVerified}
        onKeyVerified={onKeyVerified}
        onResetKey={onResetKey}
        onStartKiosk={onStartKiosk}
      />

      {/* 3. 왜 '보호안내원'인가? 4대 핵심 강점 (Features Grid) */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-full max-w-2xl mx-auto border-t border-stone-300 dark:border-yellow-400/60 mb-6" />
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-900 dark:text-yellow-300">
            #02. Core Strengths
          </h3>
          <div className="w-full max-w-2xl mx-auto border-b border-stone-300 dark:border-yellow-400/60 mt-6 mb-4" />
          <p className="text-sm sm:text-base opacity-80 font-medium">
            보호대상자의 눈높이에 맞춘 4대 독보적 특장점 • 누구나 차별 없이 존중받는 공공 서비스
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Feature Card 1 */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 shadow-lg shadow-slate-100'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                highContrast ? 'bg-black text-yellow-300' : 'bg-blue-50 text-[#3B82F6]'
              }`}
            >
              <Eye className="w-7 h-7" />
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-yellow-300">
              배려형 접근성
            </span>
            <h4 className="text-xl sm:text-2xl font-black mt-3 mb-3">
              돋보기 필요 없는 큰 글씨와 선명한 고대비
            </h4>
            <p className="text-sm sm:text-base opacity-80 leading-relaxed mb-5 font-medium">
              시력이 약한 어르신과 시각약자를 위해 <strong>[글자 보통] / [글자 크게]</strong> 2단계 폰트 조절 버튼과
              눈부심 없는 <strong>흑황(Black & Yellow) 고대비 모드</strong>를 상시 지원합니다. 모든 텍스트는 음성(TTS)으로 실시간 낭독됩니다.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold opacity-75">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>WCAG 2.1 AA 웹 접근성 표준 준수 및 직관적 터치 타깃</span>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 shadow-lg shadow-slate-100'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                highContrast ? 'bg-black text-yellow-300' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Building2 className="w-7 h-7" />
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-zinc-800 text-emerald-700 dark:text-yellow-300">
              원스톱 복지 솔루션
            </span>
            <h4 className="text-xl sm:text-2xl font-black mt-3 mb-3">
              원하는 지원 사업과 구비 서류 10초 검색
            </h4>
            <p className="text-sm sm:text-base opacity-80 leading-relaxed mb-5 font-medium">
              <strong>주거지원(LH 임대주택), 취업지원(훈련수당), 긴급구호(생계비 50만원), 심리상담</strong> 등
              공단의 핵심 4대 사업 내용과 꼭 챙겨와야 할 서류 목록을 터치 한 번으로 명쾌하게 안내합니다.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold opacity-75">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>헛걸음 없는 완벽한 사전 서류 체크리스트 제공</span>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 shadow-lg shadow-slate-100'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                highContrast ? 'bg-black text-yellow-300' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <Clock className="w-7 h-7" />
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 dark:bg-zinc-800 text-amber-700 dark:text-yellow-300">
              365일 24시간 세이프티넷
            </span>
            <h4 className="text-xl sm:text-2xl font-black mt-3 mb-3">
              운영시간 자동 감지 & 야간·휴일 안심 긴급콜
            </h4>
            <p className="text-sm sm:text-base opacity-80 leading-relaxed mb-5 font-medium">
              실제 공단 운영시간(평일 09:00~18:00)에는 <strong>담당 직원 콜벨</strong>을 즉시 호출하며,
              야간과 휴일에는 <strong>당직실 비상연결</strong> 및 국가 위기상담전화 <strong>109</strong>(자살예방)와
              <strong>1577-0199</strong>로 지체 없이 연결합니다.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold opacity-75">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>비상시 화면 하단 위기지원 핫라인 배너 상시 유지</span>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 shadow-lg shadow-slate-100'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                highContrast ? 'bg-black text-yellow-300' : 'bg-purple-50 text-purple-600'
              }`}
            >
              <BarChart3 className="w-7 h-7" />
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-purple-100 dark:bg-zinc-800 text-purple-700 dark:text-yellow-300">
              스마트 일정 & 이력 관리
            </span>
            <h4 className="text-xl sm:text-2xl font-black mt-3 mb-3">
              시각화 대시보드와 손쉬운 상담 예약 변경·취소
            </h4>
            <p className="text-sm sm:text-base opacity-80 leading-relaxed mb-5 font-medium">
              나의 지난 서비스 방문 이력을 <strong>월별 추이 막대 차트</strong>와 <strong>서비스별 도넛 차트</strong>로
              투명하게 시각화하여 자립 진행 상황을 확인하고, 예정된 상담 일정을 3번의 터치로 손쉽게 변경·취소할 수 있습니다.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold opacity-75">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Recharts 기반 반응형 통계 리포트 내장</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 인터랙티브 지원 사업 체험 섹션 (Interactive Showcase) */}
      <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-y border-stone-200 dark:border-zinc-800 bg-[#FAF9F5] dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-full max-w-2xl mx-auto border-t border-stone-300 dark:border-yellow-400/60 mb-6" />
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-900 dark:text-yellow-300">
              #03. Services & Benefits
            </h3>
            <div className="w-full max-w-2xl mx-auto border-b border-stone-300 dark:border-yellow-400/60 mt-6 mb-4" />
            <p className="text-sm sm:text-base opacity-80 font-medium">
              원하시는 분야 탭을 누르면 지원 자격, 혜택, 필요 서류를 즉시 확인하실 수 있습니다.
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {(['housing', 'job', 'emergency', 'counsel'] as const).map((key) => {
              const item = interactiveServices[key];
              const isActive = activeInteractiveTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveInteractiveTab(key)}
                  className={`px-5 py-3 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-[#3B82F6] text-white shadow-blue-200'
                      : highContrast
                      ? 'bg-zinc-900 border border-yellow-400/40 text-yellow-300 hover:bg-zinc-800'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.title.split('&')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Tab Content Box */}
          <div
            className={`p-6 sm:p-10 rounded-3xl border-2 transition-all ${
              highContrast
                ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-black px-2.5 py-1 rounded bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-yellow-300">
                  {interactiveServices[activeInteractiveTab].badge}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black mt-2">
                  {interactiveServices[activeInteractiveTab].title}
                </h4>
              </div>
              <button
                onClick={onStartKiosk}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
                  highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-[#3B82F6] text-white hover:bg-blue-600'
                }`}
              >
                <span>이 서비스로 상담 예약하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
              <div>
                <h5 className="text-sm font-bold opacity-75 mb-2">사업 소개 및 핵심 혜택</h5>
                <p className="text-base font-semibold leading-relaxed mb-4">
                  {interactiveServices[activeInteractiveTab].description}
                </p>
                <div
                  className={`p-4 rounded-2xl border ${
                    highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <p className="text-xs font-bold uppercase opacity-75">주요 지원 내용</p>
                  <p className="text-sm sm:text-base font-black mt-1">
                    {interactiveServices[activeInteractiveTab].benefit}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold opacity-75 mb-2">방문 시 필수 구비 서류</h5>
                <div className="space-y-2">
                  {interactiveServices[activeInteractiveTab].docs.map((doc, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl flex items-center gap-3 border ${
                        highContrast
                          ? 'bg-black border-zinc-800 text-yellow-300'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-[#3B82F6] dark:text-yellow-400 shrink-0" />
                      <span className="text-sm font-bold">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 시각화 대시보드 미리보기 (Dashboard Feature Callout) */}
      <section id="dashboard-preview" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-full max-w-2xl mx-auto border-t border-stone-300 dark:border-yellow-400/60 mb-6" />
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-900 dark:text-yellow-300">
            #04. Visual Analytics
          </h3>
          <div className="w-full max-w-2xl mx-auto border-b border-stone-300 dark:border-yellow-400/60 mt-6 mb-4" />
          <p className="text-sm sm:text-base opacity-80 font-medium">
            내 방문 이력과 자립 지원 통계를 한눈에 투명하게 확인하는 스마트 리포트
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-left">
            <h4 className="text-2xl sm:text-4xl font-black mb-5 tracking-tight leading-snug">
              어떤 상담을 받고 완료했는지,
              <br />
              <span className="text-[#5D8B37] dark:text-yellow-400">투명하게 직관적으로</span> 관리하세요
            </h4>
            <p className="text-base opacity-85 leading-relaxed mb-6 font-medium">
              내가 어떤 상담을 받았고, 어떤 지원을 완료했는지 이제 헷갈리지 마세요.
              새롭게 추가된 <strong>방문 이력 대시보드</strong>는 월별 방문 횟수, 서비스 분야별 이용 비중, 그리고 다음 예정 일정을
              직관적인 차트로 시각화하여 제공합니다.
            </p>

            <ul className="space-y-3 mb-8 text-sm sm:text-base font-bold">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>최근 6개월간의 월별 방문 및 지원 건수 바 차트</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>주거·취업·긴급·심리 분야별 이용 비중 도넛 차트</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>상세 처리 결과(상담완료, 지원금 지급 등) 및 담당 직원 확인</span>
              </li>
            </ul>

            <button
              onClick={onStartKiosk}
              className={`px-7 py-4 rounded-2xl font-black text-base flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200'
              }`}
            >
              <span>[대시보드 직접 확인하러 가기]</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Visual Mockup Card */}
          <div className="lg:w-1/2 w-full">
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all ${
                highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                  : 'bg-white border-slate-200 shadow-blue-100'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#3B82F6] dark:text-yellow-400" />
                  <span className="font-black text-sm sm:text-base">나의 공단 방문 이력 대시보드</span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-zinc-800 text-emerald-700 dark:text-yellow-300">
                  지원 완료율 100%
                </span>
              </div>

              {/* Mock Mini Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800">
                  <span className="text-xs opacity-75 font-semibold">누적 방문 횟수</span>
                  <p className="text-2xl font-black mt-1">7회</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800">
                  <span className="text-xs opacity-75 font-semibold">주요 이용 분야</span>
                  <p className="text-xl font-black mt-1">주거지원 (3회)</p>
                </div>
              </div>

              {/* Mock Bar Visual */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 mb-4">
                <div className="flex justify-between items-center text-xs font-bold opacity-75 mb-3">
                  <span>월별 방문 추이</span>
                  <span>(4월 ~ 9월)</span>
                </div>
                <div className="h-28 flex items-end justify-between gap-2 pt-2 px-2">
                  {[
                    { m: '4월', h: '40%', val: '1건' },
                    { m: '5월', h: '80%', val: '2건' },
                    { m: '6월', h: '40%', val: '1건' },
                    { m: '7월', h: '40%', val: '1건' },
                    { m: '8월', h: '40%', val: '1건' },
                    { m: '9월', h: '40%', val: '예정' }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold opacity-75">{bar.val}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          i === 5
                            ? 'border-2 border-dashed border-[#3B82F6] dark:border-yellow-400 bg-transparent'
                            : highContrast
                            ? 'bg-yellow-400'
                            : 'bg-[#3B82F6]'
                        }`}
                        style={{ height: bar.h }}
                      />
                      <span className="text-xs font-bold opacity-80">{bar.m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-zinc-800 border border-blue-200 dark:border-yellow-400/40 text-xs font-bold flex items-center justify-between">
                <span>다음 예약: 09월 08일 (화) 14:00 (주거지원)</span>
                <span className="text-[#3B82F6] dark:text-yellow-300">김보호 주임</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 자주 묻는 질문 (FAQ Accordion) */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-stone-200 dark:border-zinc-800">
        <div className="text-center mb-16">
          <div className="w-full max-w-2xl mx-auto border-t border-stone-300 dark:border-yellow-400/60 mb-6" />
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-900 dark:text-yellow-300">
            #05. Frequently Asked
          </h3>
          <div className="w-full max-w-2xl mx-auto border-b border-stone-300 dark:border-yellow-400/60 mt-6 mb-4" />
          <p className="text-sm sm:text-base opacity-80 font-medium">
            궁금하신 사항을 명쾌하고 알기 쉽게 안내해 드립니다.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border-2 transition-all ${
                  highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-black text-base sm:text-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#3B82F6] dark:text-yellow-400 font-black">Q.</span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#3B82F6] dark:text-yellow-400' : 'opacity-60'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100 dark:border-zinc-800 text-sm sm:text-base opacity-85 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. 위기 핫라인 & 공식 연락처 배너 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white dark:bg-zinc-950 dark:border-t dark:border-yellow-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PhoneCall className="w-5 h-5 text-yellow-400" />
              <span className="font-black text-lg sm:text-xl">긴급 위기상담 및 대표 안내 전화</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              도움이 절실할 때 언제든 망설이지 말고 전화를 걸어주세요. 24시간 열려 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-center">
              <span className="text-[11px] text-yellow-400 font-bold block">공단 대표번호</span>
              <strong className="text-base font-black">{OFFICIAL_CONTACTS.mainPhone}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-center">
              <span className="text-[11px] text-red-400 font-bold block">자살예방 핫라인</span>
              <strong className="text-base font-black">{OFFICIAL_CONTACTS.crisisHotline109}</strong>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-center">
              <span className="text-[11px] text-blue-400 font-bold block">정신건강 상담</span>
              <strong className="text-base font-black">{OFFICIAL_CONTACTS.crisisHotline1577}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Banner (어그로 마무리 전환 섹션) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-transparent to-blue-50/50 dark:to-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            새로운 시작, 지금 바로 함께하세요
          </h3>
          <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto mb-10 font-medium">
            한국법무보호복지공단 디지털 보호안내원이 여러분의 자립과 새로운 삶을 언제나 정성을 다해 응원합니다.
          </p>

          <button
            id="footer-btn-launch-kiosk"
            onClick={onStartKiosk}
            className={`px-10 py-5 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl shadow-2xl active:scale-95 transition-all cursor-pointer inline-flex items-center gap-3 ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300'
                : 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-300/60'
            }`}
          >
            <Sparkles className="w-7 h-7" />
            <span>[디지털 무인안내기 지금 시작하기]</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </section>

      {/* 9. Official Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-zinc-800 text-xs text-center opacity-70 font-medium">
        <p>© 2026 {OFFICIAL_AGENCY_NAME}. All Rights Reserved.</p>
        <p className="mt-1">
          본 디지털 무인안내 시스템은 공단 방문 대상자의 자립 지원 및 신속한 행정 안내를 위해 제작되었습니다.
        </p>
      </footer>
    </div>
  );
};
