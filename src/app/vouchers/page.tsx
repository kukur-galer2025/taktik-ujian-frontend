"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tag, Loader2, Percent, DollarSign, Clock, CheckCircle2,
  XCircle, Copy, Check, ArrowLeft, Gift, Sparkles
} from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function VouchersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [userRes, voucherRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/vouchers/available"),
        ]);
        setUser(userRes.data);
        setVouchers(voucherRes.data);
      } catch (err) {
        console.error(err);
        // If voucher endpoint doesn't exist yet, just show user
        try {
          const token = localStorage.getItem("token");
          if (!token) { router.push("/login"); return; }
          const userRes = await axios.get("/api/user");
          setUser(userRes.data);
        } catch {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try { await axios.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const isExpired = (v: any) => v.expires_at && new Date(v.expires_at) < new Date();
  const isMaxed = (v: any) => v.max_uses && v.used_count >= v.max_uses;
  const isValid = (v: any) => v.is_active && !isExpired(v) && !isMaxed(v);

  const formatExpiry = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Promo Voucher...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-500/20 rounded-2xl flex items-center justify-center">
                <Gift size={24} className="text-brand-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black">Promo & Voucher 🎁</h1>
                <p className="text-slate-400 text-sm">Salin kode, hemat lebih banyak!</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-lg">
              Gunakan kode voucher di bawah ini saat checkout untuk mendapatkan diskon spesial pada paket bundle pilihanmu.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/bundles" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Bundle
          </Link>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            {vouchers.filter(isValid).length} voucher aktif
          </span>
        </div>

        {vouchers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-brand-100 rounded-full animate-pulse opacity-50" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                <Sparkles size={48} className="text-slate-300" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">Belum Ada Promo Aktif</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
              Pantau terus halaman ini! Tim kami akan mengadakan promo spesial secara berkala.
            </p>
            <Link
              href="/bundles"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-brand-500/20"
            >
              Lihat Paket Bundle
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((v, i) => {
              const valid = isValid(v);
              const expired = isExpired(v);
              const maxed = isMaxed(v);
              const copied = copiedCode === v.code;

              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
                    valid
                      ? "border-slate-100 hover:border-brand-200 hover:shadow-md"
                      : "border-slate-100 opacity-60"
                  }`}
                >
                  {/* Ticket perforations (decorative) */}
                  <div className="flex">
                    {/* Left color bar */}
                    <div className={`w-2 shrink-0 ${
                      v.discount_type === "percentage" ? "bg-brand-500" : "bg-emerald-500"
                    }`} />

                    <div className="flex-1 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Code + discount info */}
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            v.discount_type === "percentage"
                              ? "bg-brand-50 text-brand-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {v.discount_type === "percentage"
                              ? <Percent size={22} />
                              : <DollarSign size={22} />
                            }
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono font-black text-lg text-slate-900 tracking-widest">
                                {v.code}
                              </span>
                              {valid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 size={10} /> Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                                  <XCircle size={10} /> {expired ? "Kedaluwarsa" : maxed ? "Habis" : "Nonaktif"}
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-slate-700 text-sm">
                              Diskon{" "}
                              <span className={`font-black text-base ${
                                v.discount_type === "percentage" ? "text-brand-600" : "text-emerald-600"
                              }`}>
                                {v.discount_type === "percentage"
                                  ? `${v.discount_value}%`
                                  : formatRupiah(v.discount_value)}
                              </span>
                            </p>
                            <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-400">
                              {v.min_purchase > 0 && (
                                <span>Min. {formatRupiah(v.min_purchase)}</span>
                              )}
                              {v.max_uses && (
                                <span className="flex items-center gap-1">
                                  <Tag size={10} /> Sisa {v.max_uses - v.used_count}/{v.max_uses}
                                </span>
                              )}
                              {v.expires_at && (
                                <span className="flex items-center gap-1">
                                  <Clock size={10} /> s/d {formatExpiry(v.expires_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Copy button */}
                        {valid && (
                          <button
                            onClick={() => handleCopy(v.code)}
                            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                              copied
                                ? "bg-emerald-500 text-white"
                                : "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 hover:-translate-y-0.5"
                            }`}
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? "Tersalin!" : "Salin Kode"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Banner */}
        {vouchers.some(isValid) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-brand-500/20"
          >
            <div>
              <p className="font-black text-lg mb-1">Siap berhemat? 🎉</p>
              <p className="text-brand-100 text-sm">Salin kode di atas dan gunakan saat checkout bundle.</p>
            </div>
            <Link
              href="/bundles"
              className="shrink-0 bg-white text-brand-700 hover:bg-brand-50 font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg text-sm"
            >
              Lihat Bundle →
            </Link>
          </motion.div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
