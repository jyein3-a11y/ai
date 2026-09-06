import React, { useState } from 'react';
import { Star, Plus, CheckCircle, Sparkles, Home, Briefcase, HeartHandshake, Smile, Lock } from 'lucide-react';

interface EditorialLookbookReviewsProps {
  highContrast: boolean;
  onSelectService: (serviceKey: 'housing' | 'job' | 'emergency' | 'counsel') => void;
  onStartKiosk: () => void;
  isKeyVerified?: boolean;
}

interface ReviewItem {
  id: string;
  num: string;
  categoryEn: string;
  title: string;
  subtitle: string;
  rating: string;
  badgeCount: string;
  author: string;
  reviewText: string;
  imageUrl: string;
  serviceKey: 'housing' | 'job' | 'emergency' | 'counsel';
  accentColor: string;
}

export const EditorialLookbookReviews: React.FC<EditorialLookbookReviewsProps> = ({
  highContrast,
  onSelectService,
  onStartKiosk,
  isKeyVerified = false,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const reviews: ReviewItem[] = [
    {
      id: 'review-01',
      num: '01',
      categoryEn: 'HOUSING & RESETTLEMENT',
      title: 'LH 공공임대 주거지원',
      subtitle: '임대보증금 전액 무이자 지원 및 안정적 보금자리',
      rating: '4.9 / 5.0',
      badgeCount: '총 1,240건 지원',
      author: 'JIWO***님의 자립 후기',
      reviewText:
        '출소 당일 주거가 막막해 불안했는데, 공단 보호안내원에서 30초 만에 지원 자격을 확인했습니다. 임대보증금을 전액 무이자 지원받아 따뜻한 방을 얻었고, 이제는 두 발 뻗고 내일을 준비하고 있습니다.',
      imageUrl:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      serviceKey: 'housing',
      accentColor: '#5D8B37',
    },
    {
      id: 'review-02',
      num: '02',
      categoryEn: 'VOCATIONAL TRAINING & JOBS',
      title: '취업성공패키지 & 훈련수당',
      subtitle: '1:1 맞춤 직종 발굴 및 월 최대 28.4만원 수당',
      rating: '4.9 / 5.0',
      badgeCount: '총 860명 취업',
      author: 'HEHE***님의 취업 성공기',
      reviewText:
        '나이가 많고 공백기가 길어 막막했지만, 전담 취업상담사님과 함께 지게차 자격증을 취득했습니다. 훈련수당 덕에 생활비 걱정 없이 자격증을 따고 당당하게 정규직으로 입사했습니다.',
      imageUrl:
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
      serviceKey: 'job',
      accentColor: '#3B82F6',
    },
    {
      id: 'review-03',
      num: '03',
      categoryEn: 'EMERGENCY CASH & AID',
      title: '위기 긴급 생계비 즉시 지원',
      subtitle: '갑작스러운 위기 시 생계비 50만원 & 생필품 키트',
      rating: '4.8 / 5.0',
      badgeCount: '총 514가구 구호',
      author: 'QKRD***님의 긴급구호 후기',
      reviewText:
        '갑작스러운 질병과 생활고로 당장 끼니를 걱정하던 때, 당일 긴급 생계비 50만원과 쌀, 라면 키트를 전달받았습니다. 포기하고 싶었던 순간 절망 속에서 붙잡아준 구원의 손길이었습니다.',
      imageUrl:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      serviceKey: 'emergency',
      accentColor: '#EA580C',
    },
    {
      id: 'review-04',
      num: '04',
      categoryEn: 'PSYCHOTHERAPY & FAMILY',
      title: '가족희망 심리상담 & 멘토링',
      subtitle: '사회적응 스트레스 완화 및 가족관계 회복',
      rating: '5.0 / 5.0',
      badgeCount: '만족도 99%',
      author: 'XHAK***님의 마음회복 수기',
      reviewText:
        '가족과의 오랜 단절로 인해 마음의 문을 닫고 살았는데, 전문 심리상담사님의 따뜻한 경청과 가족 화해 프로그램을 통해 10년 만에 아이들의 손을 다시 잡을 수 있었습니다.',
      imageUrl:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      serviceKey: 'counsel',
      accentColor: '#9333EA',
    },
  ];

  return (
    <section
      id="self-reliance-lookbook"
      className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 transition-all border-b ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400'
          : 'bg-[#FAF9F5] text-slate-800 border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header: #01. SELF-RELIANCE STORIES */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="w-full max-w-3xl mx-auto border-t border-stone-300 dark:border-yellow-400/60 mb-6" />

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-slate-900 dark:text-yellow-300">
            #01. Self-Reliance Stories
          </h3>

          <div className="w-full max-w-3xl mx-auto border-b border-stone-300 dark:border-yellow-400/60 mt-6 mb-4" />

          <p className="text-sm sm:text-base font-medium opacity-80 max-w-xl mx-auto tracking-normal">
            매일 새로운 용기로, 실제 공단 지원을 통해 다시 일어선 분들의 진솔한 자립 동행 후기
          </p>
        </div>

        {/* Lookbook Magazine 2x2 Grid (01, 02, 03, 04) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-16 lg:gap-y-20">
          {reviews.map((item) => (
            <div
              key={item.id}
              className={`group relative flex flex-col transition-all duration-300 ${
                highContrast
                  ? 'border-b border-yellow-400/40 pb-8'
                  : 'border-b border-stone-200 pb-10'
              }`}
            >
              {/* Top Title & Rating Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider opacity-60 uppercase block mb-1">
                    {item.categoryEn}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm font-medium opacity-75 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono ml-1">{item.rating}</span>
                </div>
              </div>

              {/* Middle Section: Image with Circle Badge + Large Serif Number + Review Text */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-start">
                {/* Image Column with Round Badge & Serif Number */}
                <div className="sm:col-span-6 relative">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-stone-200 dark:bg-zinc-800 shadow-md">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Circular Dark Badge Overlay (Top Left of image) */}
                    <div
                      className={`absolute top-3 left-3 w-14 h-14 rounded-full flex flex-col items-center justify-center text-center p-1 shadow-lg transition-transform group-hover:scale-110 ${
                        highContrast
                          ? 'bg-yellow-400 text-black font-black'
                          : 'bg-black/90 backdrop-blur-xs text-white'
                      }`}
                    >
                      <span className="text-[9px] font-bold leading-none opacity-80">누적</span>
                      <span className="text-[10px] font-black leading-tight mt-0.5">
                        {item.badgeCount}
                      </span>
                    </div>

                    {/* Bottom Right Expand Button (+) */}
                    <button
                      onClick={() => onSelectService(item.serviceKey)}
                      aria-label={`${item.title} 상세 보기`}
                      className={`absolute bottom-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-90 ${
                        highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                          : 'bg-black/80 hover:bg-black text-white'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Elegant Large Numeral (01, 02, 03, 04) in Pretendard */}
                  <div className="mt-2 flex items-baseline justify-between">
                    <span
                      className={`text-5xl sm:text-6xl font-black tracking-tighter select-none leading-none ${
                        highContrast
                          ? 'text-yellow-400/80'
                          : 'text-stone-900 group-hover:text-[#5D8B37] transition-colors'
                      }`}
                    >
                      {item.num}
                    </span>
                    <button
                      onClick={() => onSelectService(item.serviceKey)}
                      className="text-xs font-bold underline underline-offset-4 hover:opacity-100 opacity-60 cursor-pointer"
                    >
                      상세 혜택 및 신청 서류 &rarr;
                    </button>
                  </div>
                </div>

                {/* Review Text Column (Editorial Lookbook Style) */}
                <div className="sm:col-span-6 flex flex-col justify-between h-full pt-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-md bg-stone-200/80 dark:bg-zinc-800 text-stone-700 dark:text-yellow-300">
                        {item.author}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>공단 인증 후기</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-85 whitespace-pre-line text-stone-700 dark:text-yellow-200">
                      &ldquo;{item.reviewText}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] font-medium opacity-60">
                      실제 키오스크 간편 신청 가능
                    </span>
                    <button
                      onClick={onStartKiosk}
                      className={`text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                        highContrast
                          ? 'bg-yellow-400 text-black'
                          : isKeyVerified
                          ? 'bg-[#5D8B37] hover:bg-[#4E762E] text-white shadow-xs'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      }`}
                    >
                      {isKeyVerified ? (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>신청하기</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>승인 필요</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lookbook Bottom Quote & CTA Banner */}
        <div
          className={`mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl sm:rounded-tl-[48px] sm:rounded-br-[48px] border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${
            highContrast
              ? 'bg-zinc-900 border-yellow-400 text-yellow-300'
              : 'bg-white border-stone-200 shadow-xl shadow-stone-200/40'
          }`}
        >
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#5D8B37] dark:text-yellow-400 block mb-1">
              Hope & Reconnection
            </span>
            <h4 className="text-xl sm:text-2xl font-black">
              &ldquo;당신의 지난 시간보다, 앞으로 걸어갈 내일이 훨씬 더 소중합니다.&rdquo;
            </h4>
            <p className="text-xs sm:text-sm font-medium opacity-80 mt-2">
              한국법무보호복지공단 디지털 보호안내원은 주거, 취업, 긴급지원, 심리상담까지
              누구나 차별 없이 존중받으며 자립할 수 있도록 든든하게 곁을 지킵니다.
            </p>
          </div>

          <button
            onClick={onStartKiosk}
            className={`px-7 py-4 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shrink-0 shadow-lg active:scale-95 transition-all cursor-pointer ${
              highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : isKeyVerified
                ? 'bg-[#5D8B37] hover:bg-[#4E762E] text-white shadow-green-900/10'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/10'
            }`}
          >
            {isKeyVerified ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>[무인안내기 키오스크 체험]</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>[🔒 API Key 승인 후 체험하기]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
