"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CtaButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="inline-flex justify-center items-center gap-2 bg-brand-600/50 text-white px-10 py-5 rounded-2xl font-black text-xl w-64 h-16 animate-pulse">
      </div>
    );
  }

  if (user) {
    return (
      <Link
        href={user.role === 'admin' ? '/admin' : '/dashboard'}
        className="inline-flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1"
      >
        Ke Dashboard Saya
        <ArrowRight size={24} />
      </Link>
    );
  }

  return (
    <Link
      href="/register"
      className="inline-flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1"
    >
      Daftar Sekarang Gratis
      <ArrowRight size={24} />
    </Link>
  );
}
