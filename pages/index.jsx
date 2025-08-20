// pages/index.jsx
import { useEffect, useRef, useId, useState } from "react";
import Head from "next/head";
import HeaderNav from "../components/HeaderNav";
import Link from "next/link";

/* ─────────────────────────────────────────
   플레이스홀더 이미지 (원하면 URL 교체)
────────────────────────────────────────── */
const PLACEHOLDER = {
  safe: ["/images/indexmi.png", "/images/banner01.png", "/images/liine.jpg"],
  apply: ["/images/banner02.webp", "/images/liine22.png", "/images/liine33.png"],
};

/* ─────────────────────────────────────────
   인서트 배너 — 두 번째 이미지만 유지(요청: 1번째는 버튼으로 대체)
────────────────────────────────────────── */
const INSERT_BANNERS = [
  {
    src: "/images/bbgg1.png",
    alt: "꼼꼼한 케어 프로그램",
    title: "꼼꼼한 케어 프로그램",
    subtitle: "오랜 장롱면허 · 주차가 어려운 분 · 직장인을 위한 맞춤 케어",
  },
];

/* ─────────────────────────────────────────
   카피팩
────────────────────────────────────────── */
const COPY = {
  reviews: {
    title: "운전연수 후기",
    badge: "실시간 업데이트",
    icon: "⭐",
    headline: "타요드라이브 회원들의 생생한 운전연수 후기",
    subcopy: "수많은 후기와 별점으로 검증된 1:1 맞춤 방문연수",
    ctaHref: "/reviews",
    ctaLabel: "후기 전체 보기",
  },
  programs: {
    title: "타요드라이브 안전서비스",
    badge: "케어 프로그램",
    icon: "🛡️",
    headline: "안전운전 길잡이, 타요드라이브의 꼼꼼한 케어 프로그램",
    subcopy:
      "생활 맞춤형 커리큘럼으로 단계별 멘토링 · 주행·주차·차선변경까지. 학원차량 안전장치 장착으로 더 안전하게.",
    bullets: ["단계별 멘토링", "도심·고속도로 실전", "주차·차선변경 완전정복"],
    ctaHref: "/programs",
    ctaLabel: "안전서비스 보기",
  },
  apply: {
    title: "온라인 연수신청",
    badge: "상담 10분 내",
    icon: "📝",
    headline: "온라인 연수 신청서",
    subcopy: "간단 신청 후 10분 내 상담원이 전화 드립니다.",
    bullets: ["희망 일정·지역 맞춤 배정", "연수 중 사고 100% 학원 처리", "추가비용 없음(유료주차/톨비 제외)"],
    ctaHref: "/apply",
    ctaLabel: "지금 신청하기",
  },
};

