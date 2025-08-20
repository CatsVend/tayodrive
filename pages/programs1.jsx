// pages/programs.jsx
import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import Link from "next/link";

export default function Programs({ settings }) {
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

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4">
        {/* 인트로 */}
        <section className="relative bg-wave rounded-3xl shadow-2xl border mb-16 p-8 md:p-14 overflow-hidden">
          <div
            className="animated-wave absolute left-0 right-0 top-0"
            style={{
              background: "url('https://svgshare.com/i/17qX.svg') repeat-x",
              height: "48px",
              pointerEvents: "none",
              zIndex: 1,
              animation: "waveMove 14s linear infinite",
            }}
          ></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 text-center md:text-left fade-in">
              <span className="badge">타요드라이브 연수 프로그램</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-xl">
                4일반 · 3일반 · 주말반
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-semibold mb-4">
                초보/장롱면허/직장인/학생, 내 일정에 맞춰<br />
                가장 완벽한 1:1 방문운전연수를 선택하세요.
              </p>
              <ul className="list-disc pl-6 text-base text-gray-800 font-medium">
                <li>현장 실전 위주, 강사진 1:1 배정</li>
                <li>커리큘럼/일정/비용/후기 한눈에 비교</li>
                <li>집 앞으로 바로 방문, 빠른 예약!</li>
              </ul>
            </div>
            <div className="flex-1 flex flex-col gap-3 items-center">
              <img
                src="https://i.ibb.co/Z1KRKSjK/program-img01.webp"
                alt="연수 프로그램 대표"
                className="w-60 md:w-72 rounded-3xl img-glow mb-3 fade-in"
              />
              {/* <img src="https://i.ibb.co/1H21YPH/image.png" alt="연수 수업 장면" className="w-40 md:w-52 rounded-xl img-glow -ml-6 md:block hidden fade-in" style={{ animationDelay: ".15s" }} /> */}
            </div>
          </div>
        </section>

        <div className="w-[100px] h-1 bg-gradient-to-r from-cyan-300 to-blue-400 rounded mx-auto my-10"></div>


        {/* 주말반 */}
       <section className="relative mb-16">
  <div className="max-w-5xl mx-auto glass-neon p-10 md:p-14 rounded-3xl shadow-xl border program-card fade-in">
    <div className="flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1 flex flex-col gap-3 items-start">
        {/* 배지 크기 ↑ */}
        <span
          className="badge bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-900 mb-3"
          style={{ fontSize: "1.125rem", padding: "0.35em 1.15em" }}
        >주말반 연수</span>
                <h2 className="text-3xl font-extrabold text-blue-700 mb-2">평일엔 바빠도 OK! 주말에 완성</h2>
                <ul className="text-gray-800 text-base space-y-1 mb-4">
                  <li>1일차: 이론·기본조작, 운전자세, 좌/우회전</li>
                  <li>2일차: 도로주행, 고속주행, 거리/속도감·신호·표지판</li>
                  <li>3일차: 시내+이면도로, 심화 주행</li>
                  <li>4일차: 실전 주차(전진·후진·T·평행), 최종 정리</li>
                </ul>
                <div className="flex flex-wrap gap-2 text-cyan-700 font-bold text-sm">
                  <span>#주말집중</span>
                  <span>#평일근무자</span>
                  <span>#학생/직장인</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 items-center">
                <img
                  src="/images/cc1.png"
                  alt="주말 운전 교육"
                  className="w-52 md:w-60 rounded-2xl img-glow mb-2 fade-in"
                />
                <img
                  src="/images/cc2.png"
                  alt="현장 피드백 장면"
                  className="w-40 rounded-xl img-glow border border-blue-200 md:block hidden fade-in"
                  style={{ animationDelay: ".2s" }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="w-[100px] h-1 bg-gradient-to-r from-cyan-300 to-blue-400 rounded mx-auto my-10"></div>

        {/* CTA */}
        <section className="py-12 px-2 text-center max-w-4xl mx-auto">
          <div className="glass-neon rounded-2xl p-10 shadow-xl border inline-block">
            <div className="text-xl md:text-2xl font-bold text-cyan-900 mb-3 drop-shadow-lg">
              <svg className="inline w-8 h-8 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.974z" />
              </svg>
              내 일정, 내 실력, 내 목적에 맞는 맞춤 방문연수
            </div>
            <div className="mt-5">
              <a
                href="apply"
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold shadow-lg text-lg transition hover:from-cyan-300 hover:to-blue-400"
              >
                연수신청 바로가기
              </a>
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

      {/* 푸터 */}
      <footer className="bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100 mt-10">
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

      {/* 커스텀 CSS (Glass, Glow, Wave, Badge 등) */}
      <style jsx global>{`
        .glass-neon {
          background: rgba(255, 255, 255, 0.87);
          box-shadow: 0 4px 32px 0 rgba(54, 186, 255, 0.11), 0 0 16px 3px #36b6ff66;
          backdrop-filter: blur(18px);
          border: 1.5px solid rgba(36, 146, 220, 0.13);
        }
        .program-card {
          transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.17s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .program-card:hover {
          transform: translateY(-7px) scale(1.028);
          box-shadow: 0 8px 36px 0 #3b82f666, 0 0 18px 3px #22d3ee77;
          z-index: 2;
        }
        .bg-wave {
          background: linear-gradient(120deg, #f0f9ff 0%, #c0ecff 100%);
        }
        .badge {
          display: inline-block;
          padding: 0.15em 1em;
          font-weight: 700;
          border-radius: 1em;
          font-size: 0.95em;
          letter-spacing: 0.05em;
          background: linear-gradient(90deg, #a7f3d0 0, #38bdf8 90%);
          color: #0e7490;
          box-shadow: 0 2px 12px 0 #0ea5e940;
          margin-bottom: 1rem;
        }
        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }
        .fade-in {
          animation: fadeIn 1.1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .img-glow {
          box-shadow: 0 2px 32px 0 #38bdf822, 0 0 0 7px #a7f3d055;
          transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.18s;
        }
        .img-glow:hover {
          box-shadow: 0 4px 54px 0 #22d3ee66, 0 0 0 10px #67e8f944;
          transform: scale(1.035) rotate(-2deg);
          filter: brightness(1.05) blur(0.5px);
        }
        .animated-wave {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 48px;
          pointer-events: none;
          z-index: 1;
          background: url("https://svgshare.com/i/17qX.svg") repeat-x;
          animation: waveMove 14s linear infinite;
        }
        @keyframes waveMove {
          100% {
            background-position-x: 1400px;
          }
        }
      `}</style>
    </main>
  );
}

/* ───────── SSR: 관리자 설정 불러오기 (kakaoChannelUrl 반영) ───────── */
export async function getServerSideProps(ctx) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  let settings = null;
  try {
    const res = await fetch(`${base}/api/settings-public`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) settings = await res.json();
  } catch {
    settings = null;
  }
  return { props: { settings } };
}
