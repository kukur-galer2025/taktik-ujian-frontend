"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Save the token
      localStorage.setItem("token", token);
      
      // Force user fetch
      refreshUser().then(() => {
        router.push("/dashboard");
      });
    } else {
      router.push("/login?error=auth_failed");
    }
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-brand-500 mb-4" size={48} />
      <h2 className="text-xl font-bold text-slate-800">Menyelesaikan proses login...</h2>
      <p className="text-slate-500 mt-2">Mohon tunggu sebentar, Anda akan dialihkan ke Dashboard.</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={48} />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
