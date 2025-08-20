// pages/pricing.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import HeaderNav from "../components/HeaderNav";

/* ─────────────────────────────────────────
   Micro atoms
────────────────────────────────────────── */
const FloatingBadge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-4 py-1 text-[12px] font-extrabold text-sky-800 ring-1 ring-sky-100 shadow-sm">
    {children}
  </span>
);

const StatChip = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 px-3 py-1 text-[12px] font-bold text-sky-700 ring-1 ring-sky-100">
    {children}
  </span>
);

const Bullet = ({ icon, children }) => (
  <li className="flex items-start gap-3 text-[15px] text-slate-700">
    <span className="mt-[2px] inline-grid h-6 w-6 place-items-center rounded-full ring-1 ring-sky-100 bg-white shadow">
      <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-[15px] font-extrabold text-transparent">
        {icon}
      </span>
    </span>
    <span>{children}</span>
  </li>
);

/* ─────────────────────────────────────────
   Header offset helper (겹침 방지 + 앵커 오프셋)
────────────────────────────────────────── */
function useHeaderOffset() {
  const [h, setH] = useState(80);
  useEffect(() => {
    const getH = () => {
      const el = document.querySelector("header, [role='banner'], nav");
      const hh = Math.max(64, Math.min(128, el?.getBoundingClientRect?.().height || 80));
      document.documentElement.style.setProperty("--hdrH", `${hh}px`);
      setH(hh);
    };
    getH();
    window.addEventListener("resize", getH);
    return () => window.removeEventListener("resize", getH);
  }, []);
  return h;
}

/* ─────────────────────────────────────────
   Segmented (라디오 그룹)
────────────────────────────────────────── */
function SegmentedSelector({ value, onChange }) {
  const items = [
    { id: "own", label: "본인 차량 연수", icon: "🚗" },
    { id: "academy", label: "회사 차량 연수", icon: "🚘" },
  ];
  const [ann, setAnn] = useState("");

  const handle = (id) => {
    onChange(id);
    setAnn(id === "own" ? "본인 차량 연수 선택됨" : "회사 차량 연수 선택됨");
    const anchor = document.getElementById("pricing-grid");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <fieldset className="mx-auto mt-6 w-full max-w-[760px]">
      <legend className="sr-only">연수 유형 선택</legend>
      <p className="mb-2 text-[12px] text-slate-500 text-center">
        유형을 선택하면 <b>아래 카드/비교표</b>가 선택에 맞게 바뀝니다.
      </p>

      {/* mobile */}
      <div role="radiogroup" aria-label="연수 유형 선택" className="grid grid-cols-1 gap-2 sm:hidden">
        {items.map((it) => {
          const active = value === it.id;
          return (
            <label
              key={it.id}
              className={`h-12 rounded-xl cursor-pointer ring-1 ring-sky-100 bg-white flex items-center justify-center gap-2 font-extrabold text-[15px] ${
                active ? "shadow-[0_10px_28px_rgba(2,132,199,.18)]" : "hover:bg-sky-50"
              }`}
            >
              <input
                type="radio"
                name="lesson-type"
                value={it.id}
                checked={active}
                onChange={() => handle(it.id)}
                className="sr-only"
              />
              <span aria-hidden>{it.icon}</span>
              <span className={active ? "text-sky-900" : "text-sky-800"}>{it.label}</span>
              {active && (
                <span className="ml-2 rounded-full bg-sky-50 px-2 py-[2px] text-[11px] font-bold text-sky-700">선택됨</span>
              )}
            </label>
          );
        })}
      </div>

      {/* desktop */}
      <div
        role="radiogroup"
        aria-label="연수 유형 선택"
        className="hidden sm:grid grid-cols-2 rounded-2xl bg-white p-1 ring-1 ring-sky-100 shadow-[0_8px_36px_rgba(2,132,199,.10)] sticky"
        style={{ top: "calc(var(--hdrH,80px) + 28px)", zIndex: 30 }}
      >
        {items.map((it) => {
          const active = value === it.id;
          return (
            <label
              key={it.id}
              className="relative h-12 rounded-xl cursor-pointer grid place-items-center font-extrabold text-sm focus-within:ring-2 ring-sky-300"
            >
              <input
                type="radio"
                name="lesson-type-desktop"
                value={it.id}
                checked={active}
                onChange={() => handle(it.id)}
                className="sr-only"
              />
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 shadow-[0_10px_28px_rgba(2,132,199,.22)]"
                />
              )}
              <span className={`flex items-center gap-2 ${active ? "text-white" : "text-sky-800 hover:text-sky-900"}`}>
                <span aria-hidden>{it.icon}</span>
                {it.label}
              </span>
            </label>
          );
        })}
      </div>

      <span aria-live="polite" className="sr-only">
        {ann}
      </span>
    </fieldset>
  );
}

