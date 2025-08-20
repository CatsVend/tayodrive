// components/admin/AdminLayout.jsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminLayout({ title = "관리자", right = null, children }) {
  const router = useRouter();

  const items = [
    { href: "/admin", label: "관리자홈", icon: "🏠" },
    { href: "/admin/reservations", label: "상담예약목록", icon: "📋" },
    { href: "/admin/reviews", label: "후기목록", icon: "⭐" },
    { href: "/admin/faqs", label: "FAQ", icon: "❓" },
    { href: "/admin/settings", label: "관리자설정", icon: "⚙️" },
    { href: "/admin/sms", label: "SMS관리", icon: "☎️" },
  ];

  const isActive = (href) =>
    router.pathname === href || (href !== "/admin" && router.pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 supports-[backdrop-filter]:backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-start gap-3">
          {/* 로고 */}
          <Link href="/admin" className="flex items-center gap-2 shrink-0" aria-label="관리자 홈">
            <span className="p-1 rounded-full bg-blue-50">
              <img
                src="https://i.ibb.co/j9Q03zry/logo-main.webp"
                alt="타요드라이브 로고"
                className="h-10 w-auto"
              />
            </span>
            <span className="sr-only">타요드라이브 관리자</span>
          </Link>

          {/* 세로 장식 제목 – 데스크탑에서만 표시, 간격 보정 */}
          <span className="admin-vert-deco hidden lg:block text-blue-800/70 font-bold select-none">
            {title}
          </span>

          {/* 우측 툴바(유저보기/CSV 등) */}
          <div className="ml-auto w-full lg:w-auto">
            <div className="flex flex-wrap gap-2 justify-end">{right}</div>
          </div>
        </div>
      </header>

      {/* 본문 & 좌측 사이드 메뉴 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6 p-4">
        {/* 사이드바 */}
        <aside className="md:sticky md:top-[80px] h-max bg-white border rounded-2xl shadow p-3">
          <nav className="space-y-1">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] transition",
                  isActive(it.href)
                    ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200"
                    : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                aria-current={isActive(it.href) ? "page" : undefined}
              >
                <span aria-hidden>{it.icon}</span>
                <span className="font-semibold">{it.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 컨텐츠 */}
        <section className="bg-white rounded-2xl shadow border p-0 md:p-0">
          {children}
        </section>
      </div>

      {/* 세로 장식 충돌 방지 스타일(기능 영향 없음) */}
      <style jsx>{`
        .admin-vert-deco {
          writing-mode: vertical-rl;
          text-orientation: upright;
          line-height: 1.9;      /* 글자 위아래 간격 */
          letter-spacing: .12em; /* 글자 사이 간격 */
          margin-left: .25rem;   /* 로고와 여백 */
        }
        @media (max-width: 1024px) {
          .admin-vert-deco { display: none !important; } /* 모바일/태블릿은 숨김 */
        }
      `}</style>
    </div>
  );
}
