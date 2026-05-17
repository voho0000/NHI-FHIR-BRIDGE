"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/dashboard-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "登入失敗");
      }
      const next = params.get("next") || "/";
      router.push(next);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-base font-semibold mb-1">Dashboard 登入</h2>
        <p className="text-xs text-gray-500 mb-4">
          這台機器設定了 <code>DASHBOARD_PASSWORD</code>，請輸入密碼後使用。
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {err && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
              {err}
            </div>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full px-4 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {busy ? "驗證中…" : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
