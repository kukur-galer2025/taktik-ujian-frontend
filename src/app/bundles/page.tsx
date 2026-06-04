"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Loader2, BookOpen, CheckCircle2, Star,
  Receipt, Sparkles, Shield, Target, FileText,
  Flame, ArrowRight, Award, ChevronRight, PackageOpen
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/context/AuthContext";

export default function BundlesPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bundlesRes = await axios.get("/api/bundles");
        setBundles(bundlesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background Gradients for Loader */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <PackageOpen size={24} className="text-brand-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Katalog Bundle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      {/* Hero Header with Animated Mesh Gradient */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-black uppercase px-4 py-2 rounded-full mb-6 border border-brand-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
              <Flame size={14} className="text-orange-500" /> Paket Hemat Spesial
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Katalog Bundle <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">Premium</span> 🎓
            </h1>
            
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              Hemat hingga 60% dengan membeli paket bundle. Akses puluhan tryout berstandar tinggi, pembahasan tuntas, dan raih passing grade impianmu.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-slate-300">
              <span className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"><Shield size={18} className="text-brand-400" /> Akses Selamanya</span>
              <span className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"><Target size={18} className="text-brand-400" /> Pembahasan Tuntas</span>
              <span className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"><Award size={18} className="text-brand-400" /> Ranking Nasional</span>
            </div>
          </motion.div>
        </div>
        
        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.41,114.16,189.7,100.8,235.3,90.43,281.33,72.63,321.39,56.44Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        
        {/* Quick Links Menu */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link href="/orders" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md">
            <Receipt size={18} className="text-slate-400" /> Riwayat Pembelian
          </Link>
          <Link href="/vouchers" className="flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 bg-brand-50 border border-brand-200/80 px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md">
            <Sparkles size={18} className="text-brand-500" /> Lihat Promo Spesial
          </Link>
        </div>

        {/* Premium Bundle Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {bundles.map((bundle, index) => {
              const totalQuestions = bundle.tryouts?.reduce((sum: number, t: any) => sum + (t.questions_count || 0), 0) || 0;
              const isBestSeller = index === 0; // Highlight the first one as best seller
              const savedPercent = bundle.discount_price ? Math.round(((bundle.price - bundle.discount_price) / bundle.price) * 100) : 0;

              return (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  className={`group bg-white rounded-[2.5rem] flex flex-col relative overflow-hidden transition-all duration-300 ${
                    isBestSeller 
                      ? 'border-2 border-brand-300 shadow-xl shadow-brand-500/10 hover:shadow-2xl hover:shadow-brand-500/20 hover:-translate-y-2' 
                      : 'border border-slate-100 shadow-md hover:shadow-2xl hover:shadow-slate-300/40 hover:-translate-y-2 hover:border-slate-200'
                  }`}
                >
                  {/* Decorative Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-[${isBestSeller ? 'rgba(59,130,246,0.03)' : 'rgba(241,245,249,0.5)'}] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  {/* Absolute Badges (Glassmorphism) */}
                  <div className="absolute top-5 right-5 z-30 flex flex-col gap-2 items-end">
                    {isBestSeller && (
                      <span className="bg-brand-600/95 backdrop-blur-md text-white text-[10px] font-black uppercase px-3.5 py-1.5 rounded-xl shadow-lg border border-brand-500 flex items-center gap-1.5">
                        <Star size={12} className="fill-white" /> Terlaris
                      </span>
                    )}
                    {savedPercent > 0 && (
                      <span className="bg-red-500/95 backdrop-blur-md text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl shadow-lg border border-red-400 flex items-center gap-1">
                        <Flame size={12} /> Hemat {savedPercent}%
                      </span>
                    )}
                  </div>

                  {/* Cover Image Area */}
                  <div className="p-3 pb-0">
                    <div className="relative h-56 w-full rounded-[2rem] overflow-hidden bg-slate-900 isolate">
                      {bundle.cover_image ? (
                        <>
                          <img 
                            src={getImageUrl(bundle.cover_image)} 
                            alt={bundle.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                          <div className="absolute bottom-5 left-5 right-5 z-20">
                            <h3 className="font-black text-2xl text-white drop-shadow-md line-clamp-2 leading-tight">{bundle.title}</h3>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-end relative overflow-hidden">
                          <div className="absolute -right-8 -top-8 w-40 h-40 bg-brand-500/30 rounded-full blur-3xl group-hover:bg-brand-500/50 transition-colors duration-500" />
                          <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                          <h3 className="font-black text-2xl text-white relative z-20 line-clamp-2 leading-tight">{bundle.title}</h3>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-7 flex-1 flex flex-col relative z-20">
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {bundle.description || 'Paket komprehensif untuk persiapan ujian maksimal. Miliki seluruh fitur dengan harga miring.'}
                    </p>

                    {/* Stats Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600">
                        <BookOpen size={14} className="text-brand-500" /> {bundle.tryouts_count || bundle.tryouts?.length || 0} Tryout
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600">
                        <FileText size={14} className="text-brand-500" /> {totalQuestions} Soal
                      </span>
                    </div>

                    {/* Includes List */}
                    <div className="space-y-3 mb-8 flex-1">
                      {bundle.tryouts?.slice(0, 3).map((t: any) => (
                        <div key={t.id} className="flex items-start gap-3">
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          </div>
                          <span className="text-slate-600 text-sm font-medium line-clamp-1 leading-snug">{t.title}</span>
                        </div>
                      ))}
                      {(bundle.tryouts?.length || 0) > 3 && (
                        <div className="pl-8 pt-1">
                          <span className="inline-block bg-brand-50 text-brand-600 px-3 py-1 rounded-lg text-xs font-bold border border-brand-100">
                            +{bundle.tryouts.length - 3} tryout eksklusif lainnya
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & CTA Area */}
                    <div className="mt-auto border-t border-slate-100 pt-6">
                      <div className="flex items-end justify-between mb-5">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Harga</p>
                          {bundle.discount_price ? (
                            <div className="flex flex-col">
                              <span className="text-slate-400 line-through text-xs font-semibold mb-0.5">{formatRupiah(bundle.price)}</span>
                              <div className="text-2xl font-black text-slate-900 leading-none">{formatRupiah(bundle.discount_price)}</div>
                            </div>
                          ) : (
                            <div className="text-2xl font-black text-slate-900 leading-none">
                              {bundle.price === 0 ? "GRATIS" : formatRupiah(bundle.price)}
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/bundles/${bundle.id}`}
                        className={`w-full group/btn relative overflow-hidden py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                          isBestSeller
                            ? 'bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white shadow-lg shadow-brand-500/30'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-xl'
                        }`}
                      >
                        <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10 flex items-center gap-2">Ambil Promo Ini <ArrowRight size={18} /></span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {bundles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center p-12 sm:p-20 bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 mt-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                  <PackageOpen size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Belum Ada Bundle</h2>
                <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">
                  Katalog bundle premium sedang dalam tahap persiapan. Silakan periksa kembali nanti untuk penawaran terbaik dari kami!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <MobileBottomNav />

      {/* Shimmer CSS Animation Definition */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
