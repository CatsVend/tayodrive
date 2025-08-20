// pages/faq.jsx
import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import Link from "next/link";

/** 서버 장애시 사용할 폴백 데이터(원문 100%) */
const FALLBACK_FAQS = [
  {
    icon: "❓",
    q: "수강 중 사고가 나면 보험 처리는 어떻게 진행되나요?",
    a: "운전연수차량은 100% 종합보험 가입 및 안전장치가 있어 사고 시 수강생에게 책임을 묻지 않습니다.\n자차 연수의 경우, 본인 차량 보험에서 처리되므로 사전 안내/확인해드립니다.",
  },
  {
    icon: "🌐",
    q: "연수 지역은 어디까지 가능한가요?",
    a: "타요드라이브는 서울/인천/경기/대구/부산 전 지역 방문 연수가 가능합니다.",
  },
  {
    icon: "💳",
    q: "연수 등록 시 직접 방문 접수를 해야 하나요?",
    a: "전화 또는 온라인으로 신청이 가능하며, 상담원과 상담 후 원하시는 시간과 장소로 접수해 드립니다.",
  },
  {
    icon: "💸",
    q: "결제는 어떻게 진행하나요?",
    a: "연수비는 현금 및 계좌 이체로만 결제가 가능합니다.\n현장 결제/영수증 안내도 제공됩니다.",
  },
  {
    icon: "💬",
    q: "강사님이 불친절하면 어떻게 하나요?",
    a: "타요드라이브는 정기적으로 친절교육을 실시하며, 강사 교체/환불도 신속하게 처리합니다.\n불편시 1666-8512 또는 온라인 문의로 즉시 조치 가능합니다.",
  },
  {
    icon: "⏰",
    q: "연수 시간 조정이 자유롭나요?",
    a: "원하시는 시간에 맞춰 진행이 가능하며 사전에 강사님과 상의하여 자유롭게 변경할 수 있습니다.",
  },
  {
    icon: "👩‍🚗",
    q: "여자 강사님에게 받고 싶어요.",
    a: "타요드라이브는 여성 강사와 함께하는 운전 연수도 가능합니다.\n상담시 요청해주시면 배정해드립니다.",
  },
  {
    icon: "📅",
    q: "주말에만 시간이 가능한데 괜찮을까요?",
    a: "평일에 시간이 여의치 않으신 분들을 위해 주말반도 평일반과 똑같이 운영하고 있습니다.",
  },
  {
    icon: "🚗",
    q: "자차로 교육이 가능한가요?",
    a: "네, 가능합니다. 자차차량이 준비 되어있을 경우 상담 시 말씀해 주시면 자차운전 연수로 진행해 드립니다.",
  },
  {
    icon: "📝",
    q: "면허 취득한지 오래됐는데 가능할까요?",
    a: "네, 가능합니다. 베테랑 강사님이 최단시간에 최고의 실력으로 이끌어내 드리겠습니다.",
  },
  {
    icon: "📍",
    q: "원하는 코스로 연수 받을 수 있나요?",
    a: "강사님과 상의 후 원하시는 코스로 운전연수를 진행할 수 있습니다.",
  },
];

