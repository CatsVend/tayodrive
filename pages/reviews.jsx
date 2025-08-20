// pages/reviews.jsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import HeaderNav from "../components/HeaderNav";

/**
 * SSR: /api/reviews에서 후기 데이터를 받아 UI에 주입
 * 응답은 배열([{ id, title, author, content, image, rating, createdAt }]) 또는
 * { reviews: [...] } 형태 모두 허용.
 */
export async function getServerSideProps(context) {
  const host = context?.req?.headers?.host || "localhost:3000";
  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://${host}`;

  let reviews = [];
  let settings = null;

  try {
    const [r, s] = await Promise.all([
      fetch(`${origin}/api/reviews`, { headers: { Accept: "application/json" } }),
      fetch(`${origin}/api/settings-public`, { headers: { Accept: "application/json" } }),
    ]);

    if (r.ok) {
      const json = await r.json();
      reviews = Array.isArray(json?.reviews) ? json.reviews : Array.isArray(json) ? json : [];
    }
    if (s.ok) {
      settings = await s.json();
    }
  } catch {
    reviews = [];
    settings = null;
  }

  // 카드가 3칸 UI라 상단 3개만 노출
  reviews = reviews.slice(0, 3);
  return { props: { reviews, settings } };
}

export default function Reviews({ reviews, settings }) {
  const { kakaoChannelUrl } = settings || {};

  // 별점(1~5) -> '★★★★★'
  const toStars = (r) => {
    const n = Math.max(0, Math.min(5, Number(r) || 5));
    return "★★★★★".slice(0, n);
  };

  // API 데이터가 없으면 기존 고정 콘텐츠로 폴백 (UI/UX 100% 유지)
  const fallback = [
    {
      id: "f1",
      title: "역쉬 연수는 남편이 아닌 선생님께!",
      body: "운전연수는 진짜 남편보다 전문가한테 받는게 정답인 것 같아요.\n이제는 운전이 두렵지 않아요!",
      rating: 5,
      delay: 0,
    },
    {
      id: "f2",
      title: "장롱면허 탈출! 자신감 회복!",
      body:
        "강사님이 친절하게 기초부터 주행, 주차까지 상세하게 알려주시고\n시간도 절약되고 너무 편했어요.",
      rating: 5,
      delay: 0.15,
    },
    {
      id: "f3",
      title: "공포증 극복! 베스트 연수",
      body:
        "도로주행부터 주차까지 꼼꼼하게 배웠고\n이제는 출퇴근도 자신감 있게 합니다.",
      rating: 5,
      delay: 0.3,
    },
  ];

  // UI 주입용 데이터 정규화 (API 필드명이 달라도 안전)
  const items =
    reviews && reviews.length > 0
      ? reviews.map((r, i) => ({
          id: r.id ?? `r${i}`,
          title: r.title ?? "타요드라이브 연수 후기",
          body: (r.body ?? r.content ?? "").replace(/\r?\n/g, "\n"),
          rating: toStars(r.rating),
          delay: i === 1 ? 0.15 : i === 2 ? 0.3 : 0,
        }))
      : fallback.map((f) => ({ ...f, rating: toStars(f.rating) }));

  // ── 푸터 접근 시 플로팅 자동 숨김(다른 기능 변경 없음) ─────────────
  const [hideFloat, setHideFloat] = useState(false);
  useEffect(() => {
    const OFFSET = 160; // 푸터가 뷰포트 하단과 160px 이내면 숨김
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
    onScroll(); // 초기 계산
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  // ───────────────────────────────────────────────────────────

  return (
    <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <Head>
        <title>운전연수후기 | 타요드라이브</title>
        <meta
          name="description"
          content="타요드라이브 운전연수 회원 실후기, 1:1 방문연수, 업계 최고 강사진, 차별화된 프로그램 및 안전 서비스 소개."
        />
        <meta property="og:title" content="운전연수후기 | 타요드라이브" />
        <meta
          property="og:description"
          content="회원 실후기와 차별화된 프로그램, 믿을 수 있는 강사진과 보험, 최고의 만족도를 경험하세요."
        />
        <meta property="og:image" content="https://i.ibb.co/jkqYSLMq/logo-footer.webp" />
        <link rel="icon" href="https://i.ibb.co/j9Q03zry/logo-main.webp" />
      </Head>

      <HeaderNav />

      {/* 본문 (UI 그대로) */}
      <div className="pt-28 pb-20 flex-1">
        {/* 후기 섹션 */}
        <section className="relative z-10 pt-10 pb-10 bg-gradient-to-b from-white via-blue-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-12 text-center">
              <div className="text-cyan-600 font-bold text-lg mb-2">타요드라이브 연수 후기</div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                <span className="text-blue-800">회원들의 생생한 운전연수 후기</span>
              </h2>
              <p className="text-gray-600 mb-5">수많은 후기와 별점으로 검증된 타요드라이브 운전연수 경험!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-3xl glassmorph-card shadow-xl border-l-4 border-cyan-400 px-6 py-8 flex flex-col items-center hover:scale-105 transition animate-fade-in"
                  style={{ animationDelay: `${it.delay || 0}s` }}
                >
                  <img
                    src="https://i.ibb.co/6j99Gdr/quote-balloon-r-27e46a5e.png"
                    className="w-8 mb-2"
                    alt="후기 인용"
                  />
                  <div className="text-xl font-bold text-blue-700 mb-1">{it.rating}</div>
                  <div className="text-lg font-semibold mb-2 text-gray-900">{it.title}</div>
                  <div className="text-gray-700 text-base" style={{ whiteSpace: "pre-line" }}>
                    {it.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 프로그램/특징 섹션 (정적 유지) */}
        <section className="relative z-10 pt-20 pb-20 bg-gradient-to-b from-white via-cyan-50 to-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1 animate-fade-in">
                <img
                  src="https://i.ibb.co/Z1KRKSjK/program-img01.webp"
                  alt="타요드라이브 프로그램 안내"
                  className="rounded-3xl shadow-2xl border-4 border-cyan-200"
                />
              </div>
              <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 mb-2">
                    타요드라이브만의 <span className="text-cyan-600">차별화된 프로그램</span>
                  </h2>
                  <p className="text-base md:text-lg text-gray-700 mb-2">
                    고객 맞춤형 연수와 철저한 안전 교육, 그리고 업계 최고의 강사진!
                  </p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <span className="w-3 h-3 mt-2 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse"></span>
                    <span>
                      1:1 방문 교육 <b className="text-blue-700">|</b> 집 앞으로 찾아가는 전국 연수
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-3 h-3 mt-2 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse"></span>
                    <span>전문 강사진 <b className="text-blue-700">|</b> 초보·장롱면허·여성·학생 모두 맞춤</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-3 h-3 mt-2 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse"></span>
                    <span>
                      철저한 안전 관리, <span className="text-cyan-600 font-bold">100% 학원 보험처리</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-3 h-3 mt-2 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 animate-pulse"></span>
                    <span>합리적 비용, 실전 노하우, 친절한 교육</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 안전 서비스 카드 섹션 (정적 유지) */}
        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2">진행하는 안전 서비스</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="rounded-2xl bg-blue-50 shadow p-6 flex flex-col items-center hover:scale-105 transition group">
                <svg width="36" height="36" fill="none" className="mb-2">
                  <circle cx="18" cy="18" r="16" fill="#22d3ee" opacity="0.25" />
                  <path d="M18 13v10m5-5H13" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-blue-700 font-bold mb-1">1:1 맞춤 교육</div>
                <div className="text-gray-700 text-sm">개인별 맞춤 지도와 세심한 관리</div>
              </div>
              <div className="rounded-2xl bg-blue-50 shadow p-6 flex flex-col items-center hover:scale-105 transition group">
                <svg width="36" height="36" fill="none" className="mb-2">
                  <circle cx="18" cy="18" r="16" fill="#818cf8" opacity="0.15" />
                  <path d="M11 18h14" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-blue-700 font-bold mb-1">전문 강사진</div>
                <div className="text-gray-700 text-sm">최고의 실력과 친절함, 철저한 신원 검증</div>
              </div>
              <div className="rounded-2xl bg-blue-50 shadow p-6 flex flex-col items-center hover:scale-105 transition group">
                <svg width="36" height="36" fill="none" className="mb-2">
                  <circle cx="18" cy="18" r="16" fill="#22c55e" opacity="0.15" />
                  <path d="M18 11v14m7-7H11" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-blue-700 font-bold mb-1">여성·학생 환영</div>
                <div className="text-gray-700 text-sm">여성 강사·학생 맞춤 교육까지 OK</div>
              </div>
              <div className="rounded-2xl bg-blue-50 shadow p-6 flex flex-col items-center hover:scale-105 transition group">
                <svg width="36" height="36" fill="none" className="mb-2">
                  <circle cx="18" cy="18" r="16" fill="#fbbf24" opacity="0.12" />
                  <path d="M13 18h10" stroke="#f59e42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-blue-700 font-bold mb-1">안전 보험 100%</div>
                <div className="text-gray-700 text-sm">수업 중 사고, 학원 보험 100% 처리</div>
              </div>
              <div className="rounded-2xl bg-blue-50 shadow p-6 flex flex-col items-center hover:scale-105 transition group">
                <svg width="36" height="36" fill="none" className="mb-2">
                  <circle cx="18" cy="18" r="16" fill="#f472b6" opacity="0.11" />
                  <path d="M12 18h12" stroke="#be185d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-blue-700 font-bold mb-1">합리적 비용</div>
                <div className="text-gray-700 text-sm">숨은 비용 NO, 명확한 안내</div>
              </div>
              <div className="rounded-2xl bg-blue-50 shadow p-6 flex flex-col items-center hover:scale-105 transition group">
                <svg width="36" height="36" fill="none" className="mb-2">
                  <circle cx="18" cy="18" r="16" fill="#a78bfa" opacity="0.15" />
                  <path d="M15 18h6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-blue-700 font-bold mb-1">최고의 만족</div>
                <div className="text-gray-700 text-sm">고객 평점 5.0, 추천률 1위</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ▽ 플로팅: 푸터 접근 시 자동 숨김 (기능 외 변경 없음) */}
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
        <a
          href={kakaoChannelUrl || "https://pf.kakao.com/_hGxgkxj"}
          className="block mt-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/제목_없는_디자인__1_-removebg-preview.png"
            alt="카카오톡 상담하기"
            className="w-24 md:w-28 rounded-full shadow-lg border border-yellow-300 bg-white/95"
          />
        </a>
      </div>

      {/* 푸터 (UI 동일) */}
      <footer className="bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100">
        <img
          src="https://i.ibb.co/jkqYSLMq/logo-footer.webp"
          alt="타요드라이브 푸터 로고"
          className="mx-auto h-10 mb-2"
        />
        <div className="mb-1 font-semibold">
          타요드라이브 | 대표번호 <span className="text-cyan-300">1666-8512</span>
        </div>
        <div className="mb-1">COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED</div>
        <div className="font-bold text-cyan-200">24시간 무료상담 1666-8512</div>
      </footer>

      {/* 글로벌 스타일 (UI 유지용) */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1.1s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from {opacity:0; transform:translateY(60px);}
          to {opacity:1; transform:translateY(0);}
        }
        .glassmorph-card { backdrop-filter: blur(8px); background: rgba(255,255,255,0.91); }
      `}</style>
    </main>
  );
}
