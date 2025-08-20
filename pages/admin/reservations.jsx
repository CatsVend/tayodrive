// pages/admin/reservations.jsx
import Head from "next/head";
import cookie from "cookie";
import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useRef, useState } from "react";

/* 어떤 응답이 와도 배열로 정규화 */
const toArray = (j) =>
  Array.isArray(j) ? j :
  Array.isArray(j.items) ? j.items :
  Array.isArray(j.reservations) ? j.reservations :
  Array.isArray(j.data) ? j.data : [];

/* 한국시간 짧은 포맷 */
const formatKST = (iso) => {
  const v = iso ? new Date(iso) : null;
  if (!v || Number.isNaN(v.getTime())) return "-";
  const y = String(v.getFullYear()).slice(2);
  const mm = String(v.getMonth()+1).padStart(2,"0");
  const dd = String(v.getDate()).padStart(2,"0");
  const hh = String(v.getHours()).padStart(2,"0");
  const mi = String(v.getMinutes()).padStart(2,"0");
  return `${y}.${mm}.${dd} ${hh}:${mi}`;
};

/* ✅ 상태값 → 배지 색상 클래스 */
const statusBadgeClass = (status) => {
  const s = String(status || "상담신청중");
  if (s.includes("완료"))   return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (s.includes("취소"))   return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (s.includes("확인"))   return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  // 기본(신청중 등)
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
};

/* 한 줄 말줄임 셀 */
function CellTrunc({ children, titleText }) {
  const text = children == null ? "" : String(children);
  return <div className="truncate" title={titleText ?? text}>{text || "-"}</div>;
}

/* Toolbar */
function Toolbar({ onExport, onAppend, onReplace }) {
  return (
    <div className="admin-toolbar grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-2">
      <a href="/reviews" target="_blank" className="btn-soft !bg-blue-50 !text-blue-700">유저 페이지 보기</a>
      <button onClick={onExport} className="btn-soft !bg-cyan-500 !text-white">CSV 내보내기</button>
      <label className="btn-soft cursor-pointer !bg-indigo-500 !text-white">
        CSV 불러오기(추가)
        <input type="file" accept=".csv" className="hidden" onChange={onAppend}/>
      </label>
      <label className="btn-soft cursor-pointer !bg-rose-500 !text-white">
        CSV 불러오기(대체)
        <input type="file" accept=".csv" className="hidden" onChange={onReplace}/>
      </label>
    </div>
  );
}

/* ─────────────────────────────
   데스크톱 행(수정 모드 지원)
────────────────────────────── */
function DesktopRow({ r, busy, onChangeStatus, onDelete, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(r);
  const [openMemo, setOpenMemo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setD(r), [r.id]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const save = async () => {
    await onUpdate(r.id, {
      name: d.name || "", gender: d.gender || "", phone: d.phone || "",
      carType: d.carType || "", region: d.region || "", memo: d.memo || "",
    });
    setEdit(false);
  };

  return (
    <>
      <tr className="border-t align-middle h-12">
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.name || ""} onChange={e=>setD(o=>({...o, name:e.target.value}))}/>
          : <CellTrunc>{r.name}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.gender || ""} onChange={e=>setD(o=>({...o, gender:e.target.value}))}/>
          : <CellTrunc>{r.gender}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.phone || ""} onChange={e=>setD(o=>({...o, phone:e.target.value}))}/>
          : <CellTrunc>{r.phone}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.carType || ""} onChange={e=>setD(o=>({...o, carType:e.target.value}))}/>
          : <CellTrunc>{r.carType}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.region || ""} onChange={e=>setD(o=>({...o, region:e.target.value}))}/>
          : <CellTrunc>{r.region}</CellTrunc>}
        </td>

        {/* 메모: 미리보기 + 자세히 */}
        <td className="px-3 py-2">
          {edit ? (
            <textarea rows={3} className="w-full border rounded px-2 py-1" value={d.memo || ""} onChange={e=>setD(o=>({...o, memo:e.target.value}))}/>
          ) : (
            <div className="flex items-center gap-2">
              <CellTrunc titleText={r.memo}>{r.memo}</CellTrunc>
              {r.memo && r.memo.length > 0 && (
                <button className="link-sm" onClick={()=>setOpenMemo(true)}>자세히</button>
              )}
            </div>
          )}
        </td>

        {/* ✅ 상태 배지: 색상 자동 분기 */}
        <td className="px-3 py-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusBadgeClass(r.status)}`}
          >
            {r.status || "상담신청중"}
          </span>
        </td>

        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
          {formatKST(r.createdAt || r.updatedAt)}
        </td>

        {/* 관리: 드롭다운으로 접기 */}
        <td className="px-3 py-2 relative">
          {!edit ? (
            <div className="flex justify-end">
              <button className="btn-icon" onClick={()=>setMenuOpen(v=>!v)} aria-label="관리">⋯</button>
              {menuOpen && (
                <div ref={menuRef} className="action-menu">
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); setEdit(true); }} className="action-item">✏️ 수정</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onChangeStatus(r.id,"상담확인"); }} className="action-item">확인</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onChangeStatus(r.id,"상담완료됨"); }} className="action-item">완료</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onChangeStatus(r.id,"상담취소"); }} className="action-item">취소</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onDelete(r.id); }} className="action-item text-rose-600 hover:bg-rose-50">삭제</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-1">
              <button disabled={busy} onClick={save} className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">저장</button>
              <button disabled={busy} onClick={()=>{ setD(r); setEdit(false); }} className="px-2 py-1 rounded bg-slate-400 text-white text-xs">취소</button>
            </div>
          )}
        </td>
      </tr>

      {/* 메모 모달 */}
      {openMemo && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpenMemo(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,92vw)] max-h-[80vh] overflow-auto bg-white rounded-2xl shadow-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">메모 전체보기</h3>
              <button className="px-3 py-1.5 rounded bg-slate-700 text-white" onClick={()=>setOpenMemo(false)}>닫기</button>
            </div>
            <div className="whitespace-pre-wrap leading-7 text-[15px] text-slate-800">{r.memo || "-"}</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────
   모바일 카드 (기능 동일)