/* ─────────────────────────────────────────
   LuxeCard — image(단일) + images(배열) 지원
────────────────────────────────────────── */
function LuxeCard({
  ribbon,
  image,
  images,
  title,
  prices = [],
  note,
  bullets = [],
  href = "/apply",
  accent = "sky",
  selected = false,
}) {
  const grad = accent === "cyan" ? "from-cyan-500 to-sky-500" : "from-sky-500 to-cyan-400";
  const list = Array.isArray(images) && images.length ? images : image ? [image] : [];

  return (
    <section aria-label={title} className="group relative will-change-transform">
      <div
        className={`relative rounded-[22px] ring-1 ring-sky-100 p-[1px] before:absolute before:inset-0 before:-z-10 before:rounded-[22px] before:bg-[conic-gradient(var(--tw-gradient-stops))] before:from-sky-200 before:via-cyan-200 before:to-sky-200 ${
          selected ? "shadow-[0_40px_100px_rgba(56,189,248,.22)]" : "shadow-[0_14px_48px_rgba(2,132,199,.10)]"
        }`}
      >
        <div className="relative rounded-[20px] bg-white p-6 md:p-7">
          {ribbon && (
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 px-3 py-[6px] text-[11px] font-extrabold text-white shadow ring-1 ring-white/50">
                {ribbon}
              </span>
            </div>
          )}
          {selected && (
            <div className="absolute -top-3 right-5 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-[6px] text-[11px] font-extrabold text-sky-700 ring-1 ring-sky-100 animate-pulse-soft">
                ✅ 선택됨
              </span>
            </div>
          )}

          <div className={list.length > 1 ? "grid grid-cols-2 gap-3 place-items-center" : "relative mx-auto w-fit"}>
            {list.map((it, i) => {
              const src = typeof it === "string" ? it : it?.src;
              const alt = typeof it === "string" ? "" : it?.alt ?? "";
              const w = typeof it === "object" && it?.w ? it.w : 160;
              const h = typeof it === "object" && it?.h ? it.h : 160;
              return (
                <Image
                  key={i}
                  src={src}
                  alt={alt}
                  width={w}
                  height={h}
                  priority
                  unoptimized
                  className="rounded-2xl ring-1 ring-sky-100 shadow-[0_16px_40px_rgba(2,132,199,.10)] object-cover"
                />
              );
            })}
          </div>

          <h3 className="mt-4 text-center text-[20px] md:text-[22px] font-extrabold tracking-tight text-sky-900">
            {title}
          </h3>

          <ul className="mt-1 text-center text-[15px] text-slate-700">
            {prices.map((p, i) => (
              <li key={i} className="leading-relaxed">
                {p.label} :{" "}
                <b className="text-sky-900 underline decoration-sky-200/70 underline-offset-2">{p.value}</b>
              </li>
            ))}
          </ul>
          {note && <p className="mt-1 text-center text-xs text-slate-500">{note}</p>}

          <ul className="mt-5 space-y-2">
            {bullets.map((b, i) => (
              <Bullet key={i} icon={b.icon}>
                {b.text}
              </Bullet>
            ))}
          </ul>

          <div className="mt-7">
            <Link href={href} className="block">
              <button
                className={`relative h-12 w-full overflow-hidden rounded-2xl bg-gradient-to-r ${grad} text-white font-extrabold shadow-2xl ring-1 ring-white/40 transition-transform active:scale-[.99]`}
                aria-label={`${title} 신청하기`}
              >
                <span className="relative z-10">연수 신청하기</span>
                <span className="cta-shine" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Compare
────────────────────────────────────────── */
function Compare() {
  const rows = useMemo(
    () => [
      ["가격(10시간)", "자차(중형) 290,000원 / SUV 290,000원", "연수차(중형) 320,000원 / SUV 340,000원"],
      ["차량", "고객님 차량", "학원 차량(안전장치 장착)"],
      ["포함", "집 앞 픽업 · 실전 위주", "주차/차선변경/도심·고속"],
      ["보장", "강사 교체/환불 보장", "강사 교체/환불 보장"],
      ["사고 시", "학원 100% 처리(자차 연수 중 사고 발생 시)", "학원 100% 처리"],
      ["추가비용", "유료주차/톨비 외 없음", "유료주차/톨비 외 없음"],
    ],
    []
  );

  return (
    <>
      {/* mobile */}
      <div className="md:hidden mt-10 space-y-3">
        {rows.map(([label, a, b], idx) => (
          <div key={idx} className="rounded-2xl bg-white ring-1 ring-sky-100 p-4 shadow-[0_10px_28px_rgba(2,132,199,.06)]">
            <div className="text-[13px] font-extrabold text-sky-800">{label}</div>
            <dl className="mt-2 grid grid-cols-1 gap-2">
              <div className="rounded-xl bg-sky-50/60 p-3">
                <dt className="text-[12px] font-bold text-sky-700">본인 차량 연수</dt>
                <dd className="text-[14px] text-slate-800 leading-6">{a}</dd>
              </div>
              <div className="rounded-xl bg-cyan-50/60 p-3">
                <dt className="text-[12px] font-bold text-sky-700">회사 차량 연수</dt>
                <dd className="text-[14px] text-slate-800 leading-6">{b}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* desktop */}
      <div className="hidden md:block mt-10 overflow-hidden rounded-2xl ring-1 ring-sky-100 bg-white">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-900">
            <tr>
              <th className="px-6 py-4 font-extrabold w-[22%]">항목</th>
              <th className="px-6 py-4 font-extrabold">본인 차량 연수</th>
              <th className="px-6 py-4 font-extrabold">회사 차량 연수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-t border-sky-100 ${i % 2 ? "bg-sky-50/40" : "bg-white"} hover:bg-sky-50/70`}>
                <th className="px-6 py-[18px] font-extrabold text-sky-800">{r[0]}</th>
                <td className="px-6 py-[18px] leading-[1.7] text-slate-800">{r[1]}</td>
                <td className="px-6 py-[18px] leading-[1.7] text-slate-800">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Page
────────────────────────────────────────── */
export default function Pricing({ settings }) {
  const { kakaoChannelUrl } = settings || {};

  const heroRef = useRef(null);
  const footerRef = useRef(null);
  const [tab, setTab] = useState("own");
  const [sticky, setSticky] = useState(false);
  const [hideNearFooter, setHideNearFooter] = useState(false);
  const hdrH = useHeaderOffset();

  useEffect(() => {
    const io = new IntersectionObserver((entries) => setSticky(!entries[0].isIntersecting), { threshold: 0.2 });
    const el = document.getElementById("hero-sentinel");
    if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => setHideNearFooter(entries[0].isIntersecting), { threshold: 0 });
    io.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const CTA_HEIGHT_WITH_MARGIN = 88;
      setHideNearFooter(rect.top <= window.innerHeight - CTA_HEIGHT_WITH_MARGIN);
    };
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="bg-white text-slate-900 antialiased min-h-screen flex flex-col">
      <Head>
        <title>연수비용 | 타요드라이브</title>
        <meta
          name="description"
          content="타요드라이브 운전연수비용 안내 – 전국 1:1 방문연수, 투명한 가격정책, 강사진 교체/환불 보장, 추가비용 無. 1666-8512"
        />
        <meta property="og:title" content="연수비용 | 타요드라이브" />
        <meta
          property="og:description"
          content="타요드라이브 운전연수비용 안내 – 전국 1:1 방문연수, 투명한 가격정책, 강사진 교체/환불 보장, 추가비용 無."
        />
        {/* OG 이미지는 외부 링크 유지(페이지 렌더엔 영향 없음) */}
        <meta property="og:image" content="https://i.ibb.co/YB6RFC95/apply-img03.webp" />
      </Head>

      {/* NAV + 여백 */}
      <HeaderNav />
      <div style={{ height: `calc(var(--hdrH, ${hdrH}px) + 28px)` }} aria-hidden />

      {/* HERO */}
      <section className="relative" ref={heroRef}>
        <div id="hero-sentinel" className="absolute top-0 h-2 w-2" aria-hidden />
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <FloatingBadge>투명한 가격 · 전국 1:1 방문연수</FloatingBadge>
            <h1 className="mt-3 bg-gradient-to-br from-sky-900 via-sky-700 to-cyan-600 bg-clip-text text-[clamp(30px,5.2vw,56px)] font-extrabold leading-[1.05] text-transparent tracking-[-0.02em]">
              연수비용 안내
            </h1>
            <p className="mt-2 text-[15px] md:text-[16px] font-medium text-slate-600">
              전국 어디서나 동일한 투명한 가격, 최고의 강사진, 추가비용 없는 안심 운전연수
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <StatChip>학원 보험 100% 처리</StatChip>
              <StatChip>강사 교체/환불 보장</StatChip>
              <StatChip>집 앞 픽업 · 실전 위주</StatChip>
            </div>

            {/* 라디오형 세그먼트 */}
            <SegmentedSelector value={tab} onChange={setTab} />

            {/* hero visual */}
            <div className="relative mt-8">
              <div className="pointer-events-none absolute -inset-6 rounded-[38px] bg-white/45 blur-lg" />
              <Image
                src="/images/ee1.png"
                alt="연수비용 대표 이미지"
                width={720}
                height={430}
                priority
                unoptimized
                className="relative z-10 rounded-[28px] border border-sky-100 object-cover shadow-[0_24px_72px_rgba(2,132,199,.16)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section id="pricing-grid" className="relative mt-10" style={{ scrollMarginTop: "calc(var(--hdrH, 80px) + 36px)" }}>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-sky-50/50" />
        <div className="mx-auto max-w-6xl px-4 pb-18 md:pb-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 본인 차량 연수: 가로 2장 */}
            <div>
              <LuxeCard
                ribbon="인기"
                images={[
                  { src: "/images/pricing02.webp", alt: "본인 차량 연수 1" },
                  { src: "/images/pricing04.webp", alt: "회사 차량 연수 2" },
                ]}
                title="본인 차량 연수"
                prices={[
                  { label: "자차(중형) 10시간", value: "290,000원" },
                  { label: "자차(SUV) 10시간", value: "290,000원" },
                ]}
                note="고객님 차량으로 연수 진행"
                bullets={[
                  { icon: "🏁", text: "집 앞 픽업 · 실전 위주 주행" },
                  { icon: "🛡️", text: "수업 중 사고 시 학원 100% 처리" },
                  { icon: "🔄", text: "강사 교체/환불 보장" },
                ]}
                href="/apply"
                accent="sky"
                selected={tab === "own"}
              />
            </div>

            {/* 회사 차량 연수: 가로 2장 */}
            <div>
              <LuxeCard
                ribbon="추천"
                images={[
                  { src: "/images/pricing01.webp", alt: "본인 차량 연수 1" },
                  { src: "/images/pricing03.webp", alt: "회사 차량 연수 2" },
                ]}
                title="회사 차량 연수"
                prices={[
                  { label: "연수차량(중형) 10시간", value: "320,000원" },
                  { label: "연수차량(SUV) 10시간", value: "340,000원" },
                ]}
                note="학원 차량으로 연수 진행"
                bullets={[
                  { icon: "🧷", text: "안전장치 장착 차량 · 초보 맞춤" },
                  { icon: "🅿️", text: "주차/차선변경/도심·고속도로" },
                  { icon: "⚡", text: "실력·자신감 빠른 향상" },
                ]}
                href="/apply"
                accent="cyan"
                selected={tab === "academy"}
              />
            </div>
          </div>

          {/* 비교표 */}
          <Compare />

          {/* 안내/유의사항 */}
          <div className="mt-10 rounded-[20px] border border-sky-100 bg-white p-6 md:p-7 shadow-[0_18px_60px_rgba(2,132,199,.08)]">
            <h3 className="text-[18px] font-extrabold text-sky-900">※ 안내 및 유의사항</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <Bullet icon="🛡️">
                연수차량으로 연수 중 사고 발생 시 <b>수강생 부담금 없이 학원 100% 처리</b>
              </Bullet>
              <Bullet icon="✅">
                유료주차장/고속도로 통행료 외 <span className="font-bold text-sky-700">추가비용 없음</span>
              </Bullet>
              <Bullet icon="♻️">강사 불친절 시 <b>책임 교체/환불 보장</b></Bullet>
              <Bullet icon="⏱️">연수시간 추가 시 반드시 타요드라이브에 접수</Bullet>
              <Bullet icon="🚗">연수차량 2일(5h)+자차 2일(5h) 혼합 가능</Bullet>
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-4 ring-1 ring-sky-100">
              <div className="font-bold text-sky-800">💡 결제 안내</div>
              <p className="mt-1 text-sm text-slate-600">
                연수 시작 첫날 <b>현금/계좌이체</b> 결제만 가능 · 추가 연수 및 시간 변경은 반드시 사전 접수 필요
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="text-lg font-semibold text-sky-700">24시간 무료 상담전화</span>
            <a
              href="tel:16668512"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-8 text-xl font-extrabold text-white shadow-[0_18px_60px_rgba(2,132,199,.18)] hover:from-sky-500 hover:to-cyan-500 focus-visible:outline-none focus-visible:ring-2 ring-white/70"
              aria-label="무료 상담전화 걸기"
            >
              1666-8512
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer ref={footerRef} className="mt-auto bg-[#3a3e45] py-8 text-center text-sm text-gray-100">
        <img src="https://i.ibb.co/jkqYSLMq/logo-footer.webp" alt="타요드라이브 푸터 로고" className="mx-auto mb-2 h-10" />
        <div className="mb-1 font-semibold">
          타요드라이브 | 대표번호 <span className="text-cyan-300">1666-8512</span>
        </div>
        <div className="mb-1">COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED</div>
        <div className="font-bold text-cyan-200">24시간 무료상담 1666-8512</div>
      </footer>

      {/* ▽ 플로팅 배너: 푸터 접근 시 자동 숨김 (다른 기능 일절 변경 없음) */}
      <div
        className={`fixed right-4 bottom-6 z-50 flex flex-col items-center space-y-3 transition-all duration-300 ${
          hideNearFooter ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100"
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

      {/* STICKY CTA (기존 동작 유지) */}
      <div
        role="region"
        aria-label="빠른 신청 바로가기"
        className="fixed bottom-4 left-1/2 z-40 w-[min(680px,92vw)] -translate-x-1/2 rounded-2xl bg-white/95 backdrop-blur-xl ring-1 ring-sky-100 shadow-[0_18px_60px_rgba(2,132,199,.16)] p-3 flex items-center gap-3 transition-transform duration-300 will-change-transform"
        style={{
          transform: sticky && !hideNearFooter ? "translate(-50%,0)" : "translate(-50%,120%)",
          pointerEvents: sticky && !hideNearFooter ? "auto" : "none",
        }}
        aria-hidden={!(sticky && !hideNearFooter)}
      >
        <div className="hidden sm:flex items-center gap-3 px-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold ring-1 ring-white/50">
            ₩
          </span>
          <div className="text-[13px] leading-tight">
            <div className="font-extrabold text-sky-900">{tab === "own" ? "본인 차량 연수" : "회사 차량 연수"}</div>
            <div className="text-slate-600">지금 바로 상담 또는 신청</div>
          </div>
        </div>
        <a
          href="tel:16668512"
          className="h-12 flex-1 rounded-xl bg-white text-sky-700 font-extrabold ring-1 ring-sky-200 hover:bg-sky-50 active:scale-[.99] grid place-items-center"
          aria-label="1666-8512로 전화걸기"
        >
          상담 1666-8512
        </a>
        <Link
          href="/apply"
          className="h-12 flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-extrabold ring-1 ring-white/40 hover:from-sky-500 hover:to-cyan-500 active:scale-[.99] grid place-items-center"
          aria-label="연수 신청 페이지로 이동"
        >
          연수 신청하기
        </Link>
      </div>

      {/* Global effects */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
        .cta-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.5) 30%, transparent 62%);
          transform: translateX(-130%);
          animation: shine 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
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
        .animate-pulse-soft {
          animation: pulseSoft 3.2s ease-in-out infinite;
        }
        @keyframes pulseSoft {
          0%,
          100% {
            opacity: 0.9;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-1px);
          }
        }
      `}</style>
    </main>
  );
}

/* ───────── SSR: 관리자 설정(kakaoChannelUrl) 주입 ───────── */
export async function getServerSideProps(ctx) {
  const host = ctx?.req?.headers?.host || "localhost:3000";
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://${host}`;

  let settings = null;
  try {
    const res = await fetch(`${origin}/api/settings-public`, { headers: { Accept: "application/json" } });
    if (res.ok) settings = await res.json();
  } catch {
    settings = null;
  }
  return { props: { settings } };
}
