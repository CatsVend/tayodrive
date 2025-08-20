import { useEffect, useMemo, useState } from "react";

const normalizeForInsert = (raw) =>
  Array.from(
    new Set(
      String(raw || "")
        .split(/[\n\r\t ,;\/|]+/)
        .map((v) => v.replace(/\D/g, ""))
        .filter((v) => v.length >= 10 && v.length <= 11)
    )
  );

export default function RecipientStore({ onAppend }) {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  const fetchList = async (search = "") => {
    const r = await fetch(`/api/recipients?search=${encodeURIComponent(search)}`);
    const j = await r.json();
    if (j.ok) setList(j.list || []);
  };

  useEffect(() => { fetchList(""); }, []);

  const add = async () => {
    const phones = normalizeForInsert(input);
    if (!phones.length) return alert("추가할 유효한 번호가 없습니다.");
    const r = await fetch("/api/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers: phones.join(",") }),
    });
    const j = await r.json();
    if (j.ok) {
      setInput("");
      await fetchList(q);
      // 화면의 발송 텍스트에어리어에도 즉시 추가
      onAppend?.(phones);
    } else {
      alert(j.error || "추가 실패");
    }
  };

  const remove = async (id) => {
    if (!confirm("삭제하시겠어요?")) return;
    await fetch(`/api/recipients/${id}`, { method: "DELETE" });
    await fetchList(q);
  };

  const phonesOnly = useMemo(() => list.map((r) => r.phone), [list]);

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="font-bold text-slate-700">저장된 수신번호</div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="번호 입력 (여러개 가능: 줄바꿈/쉼표)"
          className="flex-1 rounded-lg border px-3 py-2"
        />
        <button
          onClick={add}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold"
        >
          추가
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색"
          className="flex-1 rounded-lg border px-3 py-2"
        />
        <button
          onClick={() => fetchList(q)}
          className="px-3 py-2 rounded-lg border"
        >
          검색
        </button>
        <button
          onClick={() => { setQ(""); fetchList(""); }}
          className="px-3 py-2 rounded-lg border"
        >
          초기화
        </button>
      </div>

      <div className="max-h-64 overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">전화번호</th>
              <th className="p-2 w-28">동작</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 font-mono">{r.phone}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 rounded border mr-2"
                    onClick={() => onAppend?.([r.phone])}
                  >
                    선택 삽입
                  </button>
                  <button
                    className="px-2 py-1 rounded border text-red-600"
                    onClick={() => remove(r.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td className="p-3 text-slate-500" colSpan={2}>저장된 번호가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-lg border"
          onClick={() => onAppend?.(phonesOnly)}
        >
          모두 삽입
        </button>
      </div>
    </div>
  );
}
