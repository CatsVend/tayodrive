// components/HeaderNav.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/** 네비 항목 */
const NAV = [
  { href: "/about", label: "회사소개" },
  { href: "/areas", label: "연수가능지역" },
  { href: "/programs", label: "3·4일연수" },
  { href: "/programs1", label: "주말연수" },
  { href: "/faq", label: "자주하는 질문" },
  { href: "/reviews", label: "운전연수후기" },
  { href: "/pricing", label: "연수비용" },
];
const CTA = { href: "/apply", label: "온라인연수신청" };

export default function HeaderNav() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // 매직 언더라인(데스크탑)
  const listRef = useRef(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });

  // 헤더/CTA 마우스 라이트
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 2);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // 데스크탑: 항목 hover 시 매직 언더라인 이동
  const moveIndicator = (el) => {
    if (!listRef.current || !el) return;
    const wrap = listRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const left = rect.left - wrap.left + 12; // 좌우 여백 약간
    const width = rect.width - 24;
    setUnderline({ left, width, visible: true });
  };
  const hideIndicator = () => setUnderline((u) => ({ ...u, visible: false }));

  // 헤더 전체에 마우스 라이트(부드러운 하이라이트)
  const onHeaderMouseMove = (e) => {
    const host = headerRef.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    host.style.setProperty("--mx", `${e.clientX - r.left}px`);
    host.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // CTA 커서 샤인/립플
  const onCTA_Move = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header
      ref={headerRef}
      onMouseMove={onHeaderMouseMove}
      className={[
        "fixed top-0 left-0 right-0 z-50",
        // 모바일은 불투명 흰색, 데스크탑은 반투명+블러
        "bg-white md:bg-white/90 md:supports-[backdrop-filter]:backdrop-blur",
        "transition-all duration-300",
        scrolled ? "shadow-md border-b border-blue-100" : "shadow-sm border-b border-gray-100",
        // 헤더 라이트(마우스 트래킹)는 데스크탑에서만
        "before:pointer-events-none before:content-[''] before:absolute before:inset-0",
        "md:before:bg-[radial-gradient(180px_180px_at_var(--mx,50%)_var(--my,50%),rgba(56,189,248,0.10),transparent_60%)]",
      ].join(" ")}
      role="banner"
      aria-label="사이트 상단 네비게이션"
    >
      {/* 스크롤 진행 바 */}
      <div className="absolute left-0 right-0 top-0 h-0.5">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>

      <nav className="relative max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-16 md:h-20" aria-label="주요 메뉴">
        {/* 로고 */}
        <Link href="/" aria-label="타요드라이브 홈" className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-blue-50">
            <img src="https://i.ibb.co/j9Q03zry/logo-main.webp" alt="타요드라이브 로고" className="h-10 w-auto" />
          </span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="relative hidden md:block">
          {/* 매직 언더라인 */}
          <span
            className={[
              "pointer-events-none absolute -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 transition-all duration-200",
              underline.visible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{ left: underline.left, width: underline.width }}
            aria-hidden
          />
          {/* ⬇️ gap-4 로 간격 확대 */}
          <ul ref={listRef} className="flex items-center gap-4">
            {NAV.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href} className="relative group">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={(e) => moveIndicator(e.currentTarget)}
                    onFocus={(e) => moveIndicator(e.currentTarget)}
                    onMouseLeave={hideIndicator}
                    className={[
                      // ⬇️ 데스크탑에서만 좌우 패딩 확대
                      "nav-link relative rounded-full px-3 md:px-4 py-2 text-sm font-medium transition",
                      "focus-visible:outline-none focus-visible:ring-2 ring-blue-300",
                      "will-change-transform",
                      active ? "nav-link--active" : "text-slate-700",
                    ].join(" ")}
                  >
                    {/* 현재 페이지 뱃지(PC) */}
                    <span className="relative z-10 flex items-center gap-1">
                      {label}
                      {active && (
                        <span className="ml-1 rounded-full bg-cyan-50 px-2 py-[1px] text-[10px] font-bold text-cyan-700 ring-1 ring-cyan-200">
                          현재
                        </span>
                      )}
                    </span>
                    {/* 커서 따라 퍼지는 배경(호버) */}
                    <span className="nav-ink" aria-hidden />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={CTA.href}
                onMouseMove={onCTA_Move}
                className={[
                  "cta relative overflow-hidden ml-1 rounded-full px-4 py-2 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-cyan-500 to-blue-600",
                  "shadow-sm transition-transform duration-200 hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 ring-blue-300",
                  "whitespace-nowrap",
                ].join(" ")}
              >
                {CTA.label}
              </Link>
            </li>
          </ul>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 ring-blue-300"
          aria-label={open ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          aria-controls="mobile-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {!open ? (
            <svg className="w-7 h-7 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 8h16M4 16h16" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </nav>

      {/* 하단 헤어라인 그라디언트 */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />

      {/* 모바일 오버레이 + 드로어 */}
      <div
        className={["fixed inset-0 z-50 md:hidden transition", open ? "opacity-100 visible" : "opacity-0 invisible"].join(" ")}
        aria-hidden={!open}
        onClick={closeMenu}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div
          id="mobile-nav"
          className={[
            "absolute right-0 top-0 h-full w-4/5 max-w-xs",
            "bg-white",
            "border-l border-blue-100 shadow-2xl",
            "p-8 flex flex-col",
            "transition-transform duration-300 ease-in-out",
            open ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-label="모바일 메뉴"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={closeMenu} aria-label="타요드라이브 홈" className="p-1 rounded-full bg-blue-50">
              <img src="https://i.ibb.co/j9Q03zry/logo-main.webp" alt="타요드라이브 로고" className="h-9 w-auto" />
            </Link>
            <button
              className="p-2 rounded-full bg-slate-100 focus-visible:outline-none focus-visible:ring-2 ring-blue-300"
              onClick={closeMenu}
              aria-label="모바일 메뉴 닫기"
            >
              <svg className="w-7 h-7 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-2">
            {NAV.map(({ href, label }, i) => {
              const active = isActive(href);
              return (
                <li
                  key={href}
                  className={[
                    "transition-all duration-300 ease-out",
                    open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
                  ].join(" ")}
                  style={{ transitionDelay: `${open ? i * 40 : 0}ms` }}
                >
                  <Link
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-center gap-2 rounded-full px-4 py-3 text-base font-semibold transition",
                      active
                        ? "text-cyan-700 bg-cyan-50 ring-1 ring-cyan-200"
                        : "text-slate-800 hover:text-slate-900 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {label}
                    {active && (
                      <span className="ml-1 rounded-full bg-cyan-50 px-2 py-[1px] text-[10px] font-bold text-cyan-700 ring-1 ring-cyan-200">
                        현재
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
            <li
              className={[
                "mt-2 transition-all duration-300 ease-out",
                open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
              ].join(" ")}
              style={{ transitionDelay: `${open ? NAV.length * 40 : 0}ms` }}
            >
              <Link
                href={CTA.href}
                onClick={closeMenu}
                className={[
                  "block rounded-full px-4 py-3 text-center font-extrabold text-white",
                  "bg-gradient-to-r from-cyan-500 to-blue-600",
                  "shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5",
                ].join(" ")}
              >
                {CTA.label}
              </Link>
            </li>
          </ul>

          <div className="mt-auto pt-6 text-xs text-slate-500">
            <div className="font-semibold text-slate-600">24시간 무료상담 1666-8512</div>
          </div>
        </div>
      </div>

      {/* 고급 마이크로 인터랙션 CSS */}
      <style jsx>{`
        /* 링크 공통 */
        .nav-link {
          color: #334155; /* slate-700 */
        }

        /* 텍스트 호버 */
        .nav-link:hover,
        .nav-link:focus-visible {
          color: #0f172a; /* slate-900 */
          transform: translateY(-0.5px);
        }

        /* 흐르는 그라디언트 밑줄 */
        .nav-link::after {
          content: "";
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: -2px;
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #22d3ee 0%, #38bdf8 40%, #2563eb 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 220ms ease;
        }
        .nav-link:hover::after,
        .nav-link:focus-visible::after {
          transform: scaleX(1);
        }

        /* 커서 위치에서 퍼지는 잉크 */
        .nav-link .nav-ink {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 180ms ease, transform 180ms ease;
          background: radial-gradient(120px 120px at var(--lx, 50%) var(--ly, 50%), rgba(14, 165, 233, 0.08), transparent 60%);
          pointer-events: none;
        }
        .nav-link:hover .nav-ink {
          opacity: 1;
          transform: scale(1);
        }

        /* 활성 메뉴 */
        .nav-link--active {
          color: #0e7490; /* cyan-700 */
          background: rgba(34, 211, 238, 0.12);
          box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.35);
        }
        .nav-link--active::after {
          transform: scaleX(1);
        }

        /* CTA 효과 */
        .cta::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(120px 120px at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.45), transparent 60%);
          opacity: 0;
          transition: opacity 160ms ease;
        }
        .cta:hover::before {
          opacity: 1;
        }

        /* ⬇️ Desktop 전용: 글자 간격 넓힘 */
        @media (min-width: 768px) {
          .nav-link,
          .nav-link--active {
            letter-spacing: 0.045em; /* 필요시 0.05em까지 */
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-link,
          .cta {
            transition: none !important;
          }
        }
      `}</style>

      {/* 링크별 커서 좌표 바인딩 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            const root = document.currentScript.closest('header');
            if(!root) return;
            root.addEventListener('mousemove', function(e){
              const t = e.target.closest('.nav-link');
              if(!t) return;
              const r = t.getBoundingClientRect();
              t.style.setProperty('--lx', (e.clientX - r.left) + 'px');
              t.style.setProperty('--ly', (e.clientY - r.top) + 'px');
            }, {passive: true});
          })();
        `,
        }}
      />
    </header>
  );
}
