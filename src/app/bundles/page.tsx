"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Loader2, BookOpen, CheckCircle2, Star, CreditCard,
  ChevronRight, Receipt, Sparkles, Shield, Target, FileText, Clock,
  Flame, Zap, ArrowRight, Award
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function BundlesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [userRes, bundlesRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/bundles"),
        ]);
        setUser(userRes.data);
        setBundles(bundlesRes.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
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

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Katalog Bundle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-black uppercase px-4 py-1.5 rounded-full mb-6 border border-brand-500/30">
              <Flame size={14} /> Paket Hemat Terlaris
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
              Paket Bundle <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">Premium</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Hemat hingga 60% dengan membeli paket bundle. Akses puluhan tryout, pembahasan lengkap, dan analitik skor untuk persiapan yang maksimal.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Shield size={18} className="text-brand-400" /> Akses Selamanya</span>
              <span className="flex items-center gap-2"><Target size={18} className="text-brand-400" /> Pembahasan Detail</span>
              <span className="flex items-center gap-2"><Award size={18} className="text-brand-400" /> Ranking Nasional</span>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/orders" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-colors">
            <Receipt size={14} /> Riwayat Pembelian
          </Link>
          <Link href="/vouchers" className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 border border-brand-200 px-4 py-2 rounded-xl transition-colors">
            <Sparkles size={14} /> Lihat Promo & Voucher
          </Link>
        </div>

        {/* Bundle Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle, index) => {
            const totalQuestions = bundle.tryouts?.reduce((sum: number, t: any) => sum + (t.questions_count || 0), 0) || 0;
            const isBestSeller = index === 0;
            const savedPercent = bundle.discount_price ? Math.round(((bundle.price - bundle.discount_price) / bundle.price) * 100) : 0;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                key={bundle.id}
                className={`bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative group border-2 ${
                  isBestSeller ? 'border-brand-300 ring-2 ring-brand-100' : 'border-slate-100 hover:border-brand-200'
                }`}
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
                  {isBestSeller && (
                    <span className="bg-brand-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Star size={10} /> TERLARIS
                    </span>
                  )}
                  {savedPercent > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                      HEMAT {savedPercent}%
                    </span>
                  )}
                </div>

                {/* Cover */}
                {bundle.cover_image ? (
                  <div className="relative h-48 w-full bg-slate-900">
                    <img src={getImageUrl(bundle.cover_image)} alt={bundle.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <h3 className="font-black text-xl text-white drop-shadow-md line-clamp-1">{bundle.title}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-end overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-colors" />
                    <h3 className="font-black text-xl text-white relative z-10 line-clamp-1">{bundle.title}</h3>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{bundle.description}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                      <BookOpen size={13} className="text-brand-500" /> {bundle.tryouts_count || bundle.tryouts?.length || 0} Tryout
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                      <FileText size={13} className="text-brand-500" /> {totalQuestions} Soal
                    </span>
                  </div>

                  {/* Tryout List Preview */}
                  <div className="space-y-2 mb-5 flex-1">
                    {bundle.tryouts?.slice(0, 3).map((t: any) => (
                      <div key={t.id} className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span className="text-slate-600 text-xs font-medium truncate">{t.title}</span>
                      </div>
                    ))}
                    {(bundle.tryouts?.length || 0) > 3 && (
                      <p className="text-xs text-brand-600 font-bold pl-6">+{bundle.tryouts.length - 3} tryout lainnya</p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {bundle.discount_price ? (
                      <div>
                        <span className="text-slate-400 line-through text-sm">{formatRupiah(bundle.price)}</span>
                        <div className="text-2xl font-black text-slate-900">{formatRupiah(bundle.discount_price)}</div>
                      </div>
                    ) : (
                      <div className="text-2xl font-black text-slate-900">
                        {bundle.price === 0 ? "GRATIS" : formatRupiah(bundle.price)}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/bundles/${bundle.id}`}
                    className={`w-full text-center py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                      isBestSeller
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/30 hover:-translate-y-0.5'
                        : 'bg-slate-900 hover:bg-brand-600 text-white shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    Lihat Detail <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {bundles.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <ShoppingCart size={32} />
              </div>
              <p className="text-slate-500 font-bold text-lg mb-2">Belum ada paket bundle tersedia</p>
              <p className="text-slate-400 text-sm">Silakan cek kembali nanti.</p>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