────────────────────────────── */
function MobileCard({ r, busy, onChangeStatus, onDelete, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState(r);

  useEffect(() => setD(r), [r.id]);

  const save = async () => {
    await onUpdate(r.id, {
      name: d.name || "", gender: d.gender || "", phone: d.phone || "",
      carType: d.carType || "", region: d.region || "", memo: d.memo || "",
    });
    setEdit(false);
  };

  if (!edit) {
    return (
      <div className="border-t first:border-t-0 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-extrabold text-slate-900 text-base">{r.name || "-"}</div>
            <div className="mt-1 text-[12px] text-slate-500">신청시각: {formatKST(r.createdAt || r.updatedAt)}</div>
            <div className="mt-1 text-[13px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
              <span><b className="text-slate-800">성별</b> {r.gender || "-"}</span>
              <span className="whitespace-nowrap"><b className="text-slate-800">전화</b> {r.phone || "-"}</span>
              <span><b className="text-slate-800">차종</b> {r.carType || "-"}</span>
              <span><b className="text-slate-800">지역</b> {r.region || "-"}</span>
            </div>
          </div>
          {/* ✅ 모바일도 같은 색상 규칙 적용 */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusBadgeClass(r.status)}`}
          >
            {r.status || "상담신청중"}
          </span>
        </div>

        {r.memo && (
          <div className="mt-2 text-[15px] text-slate-800 whitespace-pre-wrap leading-7">
            {!open ? <div className="line-clamp-5">{r.memo}</div> : r.memo}
          </div>
        )}
        {r.memo && r.memo.length > 120 && (
          <button className="mt-1 text-cyan-700 text-sm font-semibold" onClick={() => setOpen(v=>!v)}>
            {open ? "메모 접기" : "메모 더보기"}
          </button>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <button disabled={busy} onClick={()=>setEdit(true)} className="px-3 py-1.5 rounded bg-slate-600 text-white">수정</button>
          <button disabled={busy} onClick={()=>onChangeStatus(r.id,"상담확인")} className="px-3 py-1.5 rounded bg-blue-600 text-white">확인</button>
          <button disabled={busy} onClick={()=>onChangeStatus(r.id,"상담완료됨")} className="px-3 py-1.5 rounded bg-emerald-600 text-white">완료</button>
          <button disabled={busy} onClick={()=>onChangeStatus(r.id,"상담취소")} className="px-3 py-1.5 rounded bg-amber-600 text-white">취소</button>
          <button disabled={busy} onClick={()=>onDelete(r.id)} className="px-3 py-1.5 rounded bg-rose-600 text-white">삭제</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t first:border-t-0 p-3">
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-3 py-2" value={d.name || ""} placeholder="이름" onChange={e=>setD(o=>({...o, name:e.target.value}))}/>
        <input className="border rounded px-3 py-2" value={d.gender || ""} placeholder="성별" onChange={e=>setD(o=>({...o, gender:e.target.value}))}/>
        <input className="border rounded px-3 py-2" value={d.phone || ""} placeholder="전화번호" onChange={e=>setD(o=>({...o, phone:e.target.value}))}/>
        <input className="border rounded px-3 py-2" value={d.carType || ""} placeholder="차종" onChange={e=>setD(o=>({...o, carType:e.target.value}))}/>
        <input className="border rounded px-3 py-2 col-span-2" value={d.region || ""} placeholder="지역" onChange={e=>setD(o=>({...o, region:e.target.value}))}/>
      </div>
      <textarea rows={4} className="mt-2 w-full border rounded px-3 py-2" value={d.memo || ""} placeholder="메모" onChange={e=>setD(o=>({...o, memo:e.target.value}))}/>
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={busy} onClick={save} className="px-3 py-1.5 rounded bg-emerald-600 text-white">저장</button>
        <button disabled={busy} onClick={()=>{ setD(r); setEdit(false); }} className="px-3 py-1.5 rounded bg-slate-400 text-white">취소</button>
      </div>
    </div>
  );
}

export default function AdminReservations({ initial, baseUrl }) {
  const [rows, setRows] = useState(() => toArray(initial || []));
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  // 페이지네이션 상태
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const viewRows = rows.slice(start, start + PAGE_SIZE);

  // 데이터 수 변동 시 현재 페이지 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh() {
    try {
      setLoading(true);
      const r = await fetch("/api/admin/reservations", { headers: { Accept: "application/json" } });
      const d = await r.json().catch(() => []);
      const arr = toArray(d);
      setRows(arr);
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function del(id){
    if (!confirm("삭제하시겠습니까?")) return;
    setBusy(true);
    try{
      await fetch(`/api/admin/reservations?id=${encodeURIComponent(id)}`, { method:"DELETE" });
      await refresh();
    } finally { setBusy(false); }
  }

  async function changeStatus(id, status){
    setBusy(true);
    try{
      await fetch("/api/admin/reservations", {
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ id, status })
      });
      await refresh();
    } finally { setBusy(false); }
  }

  async function updateReservation(id, patch){
    setBusy(true);
    try{
      await fetch("/api/admin/reservations", {
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ id, ...patch })
      });
      await refresh();
    } finally { setBusy(false); }
  }

  // CSV 내보내기
  async function exportCsv(){
    try{
      const res = await fetch("/api/admin/reservations-csv", { credentials: "same-origin" });
      if(!res.ok){
        const t = await res.text().catch(()=> "");
        alert("CSV 내보내기 실패" + (t ? `: ${t}` : ""));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reservations.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch(err){ alert("CSV 내보내기 중 오류"); }
  }

  const onCsvPick = (mode) => async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setBusy(true);
    try{
      const r = await fetch("/api/admin/reservations-import", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ csv:text, mode })
      });
      if (!r.ok) throw new Error("import failed");
      await refresh();
    } finally { setBusy(false); e.target.value = ""; }
  };

  // 페이지네이션 바 컴포넌트
  const Pager = () => (
    <div className="px-4 py-3 flex items-center justify-between border-t bg-white">
      <div className="text-sm text-slate-500">총 {total}건 · {page}/{totalPages}페이지</div>
      <div className="flex items-center gap-1">
        <button className="pg-btn" disabled={page===1} onClick={()=>setPage(1)}>{'«'}</button>
        <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>{'‹'}</button>
        {
          Array.from({length: totalPages}, (_,i)=>i+1)
            .filter(p => p===1 || p===totalPages || Math.abs(p-page)<=2)
            .reduce((acc,p)=>{
              if(acc.prev && p-acc.prev>1) acc.out.push(<span key={'d'+p} className="px-1 text-slate-400">…</span>);
              acc.out.push(
                <button key={p} className={`pg-btn ${p===page ? 'pg-active' : ''}`} onClick={()=>setPage(p)}>{p}</button>
              );
              acc.prev=p; return acc;
            }, {prev:0,out:[]}).out
        }
        <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>{'›'}</button>
        <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>{'»'}</button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>관리자 | 상담예약목록</title></Head>
      <AdminLayout
        title="상담예약목록"
        right={<Toolbar onExport={exportCsv} onAppend={onCsvPick("append")} onReplace={onCsvPick("replace")} />}
      >
        <div className="p-4">
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            {/* 데스크톱 표 */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                {/* 고정 레이아웃 + 각 컬럼 너비 지정 */}
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 w-[12%]">이름</th>
                      <th className="px-3 py-2 w-[8%]">성별</th>
                      <th className="px-3 py-2 w-[14%]">전화번호</th>
                      <th className="px-3 py-2 w-[10%]">차종</th>
                      <th className="px-3 py-2 w-[10%]">지역</th>
                      <th className="px-3 py-2">메모</th>
                      <th className="px-3 py-2 w-[10%]">상태</th>
                      <th className="px-3 py-2 w-[16%]">신청시각</th>
                      <th className="px-3 py-2 w-[80px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} className="text-center text-gray-500 py-10">불러오는 중…</td></tr>
                    ) : viewRows.length === 0 ? (
                      <tr><td colSpan={9} className="text-center text-gray-500 py-10">데이터가 없습니다.</td></tr>
                    ) : (
                      viewRows.map(r=>(
                        <DesktopRow
                          key={r.id}
                          r={r}
                          busy={busy}
                          onChangeStatus={changeStatus}
                          onDelete={del}
                          onUpdate={updateReservation}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* 데스크톱 페이지바 */}
              <Pager />
            </div>

            {/* 모바일 카드 목록 */}
            <div className="md:hidden">
              {loading ? (
                <div className="py-10 text-center text-gray-500">불러오는 중…</div>
              ) : viewRows.length === 0 ? (
                <div className="py-10 text-center text-gray-500">데이터가 없습니다.</div>
              ) : (
                viewRows.map((r) => (
                  <MobileCard
                    key={r.id}
                    r={r}
                    busy={busy}
                    onChangeStatus={changeStatus}
                    onDelete={del}
                    onUpdate={updateReservation}
                  />
                ))
              )}
              {/* 모바일 페이지바 */}
              <Pager />
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* 경량 전용 스타일 */}
      <style jsx global>{`
        .btn-soft {
          display:inline-flex;justify-content:center;align-items:center;
          border-radius:12px;padding:6px 12px;font-weight:600;line-height:1.2;
          box-shadow:0 1px 2px rgba(0,0,0,.05);
          border:1px solid rgba(203,213,225,.6);background:#fff;color:#0f172a;
        }
        .link-sm { font-size:12px; color:#0ea5e9; text-decoration:underline; }
        .btn-icon {
          width:32px;height:32px;border-radius:8px;background:#334155;color:#fff;
          display:inline-flex;align-items:center;justify-content:center;font-size:18px;
        }
        .btn-icon:hover { background:#1f2937; }
        .action-menu {
          position:absolute; right:0; top:100%; margin-top:6px; z-index:50;
          background:#fff; border:1px solid rgba(0,0,0,.06); border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,.12); padding:6px; min-width:120px;
        }
        .action-item {
          display:block; width:100%; text-align:left; font-size:12px;
          padding:8px 10px; border-radius:8px;
        }
        .action-item:hover { background:#f8fafc; }

        /* 페이지네이션 버튼 */
        .pg-btn{
          min-width:32px; height:32px; padding:0 6px;
          border-radius:8px; font-size:12px; font-weight:600;
          background:#f1f5f9; color:#0f172a; border:1px solid #e2e8f0;
        }
        .pg-btn:hover{ background:#e2e8f0; }
        .pg-btn:disabled{ opacity:.5; cursor:not-allowed; }
        .pg-active{ background:#0ea5e9 !important; color:#fff !important; border-color:#0ea5e9 !important; }

        @media (max-width: 767px) { .admin-vert-deco { display:none!important; } }
      `}</style>
    </>
  );
}

export async function getServerSideProps(ctx){
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  const token = cookies["admin_token"] || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return { redirect:{ destination:"/admin/login", permanent:false } };
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  const r = await fetch(`${baseUrl}/api/admin/reservations`, {
    headers:{ Cookie: ctx.req.headers.cookie || "", Accept: "application/json" }
  });

  const normalize = (j) =>
    Array.isArray(j) ? j :
    Array.isArray(j.items) ? j.items :
    Array.isArray(j.reservations) ? j.reservations :
    Array.isArray(j.data) ? j.data : [];

  const initialRaw = r.ok ? await r.json() : [];
  const initial = normalize(initialRaw);

  return { props:{ initial, baseUrl } };
}
