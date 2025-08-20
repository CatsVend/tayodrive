// pages/areas.jsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import HeaderNav from "../components/HeaderNav";

/** SSR 절대 URL 계산 (프록시/배포 환경 포함) */
function getBaseUrl(req) {
  const proto =
    req?.headers["x-forwarded-proto"] ||
    (req?.headers["x-forwarded-proto"] === "" ? "http" : "http") ||
    "http";
  const host = req?.headers["x-forwarded-host"] || req?.headers.host;
  return `${proto}://${host}`;
}

/** API가 비어있거나 실패할 때 쓰는 폴백(기존 UI 100% 유지) */
const FALLBACK_REGIONS = [
  { name: "서울", img: "/images/area_img01.webp", subtitle: "전지역 방문 연수" },
  { name: "경기", img: "/images/area_img02.webp", subtitle: "전지역 방문 연수" },
  { name: "인천", img: "/images/area_img03.webp", subtitle: "전지역 방문 연수" },
  { name: "대구", img: "/images/area_img04.webp", subtitle: "전지역 방문 연수" },
  { name: "부산", img: "/images/area_img05.webp", subtitle: "전지역 방문 연수" },
];

export async function getServerSideProps(ctx) {
  let regions = FALLBACK_REGIONS;
  let settings = null;

  try {
    const base = getBaseUrl(ctx.req);

    const [areasRes, settingsRes] = await Promise.all([
      fetch(`${base}/api/areas`, { headers: { cookie: ctx.req.headers.cookie || "" } }),
      fetch(`${base}/api/settings-public`, { headers: { Accept: "application/json" } }),
    ]);

    if (areasRes.ok) {
      const json = await areasRes.json();
      if (Array.isArray(json) && json.length > 0) {
        regions = json.map((r, i) => ({
          name: r?.name || FALLBACK_REGIONS[i]?.name || `지역${i + 1}`,
          img: r?.img || FALLBACK_REGIONS[i % FALLBACK_REGIONS.length].img,
          subtitle: r?.subtitle || "전지역 방문 연수",
        }));
      }
    }

    if (settingsRes.ok) {
      settings = await settingsRes.json();
    }
  } catch (e) {
    // 실패 시 폴백 유지
  }

  return { props: { regions, settings } };
}

export default function Areas({ regions, settings }) {
  const { kakaoChannelUrl } = settings || {};

  // ── 푸터 접근 시 플로팅 자동 숨김 (다른 기능 변경 없음) ─────────────
  const [hideFloat, setHideFloat] = useState(false);
  useEffect(() => {
    const OFFSET = 160; // 푸터 상단이 뷰포트 하단과 160px 이내로 오면 숨김
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
  // ─────────────────────────────────────────────────────────────

  return (
    <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <HeaderNav />

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 flex-1">
        {/* 1. 상단 인트로 + 지도/현장 이미지 콜라주 (기존 그대로) */}
        <section className="relative mb-20">
          <div className="glass-neon rounded-3xl shadow-2xl border flex flex-col md:flex-row items-center p-8 md:p-14 gap-10">
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold text-blue-800 mb-4 drop-shadow-xl">전국 방문 운전연수</h1>
              <div className="text-base md:text-lg text-gray-700 font-semibold mb-5">
                <span className="text-cyan-700 font-bold">서울·경기·인천·부산·대구</span>
                <br />
                집 앞으로 찾아가는 <span className="font-bold text-blue-700">1:1 방문 운전연수</span> 서비스!
              </div>
              <ul className="list-disc pl-6 space-y-1 text-gray-800 text-base">
                <li>초보운전, 장롱면허, 여성·학생 누구나</li>
                <li>강사진 직접 배정, 지역별 맞춤 교육</li>
                <li>당일상담·빠른예약·내 일정에 맞게</li>
              </ul>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {/* 이미지 콜라주 */}
              <div className="relative w-full flex flex-col items-center">
                <img
                  src="/images/areaaaa.png"
                  alt="타요드라이브 전국지도"
                  className="w-64 md:w-80 rounded-2xl shadow-lg border-2 border-cyan-200 mb-4 z-10 hover-glow transition"
                  style={{ transform: "rotate(-5deg)" }}
                />
                <img
                  src="/images/44.png"
                  alt="실전 도로연수 컷"
                  className="absolute right-1 top-12 w-28 md:w-32 rounded-xl shadow-lg border-2 border-blue-200 z-20 hover-glow transition"
                  style={{ transform: "rotate(8deg)" }}
                />
                <img
                  src="/images/side_banner.webp"
                  alt="도로 주행 현장"
                  className="absolute left-0 bottom-0 w-24 md:w-28 rounded-xl shadow-lg border-2 border-blue-200 z-20 hover-glow transition"
                  style={{ transform: "rotate(-6deg)" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. 지역별 카드 섹션 (데이터만 주입) */}
        <section className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-800 mb-3">방문 가능 지역</h2>
            <p className="text-gray-600 font-medium">
              서울, 경기, 인천, 대구, 부산 전 지역에서
              <br className="hidden md:inline" /> 1:1 방문 연수 진행 중!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {regions.map((r, idx) => (
              <div
                key={`${r.name}-${idx}`}
                className="glass-neon rounded-2xl p-6 shadow-xl flex flex-col items-center hover:scale-105 transition group"
              >
                <img
                  src={r.img}
                  alt={`${r.name} 운전연수`}
                  className="w-20 h-20 rounded-full shadow-lg border-2 border-cyan-200 mb-3"
                />
                <div className="text-blue-700 font-bold text-lg mb-1">{r.name}</div>
                <div className="text-gray-700 text-sm">{r.subtitle || "전지역 방문 연수"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 바텀 CTA (그대로) */}
        <section className="relative py-16 px-0 parallax">
          <div className="max-w-3xl mx-auto glass-neon p-10 rounded-3xl text-center shadow-2xl border">
            <div className="text-xl md:text-2xl font-extrabold text-cyan-900 mb-3 drop-shadow-lg">
              <svg className="inline w-9 h-9 text-cyan-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.974z" />
              </svg>
              집 앞으로 찾아가는 1:1 방문운전연수
              <br />
              전국 어디서든 <span className="text-cyan-600 font-bold">타요드라이브</span>!
            </div>
            <div className="mt-5">
              <Link
                href="/apply"
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold shadow-lg text-lg transition hover:from-cyan-300 hover:to-blue-400"
              >
                온라인 연수 신청 바로가기
              </Link>
            </div>
          </div>
        </section>
      </main>

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

      {/* 푸터 (그대로) */}
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

      {/* 커스텀 CSS (Glass, Glow, Parallax) — 기존 그대로 */}
      <style jsx global>{`
        .glass-neon {
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 4px 32px 0 rgba(54, 186, 255, 0.15), 0 0 12px 2px #36b6ff88;
          backdrop-filter: blur(18px);
          border: 1.5px solid rgba(36, 146, 220, 0.18);
        }
        .hover-glow:hover {
          box-shadow: 0 0 0 4px #22d3ee33, 0 4px 32px 2px #3b82f6aa;
          transform: scale(1.04);
        }
        .parallax {
          background: url("https://i.ibb.co/4RBLnwvT/main-bg02-f4946636.png") center/cover fixed;
        }
      `}</style>
    </main>
  );
}
