"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tag, Loader2, Percent, DollarSign, Clock, CheckCircle2,
  XCircle, Copy, Check, ArrowLeft, Gift, Sparkles, Scissors
} from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/context/AuthContext";

export default function VouchersPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voucherRes = await axios.get("/api/vouchers/available");
        setVouchers(voucherRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift size={24} className="text-brand-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Promo Spesial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      {/* Hero Header with Animated Mesh Gradient */}
      <div className="relative bg-slate-900 text-white overflow-hidden pb-24 sm:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay"></div>
          
          {/* Luxury bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-brand-300 font-black text-xs uppercase tracking-widest shadow-xl mb-6 border border-white/10">
              <Sparkles size={16} className="text-emerald-400" /> Spesial Untuk Anda
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl">
              Promo & Voucher 🎁
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed font-medium">
              Gunakan kode voucher di bawah ini saat <span className="text-white font-black">checkout</span> untuk mendapatkan diskon spesial pada paket bundle pilihanmu.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden sm:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/40 blur-2xl rounded-full"></div>
              <div className="w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl flex items-center justify-center rotate-12 transform hover:rotate-0 hover:scale-105 transition-all duration-500">
                <Gift size={64} className="text-brand-300 drop-shadow-xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 relative z-20 -mt-20 sm:-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <Link href="/bundles" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors">
            <ArrowLeft size={18} /> Kembali ke Katalog
          </Link>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm font-bold text-slate-500">Tersedia:</span>
            <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
              {vouchers.filter(isValid).length} Voucher Aktif
            </span>
          </div>
        </div>

        {vouchers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-brand-100 rounded-full animate-pulse opacity-50" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                <Sparkles size={48} className="text-slate-300" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Belum Ada Promo Aktif</h3>
            <p className="text-slate-500 text-base max-w-sm mx-auto mb-8 leading-relaxed font-medium">
              Pantau terus halaman ini! Tim kami akan mengadakan promo spesial secara berkala.
            </p>
            <Link
              href="/bundles"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-xl shadow-brand-500/30 hover:-translate-y-1"
            >
              Lihat Paket Bundle
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {vouchers.map((v, i) => {
              const valid = isValid(v);
              const expired = isExpired(v);
              const maxed = isMaxed(v);
              const copied = copiedCode === v.code;
              const isPercentage = v.discount_type === "percentage";

              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  className={`relative group ${!valid ? 'opacity-60 grayscale-[30%]' : ''}`}
                >
                  {/* Outer Glow */}
                  {valid && (
                    <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem] ${isPercentage ? 'bg-brand-500/20' : 'bg-emerald-500/20'}`} />
                  )}

                  {/* Premium Ticket Layout */}
                  <div className={`relative flex flex-col sm:flex-row bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${valid ? 'border-slate-100 hover:-translate-y-1' : 'border-slate-200'}`}>
                    
                    {/* Left/Top Section: Discount Value */}
                    <div className={`relative flex flex-col items-center justify-center p-8 sm:w-56 shrink-0 ${isPercentage ? 'bg-gradient-to-br from-brand-50 to-blue-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'}`}>
                      <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center shadow-inner ${isPercentage ? 'bg-brand-100 text-brand-600' : 'bg-emerald-100 text-emerald-600'}`}>
                         {isPercentage ? <Percent size={32} /> : <DollarSign size={32} />}
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Diskon</p>
                      <span className={`font-black text-4xl sm:text-5xl tracking-tighter ${isPercentage ? 'text-brand-600' : 'text-emerald-600'}`}>
                        {isPercentage ? `${v.discount_value}%` : formatRupiah(v.discount_value).replace('Rp', '')}
                      </span>
                      {!isPercentage && <span className="font-bold text-emerald-600 text-sm mt-1">Rupiah</span>}

                      {/* Ticket Cutout (Right edge for desktop, Bottom edge for mobile) */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 rounded-full sm:hidden shadow-inner" />
                      <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full hidden sm:block shadow-inner" />
                    </div>

                    {/* Dotted Line Divider (Mobile: horizontal, Desktop: vertical) */}
                    <div className="relative w-full h-0 border-t-2 border-dashed border-slate-200 sm:w-0 sm:h-auto sm:border-t-0 sm:border-l-2 my-0 sm:my-6" />

                    {/* Right/Bottom Section: Details & Action */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col relative">
                      {/* Ticket Cutout (Top edge for mobile, Left edge for desktop) */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 rounded-full sm:hidden shadow-inner" />
                      <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full hidden sm:block shadow-inner" />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-black text-2xl text-slate-900 tracking-wider bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 uppercase select-all">
                              {v.code}
                            </span>
                            {valid ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <CheckCircle2 size={14} /> Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200">
                                <XCircle size={14} /> {expired ? "Kedaluwarsa" : maxed ? "Habis" : "Nonaktif"}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-sm">
                            Voucher eksklusif untuk persiapan ujian Anda.
                          </p>
                        </div>

                        {/* Copy Button */}
                        <div className="shrink-0 mt-2 sm:mt-0">
                          {valid ? (
                            <button
                              onClick={() => handleCopy(v.code)}
                              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                                copied
                                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                  : "bg-slate-900 hover:bg-brand-600 text-white shadow-slate-900/20 hover:shadow-brand-500/30 hover:-translate-y-1"
                              }`}
                            >
                              {copied ? <Check size={18} /> : <Copy size={18} />}
                              {copied ? "Tersalin!" : "Salin Kode"}
                            </button>
                          ) : (
                            <button disabled className="w-full sm:w-auto bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                              <XCircle size={18} /> Tidak Berlaku
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Info Badges */}
                      <div className="mt-auto pt-5 border-t border-slate-100 grid grid-cols-2 sm:flex flex-wrap gap-2 sm:gap-4">
                        <div className="flex flex-col bg-slate-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5 flex items-center gap-1"><DollarSign size={10} /> Minimal Belanja</span>
                          <span className="text-sm font-bold text-slate-700">{v.min_purchase > 0 ? formatRupiah(v.min_purchase) : "Tanpa Minimum"}</span>
                        </div>
                        <div className="flex flex-col bg-slate-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-0.5 flex items-center gap-1"><Tag size={10} /> Kuota</span>
                          <span className="text-sm font-bold text-slate-700">{v.max_uses ? `${v.max_uses - v.used_count} tersisa dari ${v.max_uses}` : "Tanpa Batas"}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex flex-col bg-rose-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-rose-100">
                          <span className="text-[10px] text-rose-400 uppercase font-black tracking-wider mb-0.5 flex items-center gap-1"><Clock size={10} /> Berlaku Hingga</span>
                          <span className="text-sm font-bold text-rose-700">{v.expires_at ? formatExpiry(v.expires_at) : "Selamanya"}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Call to Action Banner */}
        {vouchers.some(isValid) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-12 relative rounded-[2rem] overflow-hidden bg-brand-900 border border-brand-800 shadow-2xl shadow-brand-900/20"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 z-10">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Siap berhemat? 🎉</h3>
                <p className="text-brand-200 text-sm sm:text-base font-medium">Salin salah satu kode voucher di atas dan klaim diskonmu di halaman pembayaran.</p>
              </div>
              <Link
                href="/bundles"
                className="shrink-0 w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 hover:scale-105 font-black px-8 py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Pilih Paket Sekarang <ArrowLeft className="rotate-180" size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
