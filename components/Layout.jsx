// Layout.jsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// 메뉴/페이지 정의
const NAV = [
  { name: "회사소개", href: "/about" },
  { name: "연수가능지역", href: "/areas" },
  { name: "연수프로그램", href: "/programs" },
  { name: "자주하는 질문", href: "/faq" },
  { name: "운전연수후기", href: "/reviews" },
  { name: "연수비용", href: "/pricing" },
];
const CTA = { name: "온라인연수신청", href: "/apply" };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// 다크모드 토글 (Tailwind dark: 지원)
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);
  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDark(true);
    }
  };
  return [dark, toggle];
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const { pathname } = useRouter();

  return (
    <div className={classNames("min-h-screen flex bg-white dark:bg-[#171a1e] transition-colors duration-300")}>
      {/* Sidebar (PC only) */}
      <aside className="hidden md:flex flex-col w-60 bg-white/90 dark:bg-[#242833] border-r border-blue-100 dark:border-gray-800 shadow-lg py-6 px-4 glass-neon">
        <Link href="/" aria-label="타요드라이브 메인으로 이동" className="flex items-center mb-10">
          <span className="bg-blue-50 rounded-full p-2 shadow mr-2">
            <img src="https://i.ibb.co/j9Q03zry/logo-main.webp" alt="타요드라이브 로고" className="h-11 w-auto" />
          </span>
          <span className="font-extrabold text-2xl text-gray-900 dark:text-cyan-200 drop-shadow ml-1">타요드라이브</span>
        </Link>
        <nav className="flex flex-col gap-1 mb-8">
          {NAV.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              aria-label={item.name}
              className={classNames(
                "px-4 py-3 rounded-xl font-bold transition flex items-center",
                pathname.startsWith(item.href)
                  ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 shadow"
                  : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-[#2a3242] hover:text-cyan-600"
              )}
            >
              {/* (원한다면 좌측에 메뉴별 아이콘 추가 가능) */}
              {item.name}
            </Link>
          ))}
        </nav>
        <Link
          href={CTA.href}
          className="block w-full px-4 py-3 mt-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-extrabold rounded-xl text-center shadow-lg hover:from-cyan-300 hover:to-blue-400"
          aria-label={CTA.name}
        >
          {CTA.name}
        </Link>
        {/* 다크모드 토글 */}
        <button
          className="mt-8 flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-200 rounded-xl px-3 py-2 transition hover:bg-cyan-50 hover:dark:bg-[#28303d]"
          aria-label="다크모드 전환"
          onClick={toggleDark}
        >
          <span>{dark ? "라이트모드" : "다크모드"}</span>
          <span aria-hidden>
            {dark ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke="#22d3ee" strokeWidth="2" d="M12 17a5 5 0 100-10 5 5 0 000 10z" /><path stroke="#22d3ee" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m16.95-7.05l-1.41 1.41M6.34 17.66l-1.41 1.41M17.66 17.66l-1.41-1.41M6.34 6.34L4.93 4.93" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke="#38bdf8" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            )}
          </span>
        </button>
      </aside>

      {/* 모바일 상단바 + Drawer(햄버거) */}
      <header className="fixed md:hidden top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#171a1e] border-b border-blue-100 dark:border-gray-800 flex items-center justify-between px-3 py-3 shadow-lg">
        <Link href="/" aria-label="타요드라이브 메인으로 이동" className="flex items-center">
          <span className="bg-blue-50 rounded-full p-1 shadow mr-2">
            <img src="https://i.ibb.co/j9Q03zry/logo-main.webp" alt="타요드라이브 로고" className="h-8 w-auto" />
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* 다크모드 */}
          <button
            className="text-cyan-600 dark:text-cyan-200 hover:bg-cyan-50 hover:dark:bg-[#232a34] rounded-xl p-2 transition"
            aria-label="다크모드 전환"
            onClick={toggleDark}
          >
            {dark ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke="#22d3ee" strokeWidth="2" d="M12 17a5 5 0 100-10 5 5 0 000 10z" /><path stroke="#22d3ee" strokeWidth="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m16.95-7.05l-1.41 1.41M6.34 17.66l-1.41 1.41M17.66 17.66l-1.41-1.41M6.34 6.34L4.93 4.93" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"><path stroke="#38bdf8" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            )}
          </button>
          {/* 햄버거 메뉴 */}
          <button
            className="ml-2 flex flex-col justify-center items-center w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-100 to-blue-100 shadow border border-blue-100 dark:border-gray-800"
            aria-label="모바일 메뉴 열기"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="block w-7 h-1 bg-cyan-500 rounded mb-1"></span>
            <span className="block w-7 h-1 bg-cyan-500 rounded mb-1"></span>
            <span className="block w-7 h-1 bg-cyan-500 rounded"></span>
          </button>
        </div>
      </header>
      {/* 모바일 Drawer (풀스크린) */}
      <div
        className={classNames(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex md:hidden transition duration-300",
          sidebarOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        onClick={() => setSidebarOpen(false)}
      >
        <nav
          className={classNames(
            "ml-auto w-4/5 max-w-xs h-full bg-white dark:bg-[#232a34] shadow-2xl flex flex-col py-8 px-6 transition-all duration-300",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            className="self-end mb-8 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#28313d] transition"
            aria-label="모바일 메뉴 닫기"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-300" fill="none" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          {/* 메뉴 */}
          <div className="flex flex-col gap-2">
            {NAV.map(item => (
              <Link
                href={item.href}
                key={item.name}
                aria-label={item.name}
                onClick={() => setSidebarOpen(false)}
                className={classNames(
                  "block px-3 py-4 rounded-xl font-bold transition text-lg",
                  pathname.startsWith(item.href)
                    ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200 shadow"
                    : "text-gray-900 dark:text-gray-100 hover:bg-cyan-50 hover:dark:bg-[#2a3242] hover:text-cyan-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link
            href={CTA.href}
            className="block w-full px-4 py-4 mt-10 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-extrabold rounded-xl text-center shadow-lg text-lg hover:from-cyan-300 hover:to-blue-400"
            aria-label={CTA.name}
            onClick={() => setSidebarOpen(false)}
          >
            {CTA.name}
          </Link>
        </nav>
      </div>
      {/* 실제 메인 컨텐츠 (좌측 사이드바 공간 제외) */}
      <main className="flex-1 min-h-screen pt-0 md:pt-0 md:ml-60 bg-white dark:bg-[#191b21] transition-colors duration-300">
        {/* PC에선 좌측 Sidebar 여백 적용 (md:ml-60) */}
        {children}
      </main>
    </div>
  );
}
