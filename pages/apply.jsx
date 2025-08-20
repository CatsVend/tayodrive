// pages/apply.jsx
import React, { useState } from "react";
import HeaderNav from "../components/HeaderNav";
import Link from "next/link";

export default function Apply() {
  // 폼 상태 및 유효성
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    car: "",
    area: "",
    content: "",
    agree: false,
  });
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 입력값 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 유효성 검사
  const validate = () => {
    let e = {};
    if (!form.name.trim()) e.name = "이름을 입력하세요.";
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone)) e.phone = "올바른 휴대폰 번호 형식으로 입력하세요.";
    if (!form.gender) e.gender = "성별을 선택하세요.";
    if (!form.car) e.car = "차량 보유 여부를 선택하세요.";
    if (!form.area.trim()) e.area = "지역을 입력하세요.";
    if (!form.agree) e.agree = "개인정보 처리방침 동의는 필수입니다.";
    return e;
  };

  // 제출 (실제 연동 버전)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    setError(eObj);
    if (Object.keys(eObj).length > 0) return;

    setLoading(true);
    try {
      // 서버에서 기대하는 키로 매핑
      const payload = {
        name: form.name,
        gender: form.gender,
        phone: form.phone,
        carType: form.car,   // car -> carType로 전달
        region: form.area,   // area -> region로 전달
        memo: form.content,  // content -> memo로 전달
        status: "상담신청중",
      };

      const r = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error("submit failed");
      // 성공 시 완료 화면
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("신청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 제출 후 안내 모달
  if (submitted) {
    return (
      <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
        <div className="fixed top-0 w-full bg-white z-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:px-6">
            <Link href="/" className="p-1 rounded-full bg-blue-50">
              <img src="https://i.ibb.co/j9Q03zry/logo-main.webp" alt="타요드라이브 로고" className="h-10 w-auto"/>
            </Link>
            <nav className="flex items-center flex-wrap gap-1">
              <Link href="/about" className="px-3 py-2 ...">회사소개</Link>
              <Link href="/areas" className="px-3 py-2 ...">연수가능지역</Link>
              <Link href="/programs" className="px-3 py-2 ...">연수프로그램</Link>
              <Link href="/faq" className="px-3 py-2 ...">자주하는 질문</Link>
              <Link href="/reviews" className="px-3 py-2 ...">운전연수후기</Link>
              <Link href="/pricing" className="px-3 py-2 ...">연수비용</Link>
              <Link href="/apply" className="px-4 py-2 ...">온라인연수신청</Link>
            </nav>
          </div>
        </div>

        <main className="pt-28 pb-20 max-w-2xl mx-auto flex-1 px-4 flex flex-col items-center justify-center">
          <div className="glassmorph-card rounded-3xl shadow-2xl border p-10 text-center animate-fade-in">
            <img src="/images/x1.png" alt="상담 완료" className="w-24 mx-auto mb-6 rounded-full shadow-lg border-2 border-cyan-200"/>
            <div className="text-2xl font-extrabold text-blue-700 mb-2">상담 신청이 완료되었습니다!</div>
            <div className="text-gray-800 mb-2">담당 상담원이 <b>10분 내로 전화 안내</b>를 드릴 예정입니다.</div>
<Link href="/" className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold shadow-md text-lg transition hover:from-cyan-300 hover:to-blue-400">
              메인으로 이동
            </Link>
          </div>
        </main>
        <Footer />
        <style jsx global>{fadeGlass}</style>
      </main>
    );
  }

  return (
    <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <HeaderNav />

      {/* 본문 */}
      <main className="pt-28 pb-20 flex-1 max-w-2xl mx-auto w-full px-4">
        <section className="mb-10 text-center">
          <span className="inline-block bg-gradient-to-r from-cyan-200 to-blue-200 px-4 py-1 rounded-full text-base font-bold text-blue-800 mb-3 shadow-md">온라인 연수신청</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-700 mb-4 drop-shadow-xl">상담 신청</h1>
          <p className="text-lg md:text-xl text-gray-700 font-semibold mb-5">상담 신청 후 <span className="text-blue-700 font-bold">10분 내 상담원이 전화</span> 드립니다.</p>
        </section>

        {/* 이미지 박스 */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <img src="/images/apply_img01.webp" alt="상담1" className="w-24 h-24 rounded-2xl shadow border-cyan-100"/>
          <img src="/images/apply_img04.webp" alt="상담2" className="w-24 h-24 rounded-2xl shadow border-cyan-100"/>
          <img src="/images/care_img01.0c726e06.png" alt="상담3" className="w-24 h-24 rounded-2xl shadow border-cyan-100"/>
        </div>

        {/* 상담 신청 폼 */}
        <form onSubmit={handleSubmit} className="glassmorph-card rounded-3xl shadow-2xl border p-10 animate-fade-in" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 고객명 */}
            <div>
              <label htmlFor="name" className="block font-bold mb-2 text-blue-700">고객명</label>
              <input
                type="text" id="name" name="name" autoComplete="name"
                className={`w-full px-4 py-3 rounded-lg border-2 ${error.name ? "border-red-400" : "border-cyan-200"} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                placeholder="이름을 입력하세요"
                value={form.name} onChange={handleChange} aria-required="true" aria-invalid={!!error.name}
              />
              {error.name && <div className="text-red-500 text-xs mt-1">{error.name}</div>}
            </div>

            {/* 연락처 */}
            <div>
              <label htmlFor="phone" className="block font-bold mb-2 text-blue-700">연락처</label>
              <input
                type="text" id="phone" name="phone" inputMode="tel"
                className={`w-full px-4 py-3 rounded-lg border-2 ${error.phone ? "border-red-400" : "border-cyan-200"} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                placeholder="ex) 010-1234-5678"
                value={form.phone} onChange={handleChange} aria-required="true" aria-invalid={!!error.phone}
              />
              {error.phone && <div className="text-red-500 text-xs mt-1">{error.phone}</div>}
            </div>

            {/* 성별 */}
            <div>
              <label className="block font-bold mb-2 text-blue-700">성별</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="여자" checked={form.gender === "여자"} onChange={handleChange} className="accent-cyan-500" />
                  여자
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" value="남자" checked={form.gender === "남자"} onChange={handleChange} className="accent-blue-500" />
                  남자
                </label>
              </div>
              {error.gender && <div className="text-red-500 text-xs mt-1">{error.gender}</div>}
            </div>

            {/* 차량 */}
            <div>
              <label className="block font-bold mb-2 text-blue-700">차량</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input type="radio" name="car" value="자차" checked={form.car === "자차"} onChange={handleChange} className="accent-cyan-500" />
                  자차
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="car" value="희망" checked={form.car === "희망"} onChange={handleChange} className="accent-blue-500" />
                  차량 희망
                </label>
              </div>
              {error.car && <div className="text-red-500 text-xs mt-1">{error.car}</div>}
            </div>

            {/* 지역 */}
            <div className="md:col-span-2">
              <label htmlFor="area" className="block font-bold mb-2 text-blue-700">지역</label>
              <input
                type="text" id="area" name="area"
                className={`w-full px-4 py-3 rounded-lg border-2 ${error.area ? "border-red-400" : "border-cyan-200"} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                placeholder="ex) 서울시"
                value={form.area} onChange={handleChange} aria-required="true" aria-invalid={!!error.area}
              />
              {error.area && <div className="text-red-500 text-xs mt-1">{error.area}</div>}
            </div>

            {/* 문의내용 */}
            <div className="md:col-span-2">
              <label htmlFor="content" className="block font-bold mb-2 text-blue-700">문의내용 (선택)</label>
              <textarea
                id="content" name="content" rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="궁금하신 점을 자유롭게 남겨주세요"
                value={form.content} onChange={handleChange}
              />
            </div>

            {/* 개인정보 동의 */}
            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="agree" name="agree" checked={form.agree} onChange={handleChange}
                className="accent-cyan-500 scale-125" aria-required="true"/>
              <label htmlFor="agree" className="text-sm font-medium text-gray-800 select-none">
                <span className="font-bold text-cyan-700">개인정보 처리방침에 동의합니다</span> (필수)
                <a href="#" className="text-blue-500 underline ml-2" tabIndex={-1}>[자세히보기]</a>
              </label>
            </div>
            {error.agree && <div className="md:col-span-2 text-red-500 text-xs mt-1">{error.agree}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full py-4 px-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full font-bold text-lg shadow-lg transition hover:from-cyan-300 hover:to-blue-400 disabled:opacity-60"
          >
            {loading ? "전송 중..." : "상담신청"}
          </button>
        </form>
      </main>

      <Footer />
      <style jsx global>{fadeGlass}</style>
    </main>
  );
}

// 푸터 컴포넌트
function Footer() {
  return (
    <footer className="bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100 mt-10">
      <img src="https://i.ibb.co/jkqYSLMq/logo-footer.webp" alt="타요드라이브 푸터 로고" className="mx-auto h-10 mb-2"/>
      <div className="mb-1 font-semibold">타요드라이브 | 대표번호 <span className="text-cyan-300">1666-8512</span></div>
      <div className="mb-1">COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED</div>
      <div className="font-bold text-cyan-200">24시간 무료상담 1666-8512</div>
    </footer>
  );
}

// 스타일: Glass/애니메이션 등
const fadeGlass = `
  .animate-fade-in { animation: fadeIn 1.1s cubic-bezier(.4,0,.2,1) both; }
  @keyframes fadeIn { from {opacity:0;transform:translateY(60px);} to {opacity:1;transform:translateY(0);} }
  .glassmorph-card { backdrop-filter: blur(12px); background: rgba(255,255,255,0.93);}
`;
async function onSubmit(e){
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const payload = {
    name:   form.get("name")   || form.get("이름") || "",
    gender: form.get("gender") || form.get("성별") || "",
    phone:  form.get("phone")  || form.get("전화") || form.get("전화번호") || "",
    carType:form.get("car")    || form.get("차종") || "",
    region: form.get("area")   || form.get("지역") || "",
    memo:   form.get("content")|| form.get("문의내용") || ""
  };

  try {
    const r = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const j = await r.json().catch(()=> ({}));
    if (!r.ok) {
      alert(`신청 실패 (${r.status}) : ${j?.error || '잠시 후 다시 시도해주세요.'}`);
      return;
    }
    alert("상담 신청이 접수되었습니다! 빠르게 연락드릴게요.");
    e.currentTarget.reset();
  } catch (err) {
    alert("네트워크 오류: 잠시 후 다시 시도해주세요.");
  }
}