export default function Home({ settings, reviews }) {
  const { kakaoChannelUrl, metaTitle, metaDescription } = settings || {};

  /* ── [기존 유지] 히어로 롤링 ───────────────────────── */
  const imgs = ["/images/rol1.png", "/images/rol2.png"];
  const imgRefs = [useRef(null), useRef(null)];
  let cur = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!imgRefs[0].current || !imgRefs[1].current) return;
      imgRefs[cur.current].current.style.opacity = 0;
      imgRefs[cur.current].current.style.zIndex = 0;
      cur.current = (cur.current + 1) % imgs.length;
      imgRefs[cur.current].current.style.opacity = 1;
      imgRefs[cur.current].current.style.zIndex = 1;
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  /* ─────────────────────────────────────────────── */

  /* ── 플로팅 버튼: 푸터 접근 시 자동 숨김 (유지) ───────────── */
  const [hideFloat, setHideFloat] = useState(false);
  useEffect(() => {
    const OFFSET = 160;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const footer = document.querySelector("footer");
        if (!footer) {
          setHideFloat(false);
          ticking = false;
          return;
        }
        const { top } = footer.getBoundingClientRect();
        const nearFooter = top - window.innerHeight < OFFSET;
        setHideFloat(nearFooter);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  /* ───────────────────────────────────────────────────── */

  return (
    <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <Head>
        <title>{metaTitle || "타요 드라이브 | 방문 운전연수"}</title>
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
      </Head>

      <HeaderNav />

      {/* HERO (유지, 사이즈만 확대) */}
      <section className="relative flex items-center justify-center min-h-[70vh] px-4 pt-28 pb-10">
        <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg p-0 md:p-0 border border-blue-100 overflow-hidden">
          <div className="relative h-[360px] sm:h-[420px] md:h-[520px] lg:h-[600px] w-full">
            {imgs.map((src, i) => (
              <img
                key={i}
                ref={imgRefs[i]}
                src={src}
                alt={i === 0 ? "타요드라이브 강사진 안내" : "운전상담 안내"}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  zIndex: i === 0 ? 1 : 0,
                  transition: "opacity 0.8s",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-8 md:p-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-snug text-gray-900 mb-4 text-center md:text-left">
              <span className="block text-blue-600">만족도 1위</span>
              장롱면허·완전초보라면
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">'타요드라이브'</span>
              에서 시작
            </h1>
            <p className="mt-2 mb-6 text-base sm:text-lg text-gray-800 text-center md:text-left">
              1:1 방문 운전연수, 전국 어디든 가능!
              <br />
              우수 강사진, 저렴한 비용, 최고의 만족도.
              <br />
              <span className="font-semibold text-blue-700">무료 상담전화 1666-8512</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-2">
              <a
                href="tel:16668512"
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-semibold shadow-md text-base transition hover:from-cyan-300 hover:to-blue-400"
                aria-label="무료 상담전화 연결"
              >
                무료 상담 1666-8512
              </a>
              <a href="#quick" className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full font-semibold transition hover:bg-gray-200">
                상담신청 클릭
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 0 → 0 → 0 (세로 스택) */}
      <section id="quick" className="max-w-6xl mx-auto w-full px-4 mt-2 space-y-6" style={{ scrollMarginTop: "96px" }}>
        {/* 후기 */}
        <ReviewsShowcase reviews={reviews} copy={COPY.reviews} />

        {/* NEW: 안전 서비스 CTA 버튼 (칩 3+2 배치 / 회전 제거) */}
        <SafetyServiceCTA />

        {/* 두 번째 배너(이미지) */}
        <MidBanners items={INSERT_BANNERS} />

        {/* 안전서비스 카드 */}
        <FeatureCard images={PLACEHOLDER.safe} copy={COPY.programs} tone="blue" />

        {/* 온라인 연수신청 카드 */}
        <FeatureCard images={PLACEHOLDER.apply} copy={COPY.apply} tone="cyan" />
      </section>

      {/* 강사진 (유지) */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-blue-700">믿을 수 있는 타요드라이브 우수강사진과 함께</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TeacherCard src="https://i.ibb.co/TxwK7rpj/teacher01-a674a38c.png" alt="김범수 강사님" name="김범수 강사님" />
          <TeacherCard src="https://i.ibb.co/7xmTTnF7/teacher02-e52b1cc5.png" alt="박은정 강사님" name="박은정 강사님" />
          <TeacherCard src="https://i.ibb.co/Kj0fX4TB/teacher03-d3bbb360.png" alt="오정혜 강사님" name="오정혜 강사님" />
          <TeacherCard src="https://i.ibb.co/M5RygfFx/teacher04-9db9f003.png" alt="박준호 강사님" name="박준호 강사님" />
        </div>
      </section>

      {/* CTA (홈 전용 — 미니 폼 + 이미지 카드) */}
      <HomeCTA />

      {/* 플로팅 (유지) */}
      <div
        className={`fixed right-4 bottom-6 z-50 flex flex-col items-center space-y-3 transition-all duration-300 ${
          hideFloat ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100"
        }`}
      >
        <img
          src="/images/side_banner.webp"
          alt="24시간 무료상담 1666-8512"
          className="w-36 md:w-40 rounded-xl shadow-lg border border-blue-200 bg-white/90"
        />
        <a href={kakaoChannelUrl || "https://pf.kakao.com/_hGxgkxj"} className="block mt-1" target="_blank" rel="noopener noreferrer">
          <img
            src="/images/제목_없는_디자인__1_-removebg-preview.png"
            alt="카카오톡 상담하기"
            className="w-24 md:w-28 rounded-full shadow-lg border border-yellow-300 bg-white/95"
          />
        </a>
      </div>

      {/* 푸터 (유지) */}
      <footer className="mt-14 bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100">
        <img src="https://i.ibb.co/jkqYSLMq/logo-footer.webp" alt="타요드라이브 푸터 로고" className="mx-auto h-10 mb-2" />
        <div className="mb-1 font-semibold">
          타요드라이브 | 대표번호 <span className="text-cyan-300">1666-8512</span>
        </div>
        <div className="mb-1">COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED</div>
        <div className="font-bold text-cyan-200">24시간 무료상담 1666-8512</div>
      </footer>

      {/* 전역 스타일 (기존 + 변경) */}
      <style jsx global>{`
        /* 세로 롤링 */
        .tickerY {
          position: relative;
          mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
        }
        .tickerY .track {
          display: flex;
          flex-direction: column;
          animation: rollY var(--dur, 20s) linear infinite;
          will-change: transform;
        }
        .tickerY:hover .track {
          animation-play-state: paused;
        }
        @keyframes rollY {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }

        /* Pill shine (부드러운 광택) */
        .pill-shine {
          position: absolute;
          inset: -1px;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.55), transparent);
          transform: translateX(-130%);
          animation: pillShine 3.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        @keyframes pillShine {
          0% {
            transform: translateX(-130%);
          }
          55%,
          100% {
            transform: translateX(130%);
          }
        }

        /* Safety CTA border — 회전 제거(정지 상태) */
        .safety-cta-border {
          background: conic-gradient(from 180deg at 50% 50%, #06b6d4, #3b82f6, #06b6d4);
          filter: saturate(1.05);
        }

        .btn-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.5) 30%, transparent 62%);
          transform: translateX(-130%);
          pointer-events: none;
          animation: shine 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        @keyframes shine {
          0% {
            transform: translateX(-130%);
          }
          55%,
          100% {
            transform: translateX(130%);
          }
        }
      `}</style>
    </main>
  );
}

/* ───────── 유틸: 리뷰 배열 → 롤링 Pill 텍스트 (빌드 에러 해결) ───────── */
function reviewsToPills(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return [
      "★★★★★ 상담친절, 자신감 회복! · 익명",
      "★★★★★ 장롱면허 탈출 성공 · mile955",
      "★★★★★ 주차부터 차선변경까지 꼼꼼 · 홍**",
      "★★★★★ 여성 강사님 편하고 좋아요 · 김**",
    ];
  }
  return reviews.map((r) => {
    const rating = Math.max(1, Math.min(5, Number(r?.rating) || 5));
    const stars = "★★★★★".slice(0, rating);
    const title = (r?.title || "타요드라이브 연수 후기").toString();
    const author = r?.author || "익명";
    return `${stars} ${title} · ${author}`;
  });
}

/* ⬇️ 기존 컴포넌트들: 변경 없음 */
function SafetyServiceCTA() {
  const chips = [
    { icon: "🎯", text: "1:1 맞춤교육" },
    { icon: "🏃", text: "직장인 커리큘럼" },
    { icon: "👩‍🏫", text: "여성 전담반" },
    { icon: "🛡️", text: "전차종 종합보험" },
    { icon: "✅", text: "불친절 시 100% 환불보장" },
  ];

  const chipBase =
    "w-full flex items-center gap-3 rounded-full bg-white text-sky-900 px-7 py-4 md:px-8 md:py-5 text-[15px] md:text-[16px] ring-1 ring-[#CFE9FF] shadow-sm transition-all duration-200 hover:bg-[#F2FAFF] hover:shadow-md hover:ring-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";

  const chipIcon =
    "inline-flex items-center justify-center rounded-full h-9 w-9 md:h-10 md:w-10 text-[14px] md:text-[16px] bg-gradient-to-r from-sky-600 to-cyan-500 text-white ring-1 ring-white/60 shadow";

  return (
    <Link href="/about" className="block group" aria-label="회사 소개(안전 서비스) 페이지로 이동">
      <article className="relative rounded-[28px] p-[1.5px] safety-cta-border shadow-[0_20px_70px_rgba(2,132,199,.18)]">
        <div className="relative overflow-hidden rounded-[26px] ring-1 ring-[#CFE9FF] bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F6FF]">
          <div className="pointer-events-none absolute -top-12 -left-10 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-10 h-56 w-56 rounded-full bg-sky-400/25 blur-3xl" />

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-14">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="text-[13px] font-bold text-sky-700">타요드라이브 안전 서비스</div>
                <h3 className="mt-1 text-[22px] md:text-[30px] font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-sky-800 via-sky-700 to-cyan-700 bg-clip-text text-transparent">
                    타요드라이브에서 진행하는&nbsp;안전 서비스
                  </span>
                </h3>
                <p className="mt-1 text-[13px] md:text-[14px] text-slate-600">학원 차량 안전장치 · 커리큘럼 · 보험 · 환불보장까지, 한눈에 확인하세요.</p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-3.5 text-white font-extrabold shadow-[0_14px_44px_rgba(2,132,199,.25)] ring-1 ring-white/50 transition-transform duration-200 group-hover:scale-[1.04]">
                  회사 소개에서 더 보기
                  <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {chips.map((c, i) => {
                const layout =
                  i === 0
                    ? "lg:col-span-2 lg:col-start-1 lg:row-start-1"
                    : i === 1
                    ? "lg:col-span-2 lg:col-start-3 lg:row-start-1"
                    : i === 2
                    ? "lg:col-span-2 lg:col-start-5 lg:row-start-1"
                    : i === 3
                    ? "lg:col-span-2 lg:col-start-2 lg:row-start-2"
                    : "lg:col-span-2 lg:col-start-4 lg:row-start-2";

                return (
                  <li key={i} className={layout}>
                    <div className={chipBase}>
                      <span className={chipIcon}>{c.icon}</span>
                      <span>{c.text}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <span className="btn-shine" />
        </div>
      </article>
    </Link>
  );
}

function MidBanners({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="space-y-6">
      {items.map((b, i) => (
        <article key={i} className="rounded-2xl border border-blue-100 bg-white shadow-[0_14px_44px_rgba(2,132,199,.08)] overflow-hidden">
          <header className="px-4 pt-4">
            <div className="text-[13px] font-bold text-cyan-700">{b.title}</div>
            <h3 className="text-[18px] sm:text-[20px] font-extrabold text-blue-900 -mt-0.5">{b.subtitle}</h3>
          </header>
          <div className="p-4">
            <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-blue-100 bg-white">
              <img src={b.src} alt={b.alt} className="w-full h-auto object-cover" style={{ display: "block" }} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function ReviewsShowcase({ reviews = [], copy }) {
  const pills = reviewsToPills(reviews);
  return (
    <article className="rounded-2xl border border-blue-100 bg-white shadow-[0_14px_44px_rgba(2,132,199,.08)] overflow-hidden">
      <header className="flex items-center gap-2 p-4">
        <span className="text-xl">{copy.icon}</span>
        <h3 className="text-[17px] sm:text-[18px] font-extrabold text-blue-900">{copy.title}</h3>
        <span className="ml-auto rounded-full bg-blue-50 text-blue-700 text-[11px] px-2 py-[2px] font-bold ring-1 ring-blue-100">{copy.badge}</span>
      </header>

      <div className="px-4 -mt-1">
        <div className="text-[15px] font-extrabold text-slate-900">{copy.headline}</div>
        <p className="text-[13px] md:text-[14px] text-slate-600 mt-1">{copy.subcopy}</p>
      </div>

      <div className="px-4 py-4">
        <div className="tickerY h-[220px] md:h-[260px] rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50">
          <div className="track">
            {[...pills, ...pills].map((txt, i) => (
              <Pill key={`pill-${i}`} text={txt} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Link
          href={copy.ctaHref}
          className="block h-11 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold ring-1 ring-white/50 hover:from-cyan-400 hover:to-blue-500 grid place-items-center active:scale-[.99]"
          aria-label={`${copy.title} 페이지로 이동`}
        >
          {copy.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function Pill({ text }) {
  const match = String(text).match(/★{1,5}/);
  const rating = match ? match[0].length : 5;
  const body = String(text).replace(/★{1,5}\s*/, "");
  const uid = useId();

  return (
    <div className="h-[56px] flex items-center px-1">
      <div className="group relative w-full">
        <div className="absolute -inset-[1.2px] rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none bg-[conic-gradient(var(--tw-gradient-stops))] from-cyan-400 via-blue-600 to-cyan-400" />
        <div className="relative rounded-full bg-white/55 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_6px_24px_rgba(2,6,23,.08),inset_0_1px_0_rgba(255,255,255,.6)] px-4 py-2.5 flex items-center gap-3 overflow-hidden transition-transform duration-300 group-hover:-translate-y-[1px] group-active:scale-[.995]">
          <div className="pointer-events-none absolute -top-6 left-10 h-10 w-24 rounded-full bg-white/45 blur-2xl" />
          <span className="pill-shine" aria-hidden />
          <div className="flex items-center gap-[2px]" aria-label={`별점 ${rating}점`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < rating} uid={uid} />
            ))}
          </div>
          <span className="truncate font-extrabold text-slate-900/95 text-[15px] md:text-[16px]">{body}</span>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-cyan-200/30 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
}
function Star({ filled, uid }) {
  const id = `g-${uid}`;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {filled ? (
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={`url(#${id})`} stroke="rgba(2,6,23,.2)" strokeWidth="0.6" />
      ) : (
        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z" fill="none" stroke="rgba(2,6,23,.35)" strokeWidth="1.1" />
      )}
    </svg>
  );
}

/* ───────── Feature Card (안전서비스/신청용) ───────── */
function FeatureCard({ images = [], copy, tone = "blue" }) {
  const ring = tone === "cyan" ? "from-cyan-500 to-blue-500" : "from-blue-600 to-cyan-500";
  return (
    <article className="rounded-2xl border border-blue-100 bg-white shadow-[0_14px_44px_rgba(2,132,199,.08)] overflow-hidden">
      <header className="flex items-center gap-2 p-4">
        <span className="text-xl">{copy.icon}</span>
        <h3 className="text-[17px] sm:text-[18px] font-extrabold text-blue-900">{copy.title}</h3>
        <span className="ml-auto rounded-full bg-blue-50 text-blue-700 text-[11px] px-2 py-[2px] font-bold ring-1 ring-blue-100">{copy.badge}</span>
      </header>

      <div className="px-4 -mt-1">
        <div className="text-[15px] font-extrabold text-slate-900">{copy.headline}</div>
        <p className="text-[13px] md:text-[14px] text-slate-600 mt-1">{copy.subcopy}</p>
      </div>

      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="relative h-[90px] md:h-[120px] rounded-xl overflow-hidden ring-1 ring-blue-100 bg-white">
              <img src={src} alt={`${copy.title} 미리보기 ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {copy.bullets?.length ? (
        <ul className="px-4 pt-3 grid sm:grid-cols-3 gap-2">
          {copy.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
              <span className={`inline-grid h-6 w-6 place-items-center rounded-full bg-gradient-to-r ${ring} text-white text-[12px] font-extrabold ring-1 ring-white/50 shadow`}>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="px-4 py-4">
        <Link
          href={copy.ctaHref}
          className={`block h-11 w-full rounded-xl bg-gradient-to-r ${ring} text-white font-extrabold ring-1 ring-white/50 hover:opacity-95 grid place-items-center active:scale-[.99]`}
          aria-label={`${copy.title} 페이지로 이동`}
        >
          {copy.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

/* 강사진 카드 (유지) */
function TeacherCard({ src, alt, name }) {
  return (
    <div className="flex flex-col items-center bg-blue-50 rounded-2xl shadow p-4">
      <img src={src} alt={alt} className="w-20 h-20 object-cover rounded-full mb-2" />
      <div className="font-semibold">{name}</div>
    </div>
  );
}

/* ⬇️ 새로 추가된 CTA 컴포넌트: 좌 미니폼 + 우 이미지 카드(버튼/블렌딩 포함) */
function HomeCTA() {
  const [form, setForm] = useState({ name: "", phone: "", gender: "", car: "" });
  const onChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "radio" ? value : value }));
  };

  return (
    <section className="mt-14 max-w-6xl mx-auto px-4" id="cta">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-6 items-stretch">
        {/* ⬅︎ 좌: 미니 신청 폼 (그대로) */}
        <div className="rounded-3xl shadow-2xl border bg-white overflow-hidden">
          <div className="px-6 sm:px-8 pt-8">
            <span className="inline-block bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              온라인 연수신청
            </span>
            <h3 className="text-3xl md:text-[34px] font-extrabold text-cyan-700 mt-3 mb-1 drop-shadow leading-tight">상담 신청</h3>
            <p className="text-[15px] md:text-[16px] text-gray-700 font-semibold mb-5">
              상담 신청 후 <span className="text-blue-700 font-bold">10분 내 상담원이 전화</span> 드립니다.
            </p>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2 text-blue-700">고객명</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="이름을 입력하세요"
                  className="w-full min-w-0 box-border px-4 py-3 rounded-lg border-2 border-cyan-200 focus:border-cyan-400 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-blue-700">연락처</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="ex) 010-1234-5678"
                  className="w-full min-w-0 box-border px-4 py-3 rounded-lg border-2 border-cyan-200 focus:border-cyan-400 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <label className="block font-bold mb-2 text-blue-700">성별</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="여자" checked={form.gender === "여자"} onChange={onChange} className="accent-cyan-500" />
                    여자
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="남자" checked={form.gender === "남자"} onChange={onChange} className="accent-blue-500" />
                    남자
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-2 text-blue-700">차량</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="car" value="자차" checked={form.car === "자차"} onChange={onChange} className="accent-cyan-500" />
                    자차
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="car" value="차량 희망" checked={form.car === "차량 희망"} onChange={onChange} className="accent-blue-500" />
                    차량 희망
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ➡︎ 우: 이미지 카드 (텍스트 제거 + 3D 버튼 + 에지 블렌딩) */}
        <div className="relative rounded-[28px] overflow-hidden shadow-xl ring-1 ring-white/60">
          {/* 이미지 */}
          <img
            src="/images/100.png"
            alt="지금 바로 신청하기 배너"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* 가장자리 자연스러운 화이트 블렌딩 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,.6), 0 40px 80px rgba(30, 58, 138, .25)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(140% 100% at 50% -10%, rgba(255,255,255,.55) 0%, transparent 55%)",
              mixBlendMode: "screen",
            }}
          />

{/* 중앙 3D 버튼 (반응형) — 고정 지점 기준 */}
<div className="absolute inset-x-0 top-[70%] md:top-[60%] -translate-y-1/2 flex justify-center">
  <Link
    href="/apply"
    aria-label="온라인 연수 신청 페이지로 이동"
    className="group relative w-[76%] sm:w-[70%] md:w-[62%]
               grid place-items-center whitespace-nowrap
               rounded-2xl bg-white text-[#325DFF] font-extrabold
               text-[16px] sm:text-[17px] md:text-[19px]
               py-3.5 sm:py-4 md:py-5
               shadow-[0_16px_36px_rgba(50,93,255,.32)] ring-1 ring-white/80
               transition-all duration-200 hover:-translate-y-[2px] active:translate-y-0"
  >
    <span className="relative z-10">지금 바로 신청하기</span>
    {/* 버튼 광택 */}
    <span className="absolute inset-0 rounded-2xl overflow-hidden">
      <span className="absolute -inset-px bg-gradient-to-b from-white/70 to-transparent opacity-90" />
      <span className="absolute -left-1/2 top-0 h-full w-[160%] translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-[120%] transition-transform duration-700 ease-out" />
    </span>
  </Link>
</div>
        </div>
      </div>
    </section>
  );
}

/* ───────── SSR: settings + reviews ───────── */
export async function getServerSideProps(ctx) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;

  let settings = null;
  let reviews = [];
  try {
    const [s, r] = await Promise.all([
      fetch(`${base}/api/settings-public`, { headers: { Accept: "application/json" } }),
      fetch(`${base}/api/reviews`, { headers: { Accept: "application/json" } }),
    ]);
    if (s.ok) settings = await s.json();
    if (r.ok) {
      const json = await r.json();
      reviews = Array.isArray(json?.reviews) ? json.reviews : Array.isArray(json) ? json : [];
    }
  } catch {
    settings = settings || null;
    reviews = [];
  }

  return { props: { settings, reviews } };
}
