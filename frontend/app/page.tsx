"use client";
import { useEffect, useState, useCallback, useRef, ChangeEvent } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";

interface Patient {
  id: string;
  name?: { text: string }[];
  gender?: string;
  birthDate?: string;
}

interface SyncLog {
  id: string;
  status: "running" | "success" | "failed";
  patient_id: string | null;
  message: string | null;
  created_at: string;
  completed_at: string | null;
}

const RESOURCE_LINKS: { key: string; label: string }[] = [
  { key: "Observation", label: "檢驗" },
  { key: "MedicationRequest", label: "處方" },
  { key: "Condition", label: "診斷" },
  { key: "AllergyIntolerance", label: "過敏" },
  { key: "DiagnosticReport", label: "報告" },
  { key: "Procedure", label: "處置" },
  { key: "Encounter", label: "就診" },
];

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);

  // Import/export state
  const [importMsg, setImportMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPatients = useCallback(async () => {
    const res = await fetch(`${API}/fhir/Patient`);
    const data = await res.json();
    setPatients(data.entry?.map((e: { resource: Patient }) => e.resource) ?? []);
  }, []);

  const fetchLogs = useCallback(async () => {
    const res = await fetch(`${API}/sync/logs`);
    setLogs(await res.json());
  }, []);

  const clearLogs = useCallback(async () => {
    if (!confirm("確定要清除全部同步歷史紀錄？（FHIR 資料不會被刪除）")) return;
    await fetch(`${API}/sync/logs`, { method: "DELETE" });
    await fetchLogs();
  }, [fetchLogs]);

  const deleteLog = useCallback(async (id: string) => {
    // Per-row delete on the history card's ✕ button. Optimistic UI:
    // strip the row locally first so the dashboard feels instant,
    // then re-fetch in case anything else changed server-side.
    setLogs((prev) => prev.filter((l) => l.id !== id));
    await fetch(`${API}/sync/logs/${id}`, { method: "DELETE" });
    await fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchPatients();
    fetchLogs();
  }, [fetchPatients, fetchLogs]);

  // ── Export ───────────────────────────────────────────────────────────

  const exportBundle = async (patientId?: string, patientName?: string) => {
    const url = patientId
      ? `${API}/fhir/export?patient=${encodeURIComponent(patientId)}`
      : `${API}/fhir/export`;
    const res = await fetch(url);
    if (!res.ok) { alert("Export 失敗: " + res.status); return; }
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    link.download = patientId
      ? `fhir_${patientId}_${date}.json`
      : `fhir_all_${date}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // ── Import ───────────────────────────────────────────────────────────

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg(null);
    try {
      const text = await file.text();
      JSON.parse(text); // validate before sending
      const res = await fetch(`${API}/fhir/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.detail ?? JSON.stringify(result));
      setImportMsg({ text: `✅ 匯入成功：${result.imported} 筆資源（略過 ${result.skipped} 筆）`, ok: true });
      await fetchPatients();
    } catch (err) {
      setImportMsg({ text: `❌ 匯入失敗：${err instanceof Error ? err.message : String(err)}`, ok: false });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const wipePatient = async (patientId: string, patientName?: string) => {
    const label = patientName ? `${patientName} (${patientId})` : patientId;
    if (!confirm(
      `確定要刪除 ${label} 的所有 FHIR 資料嗎？\n\n` +
      `這會清掉 Patient + Observations + MedicationRequests + DiagnosticReports + ` +
      `Encounters + Procedures + Allergies + Conditions。動作無法 undo。\n\n` +
      `通常用於：清理舊版 sync 留下的重複資料；之後再重新 sync 一次拿到乾淨的版本。`
    )) return;
    try {
      const res = await fetch(`${API}/sync/patient/${encodeURIComponent(patientId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? JSON.stringify(data));
      alert(`✅ 已刪除 ${data.deleted} 筆 FHIR 資源（${label}）。可以重新 sync 了。`);
      await fetchPatients();
    } catch (err) {
      alert(`❌ 刪除失敗：${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const launchSmartApp = async (patientId?: string) => {
    const launchUrl = "https://voho0000.github.io/medical-note-smart-on-fhir/smart/launch";
    let launchToken = crypto.randomUUID();
    if (patientId) {
      try {
        const res = await fetch(`${API}/smart/launch-context`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patient_id: patientId }),
        });
        if (res.ok) {
          const data = await res.json();
          launchToken = data.launch;
        }
      } catch {
        // fall back to default launch context
      }
    }
    const params = new URLSearchParams({ iss: `${API}/fhir`, launch: launchToken });
    window.open(`${launchUrl}?${params}`, "_blank", "noopener");
  };

  return (
    <div className="space-y-6">
      {/* FHIR Patients */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            FHIR Patients
            <span className="ml-2 text-sm text-gray-400 font-normal">({patients.length})</span>
          </h2>
          {patients.length > 0 && (
            <button
              onClick={() => exportBundle()}
              className="text-xs text-gray-500 hover:text-emerald-700 transition flex items-center gap-1"
              title="匯出全部病人的 FHIR Bundle JSON"
            >
              📦 全部匯出
            </button>
          )}
        </div>

        {patients.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400">
            尚無 FHIR 資料 — 用 Chrome 擴充功能從健保存摺同步，或匯入現有 Bundle
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patients.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {p.name?.[0]?.text ?? p.id}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span className="font-mono">{p.id}</span>
                      <span className="mx-1.5">·</span>
                      {p.gender === "male" ? "男" : p.gender === "female" ? "女" : "—"}
                      <span className="mx-1.5">·</span>
                      {p.birthDate ?? "—"}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    <button
                      onClick={() => exportBundle(p.id, p.name?.[0]?.text)}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      title={`匯出 ${p.name?.[0]?.text ?? p.id} 的 FHIR Bundle`}
                    >
                      📦 Export
                    </button>
                    <button
                      onClick={() => launchSmartApp(p.id)}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                      title={`用 ${p.name?.[0]?.text ?? p.id} 開啟 SMART App`}
                    >
                      🚀 Launch
                    </button>
                    <button
                      onClick={() => wipePatient(p.id, p.name?.[0]?.text)}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
                      title={`刪除 ${p.name?.[0]?.text ?? p.id} 的所有 FHIR 資料（清重複用）`}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {RESOURCE_LINKS.map(({ key, label }) => (
                    <a
                      key={key}
                      href={`${API}/fhir/${key}?patient=${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-blue-600 hover:underline"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Import FHIR Bundle */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-gray-900">匯入 FHIR Bundle</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            上傳先前匯出的 JSON 檔案，或任何 FHIR Bundle / 單一 resource。已存在的資源會被覆蓋更新。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer
              ${importing
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
          >
            {importing ? (
              <><span className="animate-spin">⏳</span> 匯入中…</>
            ) : (
              <>📂 選擇 JSON 檔案</>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              disabled={importing}
              onChange={handleImportFile}
            />
          </label>
          <span className="text-xs text-gray-400">支援 FHIR Bundle、單一 resource、或 resource 陣列</span>
        </div>

        {importMsg && (
          <div
            className={`mt-3 px-3 py-2 rounded text-sm border ${
              importMsg.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {importMsg.text}
          </div>
        )}
      </section>

      {/* Sync History — populated by the NHI extension flow via
          POST /sync/log on completion. The `message` column is a JSON
          blob with patient_name / total / breakdown / date_range /
          elapsed_ms, parsed and rendered as a multi-line history card. */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            同步歷史
            <span className="ml-2 text-sm text-gray-400 font-normal">({logs.length})</span>
          </h2>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              className="text-xs text-gray-400 hover:text-red-500 transition"
              title="清除同步歷史紀錄（不影響 FHIR 資料）"
            >
              🗑️ 清除歷史
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white border rounded-lg p-4">
            尚無同步紀錄 — 用 Chrome 擴充功能同步後，歷史會出現在這
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => {
              // Defensive parse — NHI extension rows have JSON in
              // `message`; older rows may have plain text.
              let details: {
                patient_name?: string;
                total?: number;
                breakdown?: string[];
                date_range?: string;
                elapsed_ms?: number;
                errors?: string[];
              } | null = null;
              if (log.message) {
                try {
                  const parsed = JSON.parse(log.message);
                  if (parsed && typeof parsed === "object") details = parsed;
                } catch {
                  /* legacy plain-text message — fall back to bare render */
                }
              }
              const elapsed = details?.elapsed_ms
                ? details.elapsed_ms < 60_000
                  ? `${(details.elapsed_ms / 1000).toFixed(1)}s`
                  : `${Math.floor(details.elapsed_ms / 60_000)}m${Math.round((details.elapsed_ms % 60_000) / 1000)}s`
                : null;
              const statusBadge =
                log.status === "running" ? { text: "⏳ 進行中", cls: "bg-amber-100 text-amber-700" }
                : log.status === "success" ? { text: "✓ 成功", cls: "bg-green-100 text-green-700" }
                : log.status === "partial" ? { text: "⚠ 部分成功", cls: "bg-amber-100 text-amber-700" }
                : { text: "✗ 失敗", cls: "bg-red-100 text-red-700" };
              return (
                <div key={log.id} className="group bg-white border rounded-lg p-3 text-sm relative">
                  {/* Row 1: status badge + patient + timestamp + delete */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded ${statusBadge.cls}`}>
                      {statusBadge.text}
                    </span>
                    {log.patient_id && (
                      <span className="font-mono text-xs text-gray-700">{log.patient_id}</span>
                    )}
                    {details?.patient_name && (
                      <span className="text-xs text-gray-600">· {details.patient_name}</span>
                    )}
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleString("zh-TW", {
                        year: "numeric", month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    {/* Per-row delete — hidden until hover so the card stays
                        calm in the resting state. */}
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-500 text-xs leading-none px-1"
                      title="刪除此筆歷史"
                      aria-label="刪除此筆歷史"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Row 2: range · duration · total */}
                  {details ? (
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                      {details.date_range && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                          📅 {details.date_range}
                        </span>
                      )}
                      {elapsed && <span>⏱ {elapsed}</span>}
                      {typeof details.total === "number" && (
                        <span>📦 {details.total.toLocaleString()} 筆</span>
                      )}
                    </div>
                  ) : log.message ? (
                    <div className="mt-1 text-xs text-gray-500 truncate">{log.message}</div>
                  ) : null}
                  {/* Row 3: breakdown detail (collapsed) */}
                  {details?.breakdown && details.breakdown.length > 0 && (
                    <details className="mt-1.5">
                      <summary className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer select-none">
                        查看明細
                      </summary>
                      <div className="mt-1 px-2 py-1.5 bg-gray-50 rounded text-[11px] font-mono text-gray-600 leading-relaxed break-words">
                        {details.breakdown.join(" · ")}
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Developer tools */}
      <section className="border-t pt-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Developer Tools
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <a
            href={`${API}/fhir/metadata`}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 transition"
          >
            CapabilityStatement
          </a>
          <a
            href={`${API}/smart/.well-known/smart-configuration`}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 transition"
          >
            SMART Configuration
          </a>
          <a
            href={`${API}/docs`}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-blue-700 transition"
          >
            API Docs (Swagger)
          </a>
          <a
            href={`${API}/fhir/export`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded text-emerald-700 transition"
          >
            Export All (raw JSON)
          </a>
        </div>
      </section>
    </div>
  );
}
