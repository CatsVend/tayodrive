// pages/admin/settings.jsx
import Head from "next/head";
import cookie from "cookie";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminSettings({ initial }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (r.ok) setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally { setBusy(false); }
  };

  return (
    <>
      <Head><title>관리자 설정</title></Head>
      <AdminLayout title="관리자 설정">
        <form onSubmit={save} className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
          <section className="bg-white rounded-2xl shadow border p-4 md:p-6">
            <h2 className="font-extrabold text-xl text-blue-800 mb-3">카카오톡 채널</h2>
            <input
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://pf.kakao.com/...."
              value={form.kakaoChannelUrl}
              onChange={e=>setForm({...form, kakaoChannelUrl:e.target.value})}
            />
            <p className="text-sm text-gray-500 mt-2">
              유저 페이지의 “카카오톡 상담하기” 버튼 링크로 반영됩니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow border p-4 md:p-6">
            <h2 className="font-extrabold text-xl text-blue-800 mb-3">메타태그</h2>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mb-3"
              value={form.metaTitle}
              onChange={e=>setForm({...form, metaTitle:e.target.value})}
            />
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full border rounded-lg px-3 py-2"
              value={form.metaDescription}
              onChange={e=>setForm({...form, metaDescription:e.target.value})}
            />
            <p className="text-sm text-gray-500 mt-2">
              각 페이지가 기본적으로 이 메타를 사용합니다. (페이지별 커스텀 Head가 있으면 그 값을 우선)
            </p>
          </section>

          <div className="flex justify-end gap-2">
            <button
              disabled={busy}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold disabled:opacity-50">
              저장
            </button>
            {saved && <span className="text-emerald-600 font-bold self-center">저장됨</span>}
          </div>
        </form>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  if (!process.env.ADMIN_TOKEN || cookies.admin_token !== process.env.ADMIN_TOKEN) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  const r = await fetch(`${base}/api/admin/settings`, { headers: { Cookie: ctx.req.headers.cookie } });
  const initial = r.ok ? await r.json() : { kakaoChannelUrl:"", metaTitle:"", metaDescription:"" };
  return { props: { initial } };
}
