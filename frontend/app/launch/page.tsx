"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LaunchContent() {
  const params = useSearchParams();

  useEffect(() => {
    const iss = params.get("iss");
    const launch = params.get("launch");

    if (!iss) return;

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
    const qs = new URLSearchParams({
      response_type: "code",
      client_id: "demo-smart-app",
      redirect_uri: `${window.location.origin}/callback`,
      scope: "launch/patient patient/*.read openid fhirUser",
      state: crypto.randomUUID(),
      aud: iss,
      ...(launch ? { launch } : {}),
    });

    window.location.href = `${API}/smart/authorize?${qs}`;
  }, [params]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="text-4xl mb-4">🚀</div>
      <h2 className="text-lg font-semibold mb-2">SMART Launch</h2>
      <p className="text-gray-500 text-sm">正在初始化 SMART on FHIR 啟動流程...</p>
    </div>
  );
}

export default function LaunchPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-400">Loading...</div>}>
      <LaunchContent />
    </Suspense>
  );
}
