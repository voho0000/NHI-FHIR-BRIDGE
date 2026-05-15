"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthorizeContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "approved" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const clientId = params.get("client_id");
    const redirectUri = params.get("redirect_uri");
    const scope = params.get("scope");
    const state = params.get("state");
    const codeChallenge = params.get("code_challenge");
    const codeChallengeMethod = params.get("code_challenge_method");

    if (!clientId || !redirectUri) {
      setStatus("error");
      setMessage("缺少必要參數 client_id 或 redirect_uri");
      return;
    }

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010";
    const qs = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope ?? "patient/*.read",
      ...(state ? { state } : {}),
      ...(codeChallenge ? { code_challenge: codeChallenge } : {}),
      ...(codeChallengeMethod ? { code_challenge_method: codeChallengeMethod } : {}),
    });

    setMessage(`正在授權 ${clientId}，即將跳轉...`);
    window.location.href = `${API}/smart/authorize?${qs}`;
  }, [params]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      {status === "loading" && (
        <div>
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-lg font-semibold mb-2">SMART on FHIR 授權中</h2>
          <p className="text-gray-500 text-sm">{message || "處理中..."}</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">授權失敗</h2>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}

export default function AuthorizePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-400">Loading...</div>}>
      <AuthorizeContent />
    </Suspense>
  );
}
