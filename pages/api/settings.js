// pages/admin/settings.jsx
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

function token() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('tayo_admin_token') || '';
}

export default function AdminSettings() {
  const [s, setS] = useState(null);
  const [changed, setChanged] = useState(false);

  async function load() {
    const r = await fetch('/api/settings');
    setS(await r.json());
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const r = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(s)
    });
    if (r.ok) { setChanged(false); alert('저장되었습니다'); }
  }

  if (!s) return <AdminLayout title="관리자설정"><div>불러오는 중…</div></AdminLayout>;

  return (
    <AdminLayout title="관리자설정">
      <div className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold">사이트 타이틀</label>
          <input className="w-full border rounded-lg px-3 py-2"
                 value={s.siteTitle} onChange={e=>{setS({...s,siteTitle:e.target.value});setChanged(true);}} />
        </div>
        <div>
          <label className="block text-sm font-semibold">사이트 설명</label>
          <textarea rows={4} className="w-full border rounded-lg px-3 py-2"
                 value={s.siteDescription} onChange={e=>{setS({...s,siteDescription:e.target.value});setChanged(true);}} />
        </div>
        <div>
          <label className="block text-sm font-semibold">카카오톡 채널 URL</label>
          <input className="w-full border rounded-lg px-3 py-2"
                 value={s.kakaoUrl} onChange={e=>{setS({...s,kakaoUrl:e.target.value});setChanged(true);}} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">연락처</label>
          {s.contacts?.map((c,i)=>(
            <div key={c.id} className="flex gap-2 mb-2">
              <input className="border rounded px-2 py-1 w-32" value={c.label}
                     onChange={e=>{const cs=[...s.contacts]; cs[i]={...cs[i],label:e.target.value}; setS({...s,contacts:cs}); setChanged(true);}}/>
              <input className="border rounded px-2 py-1 flex-1" value={c.value}
                     onChange={e=>{const cs=[...s.contacts]; cs[i]={...cs[i],value:e.target.value}; setS({...s,contacts:cs}); setChanged(true);}}/>
              <button className="px-3 py-1 bg-red-500 text-white rounded-md"
                      onClick={()=>{const cs=[...s.contacts]; cs.splice(i,1); setS({...s,contacts:cs}); setChanged(true);}}>삭제</button>
            </div>
          ))}
          <button className="px-3 py-1 border rounded-md"
                  onClick={()=>{const cs=[...(s.contacts||[])]; cs.push({id:Date.now(),label:'항목',value:''}); setS({...s,contacts:cs}); setChanged(true);}}>연락처 추가</button>
        </div>

        <div className="pt-4">
          <button disabled={!changed} onClick={save}
                  className={`px-4 py-2 rounded-lg font-bold ${changed? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            변경사항 저장
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
