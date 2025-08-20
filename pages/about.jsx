// pages/reviews.jsx
import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import Link from "next/link";
import Head from "next/head";

export default function Reviews({ settings }) {
  const { kakaoChannelUrl, metaTitle, metaDescription } = settings || {};

  // ── 푸터 접근 시 플로팅 자동 숨김 ─────────────────────────
  const [hideFloat, setHideFloat] = useState(false);
  useEffect(() => {
    const OFFSET = 160; // 푸터 상단이 뷰포트 하단과 160px 이내로 오면 숨김
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const footer = document.querySelector("footer");
        if (!footer) { setHideFloat(false); ticking = false; return; }
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
  // ─────────────────────────────────────────────────────────

  return (
    <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <Head>
        <title>{metaTitle || "연수 후기 | 타요드라이브"}</title>
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
      </Head>

      <HeaderNav />

      <main className="pt-28 pb-20 flex-1">
        {/* ▶︎ 환영 메시지 섹션 (폰트/효과는 기존과 동일한 체계로, 텍스트만 교체) */}
        <section className="relative z-10 pt-20 pb-20 bg-gradient-to-b from-white via-cyan-50 to-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* 이미지: 감각적으로 더 크게 (톤/테두리/그림자 유지) */}
              <div className="flex-1 md:flex-[1.15] animate-fade-in flex justify-center">
                <div className="relative">
                  {/* 은은한 하이라이트 블롭(배경) — 기존 톤에 맞춰 아주 약하게 */}
                  <span className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />
                  <img
                    src="https://i.ibb.co/Z1KRKSjK/program-img01.webp"
                    alt="타요드라이브 프로그램 안내"
                    className="w-full max-w-[960px] md:max-w-[1040px] rounded-3xl shadow-2xl border-4 border-cyan-200 ring-1 ring-cyan-100"
                    style={{
                      transform: "translateZ(0)", // 렌더링 안정화
                    }}
                  />
                </div>
              </div>

              {/* 텍스트: 기존 섹션의 폰트/계층(헤드라인/서브카피) 유지, 내용만 교체 */}
              <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="mb-6">
                  {/* 기존 h2 스타일 체계 그대로 */}
                  <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 mb-2">
                    타요드라이브에&nbsp;
                    <span className="text-cyan-600">오신 걸 환영합니다</span>
                  </h2>
                  {/* 기존 서브카피 톤 그대로 */}
                  <p className="text-base md:text-lg text-gray-700 mb-2">
                    여러분의 새로운 시작이 두려움이 아닌 <b className="text-blue-700">자신감</b>이 되도록 함께합니다.
                  </p>
                </div>

                {/* 본문: 기존 본문 폰트 스타일 유지(가독성/행간 동일) */}
                <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-3">
                  <p>
                    타요드라이브 홈페이지를 방문해주신 여러분, 진심으로 환영합니다. 저희는 수강생 한 분의 삶에 있어
                    ‘운전’이라는 새로운 시작이 두려움이 아닌 자신감이 되도록 최선을 다해 노력하고 있습니다.
                  </p>
                  <p>
                    타요드라이브의 입증된 전문 강사진은 오랜 경험과 친절함을 바탕으로 1:1 맞춤형 교육을 진행하며,
                    수강생의 눈높이에 맞춘 세심한 지도와 실전 중심 커리큘럼을 통해 안전한 운전 습관과 실력 향상을 위해
                    여러분의 든든한 길잡이가 되겠습니다.
                  </p>
                  <p className="font-semibold text-blue-800">
                    감사합니다.
                    <br />
                    <span className="text-cyan-700">타요드라이브 임직원 일동!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 안전 서비스 카드 섹션 컨테이너는 유지 (콘텐츠 미노출) */}
        <section className="py-0 bg-white">
          <div className="max-w-0x0 mx-auto px-0">
            <div className="mb-0 text-center"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">{/* … */}</div>
          </div>
        </section>
      </main>

      {/* ▽ 플로팅: 관리자 설정 반영 + 푸터 접근 시 자동 숨김 */}
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

      {/* 푸터 */}
      <footer className="bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100">
        <img src="https://i.ibb.co/jkqYSLMq/logo-footer.webp" alt="타요드라이브 푸터 로고" className="mx-auto h-10 mb-2" />
        <div className="mb-1 font-semibold">
          타요드라이브 | 대표번호 <span className="text-cyan-300">1666-8512</span>
        </div>
        <div className="mb-1">COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED</div>
        <div className="font-bold text-cyan-200">24시간 무료상담 1666-8512</div>
      </footer>

      {/* 추가 스타일 (기존 유지) */}
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 1.1s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from {opacity:0;transform:translateY(60px);} to {opacity:1;transform:translateY(0);} }
        .glassmorph-card { backdrop-filter: blur(8px); background: rgba(255,255,255,0.91); }
      `}</style>
    </main>
  );
}

/* ───────── SSR: 관리자 설정 불러오기 ───────── */
export async function getServerSideProps(ctx) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  let settings = null;
  try {
    const res = await fetch(`${base}/api/settings-public`, { headers: { Accept: "application/json" } });
    if (res.ok) settings = await res.json();
  } catch { settings = null; }
  return { props: { settings } };
}