export default function FAQ({ faqs, settings }) {
  const [opened, setOpened] = React.useState(-1);
  const handleToggle = (idx) => setOpened((p) => (p === idx ? -1 : idx));
  const { kakaoChannelUrl } = settings || {};

  const renderAnswer = (htmlOrText) => {
    // API는 a를 일반 문자열로 내려줘도 되고, <br/> 포함 HTML로 내려줘도 됨
    const html =
      typeof htmlOrText === "string"
        ? htmlOrText.replace(/\n/g, "<br/>")
        : String(htmlOrText ?? "");
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

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

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4">
        {/* 인트로 + FAQ wave (UI 유지) */}
        <section className="relative faq-gradient rounded-3xl shadow-2xl border mb-16 p-8 md:p-14 overflow-hidden">
          <div
            className="absolute left-0 right-0 top-0"
            style={{
              background: "url('https://svgshare.com/i/17qX.svg') repeat-x",
              height: "44px",
              pointerEvents: "none",
              zIndex: 1,
              animation: "waveMove 17s linear infinite",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-gradient-to-r from-cyan-200 to-blue-200 px-4 py-1 rounded-full text-base font-bold text-blue-800 mb-3 shadow-md">
                자주하는 질문
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-700 mb-4 drop-shadow-xl">
                타요드라이브 FAQ
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-semibold mb-4">
                운전연수, 보험, 강사진, 결제, 지역, 상담 등
                <br />
                고객님이 가장 궁금해하는 내용을 모두 모았습니다.
              </p>
              <ul className="list-disc pl-6 text-base text-gray-800 font-medium">
                <li>보험처리/사고, 결제, 강사 변경, 지역, 일정 등</li>
                <li>
                  1:1 실시간 전화상담:{" "}
                  <span className="font-bold text-blue-700">1666-8512</span>
                </li>
                <li>카카오톡/온라인 문의(하단 안내)</li>
              </ul>
            </div>
            <div className="flex-1 flex flex-col gap-3 items-center">
              <img
                src="/images/99.png"
                alt="상담 일러스트"
                className="w-52 md:w-64 rounded-2xl shadow-2xl border-2 border-cyan-200 mb-2"
              />
              <img
                src="/images/dd2.png"
                alt="고객 문의 일러스트"
                className="w-28 rounded-xl shadow-lg border border-blue-200 md:block hidden"
              />
            </div>
          </div>
        </section>

        <div className="w-[90px] h-1 bg-gradient-to-r from-cyan-300 to-blue-400 rounded mx-auto my-10" />

        {/* FAQ 아코디언 (UI 유지) */}
        <section>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-7">
              <div className="inline-block bg-cyan-50 px-5 py-2 rounded-full font-semibold text-cyan-700 shadow-md">
                <svg
                  className="inline-block w-5 h-5 mr-1 -mt-1 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 6v6m0 4h.01" />
                </svg>
                아래 질문을 클릭하면 답변이 열립니다!
              </div>
            </div>

            <div className="space-y-5">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className={`glass-neon rounded-2xl p-6 accordion transition duration-200 ${
                    opened === i ? "shadow-2xl scale-[1.015]" : ""
                  }`}
                >
                  <button
                    className="flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-cyan-300 group"
                    aria-expanded={opened === i}
                    aria-controls={`faq-content-${i}`}
                    onClick={() => handleToggle(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggle(i);
                      }
                    }}
                  >
                    <span
                      className={`icon-fade mr-3 text-2xl transition ${
                        opened === i ? "text-cyan-500" : ""
                      }`}
                    >
                      {item.icon || "❓"}
                    </span>
                    <span className="flex-1 text-lg font-bold text-blue-800">
                      {item.q}
                    </span>
                    <svg
                      className={`ml-2 w-6 h-6 text-cyan-400 transition-transform ${
                        opened === i ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    id={`faq-content-${i}`}
                    className={`mt-4 text-gray-800 text-base transition-all duration-300 ${
                      opened === i ? "" : "hidden"
                    }`}
                  >
                    {renderAnswer(item.a)}
                  </div>
                </div>
              ))}
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

      {/* 푸터 (UI 유지) */}
      <footer className="bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100 mt-10">
        <img
          src="https://i.ibb.co/jkqYSLMq/logo-footer.webp"
          alt="타요드라이브 푸터 로고"
          className="mx-auto h-10 mb-2"
        />
        <div className="mb-1 font-semibold">
          타요드라이브 | 대표번호 <span className="text-cyan-300">1666-8512</span>
        </div>
        <div className="mb-1">
          COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED
        </div>
        <div className="font-bold text-cyan-200">24시간 무료상담 1666-8512</div>
      </footer>

      {/* 추가 스타일 (글라스, gradient, wave 등) */}
      <style jsx global>{`
        .glass-neon {
          background: rgba(255, 255, 255, 0.89);
          box-shadow: 0 4px 36px 0 #7dd3fc33, 0 0 0 2px #38bdf833;
          backdrop-filter: blur(15px);
          border: 1.5px solid #bae6fd55;
        }
        .accordion {
          transition: box-shadow 0.19s, transform 0.15s;
        }
        .accordion:hover {
          box-shadow: 0 4px 36px 0 #38bdf866, 0 0 0 4px #bae6fd44;
          transform: scale(1.01);
        }
        .faq-gradient {
          background: linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        @keyframes waveMove {
          100% {
            background-position-x: 1400px;
          }
        }
        .icon-fade {
          transition: color 0.17s;
        }
        .icon-fade.open,
        .icon-fade.text-cyan-500 {
          color: #38bdf8;
        }
        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

/** SSR: API에서 FAQ 로드 (실패시 폴백) + 관리자 설정 로드 */
export async function getServerSideProps(context) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `http://${context.req.headers.host}`;

  try {
    const [faqRes, settingsRes] = await Promise.all([
      fetch(`${baseUrl}/api/faqs`, {
        headers: { "Content-Type": "application/json" },
      }),
      fetch(`${baseUrl}/api/settings-public`, {
        headers: { Accept: "application/json" },
      }),
    ]);

    let faqs = FALLBACK_FAQS;
    if (faqRes.ok) {
      const data = await faqRes.json();
      faqs = Array.isArray(data)
        ? data.map((it) => ({
            icon: String(it.icon ?? "❓"),
            q: String(it.q ?? ""),
            a: String(it.a ?? ""),
          }))
        : FALLBACK_FAQS;
    }

    let settings = null;
    if (settingsRes.ok) settings = await settingsRes.json();

    return { props: { faqs, settings } };
  } catch (e) {
    return { props: { faqs: FALLBACK_FAQS, settings: null } };
  }
}
