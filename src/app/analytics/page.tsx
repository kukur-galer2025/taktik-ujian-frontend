"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3, TrendingUp, Activity, Target, ShieldAlert, CheckCircle2, History,
  XCircle, Sparkles, AlertTriangle, ArrowRight, BookOpen, Loader2, PlayCircle, Rocket, Zap
} from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/context/AuthContext";

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTryout, setSelectedTryout] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!analytics) setLoading(true);
        else setIsFetching(true);
        
        const analyticsRes = await axios.get(`/api/user/analytics?tryout_id=${selectedTryout}`);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };
    fetchData();
  }, [selectedTryout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 md:pb-12 font-sans">
        <UserNavbar user={user} onLogout={logout} />

        {/* Skeleton Header */}
        <div className="relative bg-slate-900 pt-8 pb-32 mb-10 overflow-hidden border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="w-40 h-8 bg-slate-800 rounded-xl mb-4 animate-pulse"></div>
            <div className="w-3/4 sm:w-1/2 h-12 bg-slate-800 rounded-2xl mb-4 animate-pulse"></div>
            <div className="w-1/2 sm:w-1/3 h-6 bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-20">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl shadow-slate-200/50 mb-6 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
               <div>
                 <div className="w-20 h-3 bg-slate-100 rounded mb-2 animate-pulse"></div>
                 <div className="w-32 h-4 bg-slate-100 rounded animate-pulse"></div>
               </div>
             </div>
             <div className="w-48 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
                  <div className="w-10 h-6 bg-slate-100 rounded-lg animate-pulse"></div>
                </div>
                <div className="w-24 h-4 bg-slate-100 rounded mb-2 animate-pulse"></div>
                <div className="w-32 h-8 bg-slate-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-xl shadow-slate-200/50 h-[400px] animate-pulse">
               <div className="w-48 h-6 bg-slate-100 rounded mb-8"></div>
               <div className="w-full h-64 bg-slate-50 rounded-xl"></div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-xl shadow-slate-200/50 h-[400px] animate-pulse">
               <div className="w-48 h-6 bg-slate-100 rounded mb-8"></div>
               <div className="w-full h-64 bg-slate-50 rounded-full mx-auto max-w-[250px]"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── EMPTY STATE ───
  if (!analytics || analytics.total_tryouts === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans selection:bg-brand-500 selection:text-white">
        <UserNavbar user={user} onLogout={logout} />

        <main className="max-w-5xl mx-auto px-4 py-10 sm:py-16 relative z-10">
          {/* Hero Empty with Premium Mesh Glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-brand-200 rounded-full animate-ping opacity-30 duration-1000" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-brand-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-brand-500/40 border-4 border-white">
                <Rocket size={48} className="text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Mulai Perjalanan Anda!</h1>
            <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
              Laporan analitik pintar ini akan otomatis menyusun kurva performa dari <span className="font-bold text-slate-700">seluruh riwayat ujian Anda</span>, mendeteksi materi kelemahan, dan merancang saran belajar berbasis AI. Fitur ini akan otomatis aktif setelah Anda menyelesaikan <span className="font-bold text-slate-700">minimal satu Tryout.</span>
            </p>
          </motion.div>

          {/* Feature Preview Cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: BarChart3, color: 'bg-blue-500', title: 'Grafik Perkembangan', desc: 'Pantau trend skor dari waktu ke waktu secara presisi.' },
              { icon: Target, color: 'bg-rose-500', title: 'Analisis Kelemahan', desc: 'Deteksi otomatis sub-materi yang sering salah.' },
              { icon: Zap, color: 'bg-amber-500', title: 'Saran Belajar AI', desc: 'Rekomendasi fokus studi untuk efisiensi belajar maksimal.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-100 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-${feature.color.split('-')[1]}-500/30`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="font-black text-slate-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Steps Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px]" />
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center">Cara Mengaktifkan Rapor Pintar</h2>
              
              <div className="grid sm:grid-cols-3 gap-8">
                {[
                  { step: '1', icon: BookOpen, title: 'Pilih Tryout', desc: 'Buka katalog, pilih paket.' },
                  { step: '2', icon: PlayCircle, title: 'Kerjakan Ujian', desc: 'Selesaikan dalam waktu 100 menit.' },
                  { step: '3', icon: BarChart3, title: 'Lihat Hasil', desc: 'Data Anda akan terekam di sini.' },
                ].map((s, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 text-brand-400 font-black flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-lg">
                      {s.step}
                    </div>
                    <h3 className="font-black text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link href="/tryouts" className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-white/10 hover:-translate-y-1 text-lg group relative overflow-hidden">
                  <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <PlayCircle size={22} className="relative z-10" /> <span className="relative z-10">Mulai Tryout Pertama</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  // ─── HELPERS ───
  const PASS_TWK = 65, PASS_TIU = 80, PASS_TKP = 166;
  const MAX_TWK = 150, MAX_TIU = 175, MAX_TKP = 225;
  const PASS_TOTAL = PASS_TWK + PASS_TIU + PASS_TKP; // 311
  const MAX_TOTAL = MAX_TWK + MAX_TIU + MAX_TKP; // 550

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (pct >= 80) return { label: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (pct >= 70) return { label: 'B', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (pct >= 60) return { label: 'C', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'D', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  const getAdvice = () => {
    const advice: string[] = [];
    if (analytics.avg_twk < PASS_TWK) advice.push(`⚠️ Skor TWK Anda rata-rata ${Math.round(analytics.avg_twk)} (passing grade: ${PASS_TWK}). Perbanyak latihan soal Pancasila, UUD 1945, dan Bela Negara.`);
    else advice.push(`✅ TWK Anda sudah aman di rata-rata ${Math.round(analytics.avg_twk)}. Pertahankan!`);
    if (analytics.avg_tiu < PASS_TIU) advice.push(`⚠️ Skor TIU Anda rata-rata ${Math.round(analytics.avg_tiu)} (passing grade: ${PASS_TIU}). Fokus pada logika, analogi, dan aritmatika.`);
    else advice.push(`✅ TIU Anda kuat di rata-rata ${Math.round(analytics.avg_tiu)}. Terus asah kecepatan!`);
    if (analytics.avg_tkp < PASS_TKP) advice.push(`⚠️ Skor TKP Anda rata-rata ${Math.round(analytics.avg_tkp)} (passing grade: ${PASS_TKP}). Pahami pola jawaban bernilai 5 untuk setiap tipe soal.`);
    else advice.push(`✅ TKP Anda solid di rata-rata ${Math.round(analytics.avg_tkp)}. Targetkan konsisten di atas 170!`);
    return advice;
  };

  const avgTotal = Math.round(Number(analytics.avg_twk || 0) + Number(analytics.avg_tiu || 0) + Number(analytics.avg_tkp || 0)) || 0;
  let historyData: any[] = [];
  if (Array.isArray(analytics?.history)) {
    if (analytics.history.length > 0 && Array.isArray(analytics.history[0])) {
      historyData = analytics.history[0];
    } else {
      historyData = analytics.history;
    }
  } else if (typeof analytics?.history === 'object' && analytics.history !== null) {
    const values = Object.values(analytics.history);
    if (values.length > 0 && typeof values[0] === 'object') {
      historyData = values;
    } else {
      historyData = [analytics.history];
    }
  }
  const passRate = historyData.length > 0 ? Math.round((historyData.filter((h: any) => h.is_passed).length / historyData.length) * 100) || 0 : 0;
  const bestScore = historyData.length > 0 ? Math.max(...historyData.map((h: any) => Number(h.total_score || 0))) || 0 : 0;
  const latestScore = historyData.length > 0 ? Number(historyData[historyData.length - 1].total_score || 0) : 0;
  const trend = historyData.length >= 2 ? latestScore - Number(historyData[historyData.length - 2].total_score || 0) || 0 : 0;

  // ─── FULL ANALYTICS ───
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-12 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      {/* Premium Header Background */}
      <div className="relative bg-slate-900 pt-8 pb-32 mb-10 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-brand-300 font-black text-sm shadow-lg mb-4 border border-white/10">
            <BarChart3 size={18} /> Rapor Interaktif
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">Evaluasi Performa</h1>
          <p className="text-slate-300 text-sm sm:text-lg font-medium">Berdasarkan jejak analisis dari {analytics.total_tryouts} ujian yang telah Anda selesaikan secara progresif.</p>
        </div>
      </div>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-20 transition-opacity duration-500 ease-in-out ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Filter Section */}
        {analytics.available_tryouts && analytics.available_tryouts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xl shadow-slate-200/50 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                {isFetching ? (
                  <Loader2 size={20} className="text-brand-600 animate-spin" />
                ) : (
                  <Target size={20} className="text-brand-600" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter Data</p>
                <p className="text-sm font-black text-slate-900">Pilih Tryout</p>
              </div>
            </div>
            <select
              value={selectedTryout}
              onChange={(e) => setSelectedTryout(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
            >
              <option value="all">📊 Semua Riwayat Tryout (Akumulasi)</option>
              {analytics.available_tryouts.map((t: any) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Score Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { label: 'Rata-Rata Nasional', value: avgTotal, max: MAX_TOTAL, pass: PASS_TOTAL, icon: Target, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Rata-rata TWK', value: Math.round(analytics.avg_twk), max: MAX_TWK, pass: PASS_TWK, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Rata-rata TIU', value: Math.round(analytics.avg_tiu), max: MAX_TIU, pass: PASS_TIU, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Rata-rata TKP', value: Math.round(analytics.avg_tkp), max: MAX_TKP, pass: PASS_TKP, icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map((card, i) => {
            const pct = Math.round((card.value / card.max) * 100);
            const passed = card.value >= card.pass;
            const grade = getGrade(pct);
            const Icon = card.icon;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
              >
                {passed && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />}
                {!passed && <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />}
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${grade.bg} ${grade.color} shadow-sm`}>{grade.label}</span>
                </div>
                
                <div className="mb-1 relative z-10">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{card.label}</span>
                </div>
                
                <div className="flex items-end gap-2 mb-4 relative z-10">
                  <span className="text-4xl font-black text-slate-900">{card.value}</span>
                  <span className="text-sm text-slate-400 font-bold mb-1.5">/ {card.max}</span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3 shadow-inner relative z-10">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative ${passed ? 'bg-emerald-500 shadow-emerald-500/50 shadow-md' : 'bg-red-400 shadow-red-400/50 shadow-md'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  >
                     <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                
                <div className="flex justify-between text-[11px] font-bold relative z-10">
                  <span className={passed ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md' : 'text-red-500 bg-red-50 px-2 py-0.5 rounded-md'}>
                    {passed ? '✓ Lulus Passing Grade' : `✗ Kurang ${card.pass - card.value} poin lagi`}
                  </span>
                  <span className="text-slate-400">PG: {card.pass}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-slate-900 mb-1">{analytics.total_tryouts}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ujian</p>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-emerald-600 mb-1">{passRate}%</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Lulus</p>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-brand-600 mb-1">{bestScore}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skor Tertinggi</p>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 text-center shadow-sm">
            <p className={`text-3xl font-black mb-1 ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-slate-600'}`}>
              {trend > 0 ? '+' : ''}{trend}
            </p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trend Terakhir</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2 relative z-10">
              <BarChart3 size={20} className="text-brand-500" /> Radar Pemetaan Skor
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-6 relative z-10">Keseimbangan penguasaan pada 3 area uji.</p>
            
            <div className="h-[250px] relative z-10">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                  { subject: 'TWK', score: analytics.avg_twk, fullMark: MAX_TWK },
                  { subject: 'TIU', score: analytics.avg_tiu, fullMark: MAX_TIU },
                  { subject: 'TKP', score: analytics.avg_tkp, fullMark: MAX_TKP },
                ]}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 800 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                  <Radar name="Rata-rata Skor" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRadar)" fillOpacity={1} />
                  <defs>
                     <linearGradient id="colorRadar" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                     </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
             
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2 relative z-10">
              <TrendingUp size={20} className="text-brand-500" /> Progres Trend Total Skor
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-6 relative z-10">Grafik pergerakan nilai Anda dari waktu ke waktu.</p>

            <div className="flex-1 min-h-[250px] relative z-10">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <LineChart data={historyData} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="attempt" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} dy={15} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} dx={-5} domain={['dataMin - 10', 'dataMax + 20']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }} 
                    itemStyle={{ fontWeight: 800, color: '#0f172a' }}
                  />
                  <Line type="monotone" name="Total Skor" dataKey="total_score" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#ffffff' }} activeDot={{ r: 8, fill: '#2563eb', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI-Style Personalized Advice */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px]" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles size={28} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-black text-xl sm:text-2xl tracking-tight">Saran Pembelajaran Cerdas (AI)</h3>
                <p className="text-slate-400 text-sm font-medium">Laporan dihasilkan secara spesifik untuk membedah data dari {analytics.total_tryouts} sesi uji coba Anda.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {getAdvice().map((adv, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-sm font-medium leading-relaxed text-slate-200 shadow-sm">
                  {adv}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              {avgTotal >= PASS_TOTAL && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-5 text-sm sm:text-base font-black text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 size={24} className="shrink-0 mt-0.5" />
                  <span>Hebat! Rata-rata kompetensi Anda ({avgTotal}) berada di zona aman, melewati ambang batas kelulusan SKD Nasional ({PASS_TOTAL}). Fokuslah memoles durasi dan akurasi untuk merebut ranking teratas!</span>
                </div>
              )}
              {avgTotal < PASS_TOTAL && (
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-5 text-sm sm:text-base font-black text-amber-300 flex items-start gap-3">
                  <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                  <span>Strategi Diperlukan: Kinerja Anda ({avgTotal}) masih terpaut {PASS_TOTAL - avgTotal} poin dari zona aman ({PASS_TOTAL}). Konsentrasikan tenaga pada subtes yang nilainya merah (di bawah Passing Grade) agar persentase kelulusan naik signifikan.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        {(analytics.weakest_subjects?.length > 0 || analytics.strongest_subjects?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {analytics.weakest_subjects?.length > 0 && (
              <div className="bg-red-50 p-6 sm:p-8 rounded-[2.5rem] border border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="bg-red-100 border border-red-200 p-3 text-red-600 rounded-2xl shadow-sm"><AlertTriangle size={28} /></div>
                  <div>
                    <h3 className="font-black text-red-900 text-xl">Zona Merah (Kelemahan)</h3>
                    <p className="text-red-700 font-bold text-xs uppercase tracking-wider mt-1">Titik Kegagalan Utama</p>
                  </div>
                </div>
                <ul className="space-y-3 relative z-10">
                  {analytics.weakest_subjects.map((sub: any, idx: number) => (
                    <li key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-800 text-sm">{sub.name}</span>
                        <span className="font-black text-white bg-red-500 px-2.5 py-0.5 rounded-lg text-sm shadow-sm shadow-red-500/20">{sub.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-red-500 rounded-full relative" style={{ width: `${sub.percentage}%` }}>
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analytics.strongest_subjects?.length > 0 && (
              <div className="bg-emerald-50 p-6 sm:p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="bg-emerald-100 border border-emerald-200 p-3 text-emerald-600 rounded-2xl shadow-sm"><Sparkles size={28} /></div>
                  <div>
                    <h3 className="font-black text-emerald-900 text-xl">Lumbung Poin (Kekuatan)</h3>
                    <p className="text-emerald-700 font-bold text-xs uppercase tracking-wider mt-1">Dikuasai Penuh</p>
                  </div>
                </div>
                <ul className="space-y-3 relative z-10">
                  {analytics.strongest_subjects.map((sub: any, idx: number) => (
                    <li key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-slate-800 text-sm">{sub.name}</span>
                        <span className="font-black text-white bg-emerald-500 px-2.5 py-0.5 rounded-lg text-sm shadow-sm shadow-emerald-500/20">{sub.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-emerald-500 rounded-full relative" style={{ width: `${sub.percentage}%` }}>
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* History Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl">
              <History size={24} className="text-brand-500" /> Rekam Jejak Ujian ({historyData.length})
            </h3>
            <div className="text-xs text-slate-500 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              Ambasing Grade: TWK ≥ {PASS_TWK} • TIU ≥ {PASS_TIU} • TKP ≥ {PASS_TKP}
            </div>
          </div>
          
          <div className="overflow-x-auto p-4 sm:p-6">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border border-slate-100 text-xs font-black text-slate-500 uppercase tracking-widest rounded-xl">
                  <th className="px-5 py-4 rounded-l-xl">Sesi Tryout</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center">TWK</th>
                  <th className="px-5 py-4 text-center">TIU</th>
                  <th className="px-5 py-4 text-center">TKP</th>
                  <th className="px-5 py-4 text-right">Skor Total</th>
                  <th className="px-5 py-4 text-right rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historyData.slice().reverse().map((res: any, index: number) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-slate-800 text-sm group-hover:text-brand-600 transition-colors">{res.attempt}</span>
                        {selectedTryout === 'all' && res.tryout_name && (
                          <span className="text-[10px] font-black bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 rounded-lg uppercase tracking-wider line-clamp-1 max-w-[200px]">
                            {res.tryout_name}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-400 text-xs mt-0.5">{res.date}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {res.is_passed ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-black border border-emerald-100">
                          <CheckCircle2 size={14} /> LULUS SKD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-black border border-red-100">
                          <XCircle size={14} /> GAGAL
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex font-black text-sm px-2 py-1 rounded-md ${res.score_twk < PASS_TWK ? "bg-red-50 text-red-600" : "text-slate-700"}`}>
                        {res.score_twk}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex font-black text-sm px-2 py-1 rounded-md ${res.score_tiu < PASS_TIU ? "bg-red-50 text-red-600" : "text-slate-700"}`}>
                        {res.score_tiu}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex font-black text-sm px-2 py-1 rounded-md ${res.score_tkp < PASS_TKP ? "bg-red-50 text-red-600" : "text-slate-700"}`}>
                        {res.score_tkp}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                       <span className="font-black text-xl text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">{res.total_score}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/tryout/${res.tryout_id || 0}/review?resultId=${res.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors border border-brand-100 shadow-sm"
                      >
                        <BookOpen size={14} /> Cek Pembahasan
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
