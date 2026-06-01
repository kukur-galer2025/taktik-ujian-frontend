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

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [userRes, analyticsRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/user/analytics"),
        ]);
        setUser(userRes.data);
        setAnalytics(analyticsRes.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Menghimpun Data Analitik...</p>
      </div>
    );
  }

  // ─── EMPTY STATE ───
  if (!analytics || analytics.total_tryouts === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
        <UserNavbar user={user} onLogout={handleLogout} />

        <main className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
          {/* Hero Empty */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 bg-brand-200 rounded-full animate-ping opacity-20" />
              <div className="relative w-28 h-28 bg-gradient-to-br from-brand-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-brand-500/30">
                <Rocket size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Mulai Perjalanan Anda!</h1>
            <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Halaman analitik ini akan menampilkan perkembangan skor, kekuatan & kelemahan, serta saran belajar AI setelah Anda menyelesaikan tryout pertama.
            </p>
          </motion.div>

          {/* Feature Preview Cards */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {[
              {
                icon: BarChart3, color: 'bg-blue-500', title: 'Grafik Perkembangan',
                desc: 'Lihat trend skor dari waktu ke waktu dengan visualisasi interaktif.'
              },
              {
                icon: Target, color: 'bg-rose-500', title: 'Analisis Kelemahan',
                desc: 'Sistem mengidentifikasi materi terlemah secara otomatis.'
              },
              {
                icon: Zap, color: 'bg-amber-500', title: 'Saran Belajar AI',
                desc: 'Rekomendasi fokus belajar berdasarkan pola jawaban Anda.'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black mb-6 text-center">Cara Membuka Analitik</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { step: '1', icon: BookOpen, title: 'Pilih Tryout', desc: 'Buka katalog dan pilih paket tryout yang tersedia.' },
                  { step: '2', icon: PlayCircle, title: 'Kerjakan Ujian', desc: 'Kerjakan semua soal dalam waktu yang ditentukan.' },
                  { step: '3', icon: BarChart3, title: 'Lihat Hasil', desc: 'Data Anda otomatis terekam di halaman ini.' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-black flex items-center justify-center mx-auto mb-3 text-sm">
                      {s.step}
                    </div>
                    <h3 className="font-bold text-base mb-1">{s.title}</h3>
                    <p className="text-sm text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/tryouts" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-brand-500/30">
                  <PlayCircle size={18} /> Mulai Tryout Pertama
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
    if (pct >= 90) return { label: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (pct >= 80) return { label: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (pct >= 70) return { label: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (pct >= 60) return { label: 'C', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'D', color: 'text-red-600', bg: 'bg-red-50' };
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

  const avgTotal = Math.round(analytics.avg_twk + analytics.avg_tiu + analytics.avg_tkp);
  const passRate = analytics.history ? Math.round((analytics.history.filter((h: any) => h.is_passed).length / analytics.history.length) * 100) : 0;
  const bestScore = analytics.history ? Math.max(...analytics.history.map((h: any) => h.total_score)) : 0;
  const latestScore = analytics.history?.length > 0 ? analytics.history[analytics.history.length - 1].total_score : 0;
  const trend = analytics.history?.length >= 2 ? latestScore - analytics.history[analytics.history.length - 2].total_score : 0;

  // ─── FULL ANALYTICS ───
  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-12">
      <UserNavbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Analitik & Performa</h1>
          <p className="text-slate-500 text-sm sm:text-base">Evaluasi mendalam: {analytics.total_tryouts} ujian dikerjakan • Tingkat kelulusan {passRate}%</p>
        </div>

        {/* Score Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Skor Rata-Rata', value: avgTotal, max: MAX_TOTAL, pass: PASS_TOTAL, icon: Target, color: 'brand' },
            { label: 'Rata-rata TWK', value: Math.round(analytics.avg_twk), max: MAX_TWK, pass: PASS_TWK, icon: Activity, color: 'blue' },
            { label: 'Rata-rata TIU', value: Math.round(analytics.avg_tiu), max: MAX_TIU, pass: PASS_TIU, icon: TrendingUp, color: 'violet' },
            { label: 'Rata-rata TKP', value: Math.round(analytics.avg_tkp), max: MAX_TKP, pass: PASS_TKP, icon: Sparkles, color: 'amber' },
          ].map((card, i) => {
            const pct = Math.round((card.value / card.max) * 100);
            const passed = card.value >= card.pass;
            const grade = getGrade(pct);
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${grade.bg} ${grade.color}`}>{grade.label}</span>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-black text-slate-900">{card.value}</span>
                  <span className="text-sm text-slate-400 font-medium mb-1">/ {card.max}</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${passed ? 'bg-emerald-500' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className={passed ? 'text-emerald-600' : 'text-red-500'}>
                    {passed ? '✓ Lulus PG' : `✗ Kurang ${card.pass - card.value} poin`}
                  </span>
                  <span className="text-slate-400">PG: {card.pass}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-black text-slate-900">{analytics.total_tryouts}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Ujian</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-black text-emerald-600">{passRate}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Tingkat Lulus</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-black text-brand-600">{bestScore}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Skor Tertinggi</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className={`text-2xl font-black ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-slate-600'}`}>
              {trend > 0 ? '+' : ''}{trend}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Trend Terakhir</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-500" /> Radar Skor Rata-Rata
            </h3>
            <div className="h-[220px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { subject: 'TWK', score: analytics.avg_twk, fullMark: MAX_TWK },
                  { subject: 'TIU', score: analytics.avg_tiu, fullMark: MAX_TIU },
                  { subject: 'TKP', score: analytics.avg_tkp, fullMark: MAX_TKP },
                ]}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                  <Radar name="Skor" dataKey="score" stroke="#0ea5e9" fill="#38bdf8" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-sm sm:text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-500" /> Trend Total Skor
            </h3>
            <div className="flex-1 min-h-[220px] sm:min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.history} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="attempt" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} dx={-5} domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="total_score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI-Style Personalized Advice */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-black text-lg">Saran Belajar Personal</h3>
                <p className="text-slate-400 text-xs">Berdasarkan analisis {analytics.total_tryouts} hasil ujian Anda</p>
              </div>
            </div>
            <div className="space-y-3">
              {getAdvice().map((adv, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-sm leading-relaxed text-slate-200">
                  {adv}
                </div>
              ))}
              {avgTotal >= PASS_TOTAL && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-sm font-bold text-emerald-300">
                  🎉 Selamat! Skor rata-rata Anda ({avgTotal}) sudah memenuhi passing grade total ({PASS_TOTAL}). Terus pertahankan dan tingkatkan konsistensi!
                </div>
              )}
              {avgTotal < PASS_TOTAL && (
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-sm font-bold text-amber-300">
                  💡 Target Anda: Tingkatkan skor total dari {avgTotal} menuju {PASS_TOTAL}+ (kurang {PASS_TOTAL - avgTotal} poin). Fokus drill pada materi terlemah.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        {(analytics.weakest_subjects?.length > 0 || analytics.strongest_subjects?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {analytics.weakest_subjects?.length > 0 && (
              <div className="bg-red-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-red-100">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="bg-red-100 p-2.5 text-red-600 rounded-xl"><AlertTriangle size={22} /></div>
                  <div>
                    <h3 className="font-black text-red-900 text-base sm:text-lg">Fokus Perbaikan</h3>
                    <p className="text-red-700/80 text-xs font-bold uppercase tracking-wider mt-0.5">Materi Terlemah</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {analytics.weakest_subjects.map((sub: any, idx: number) => (
                    <li key={idx} className="bg-white/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-50 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">{sub.name}</span>
                        <span className="font-black text-red-600 text-sm">{sub.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${sub.percentage}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analytics.strongest_subjects?.length > 0 && (
              <div className="bg-emerald-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-emerald-100">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="bg-emerald-100 p-2.5 text-emerald-600 rounded-xl"><Sparkles size={22} /></div>
                  <div>
                    <h3 className="font-black text-emerald-900 text-base sm:text-lg">Kekuatan Utama</h3>
                    <p className="text-emerald-700/80 text-xs font-bold uppercase tracking-wider mt-0.5">Lumbung Poin</p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {analytics.strongest_subjects.map((sub: any, idx: number) => (
                    <li key={idx} className="bg-white/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-50 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">{sub.name}</span>
                        <span className="font-black text-emerald-600 text-sm">{sub.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sub.percentage}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* History Table */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base sm:text-lg">
              <History size={18} className="text-brand-500" /> Riwayat Ujian ({analytics.history?.length || 0})
            </h3>
            <div className="text-xs text-slate-400 font-bold">
              PG: TWK≥{PASS_TWK} • TIU≥{PASS_TIU} • TKP≥{PASS_TKP}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-4 sm:px-6 py-4 sm:py-5">Tanggal</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5">Ujian</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">Status</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">TWK <span className="text-slate-300">/{MAX_TWK}</span></th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">TIU <span className="text-slate-300">/{MAX_TIU}</span></th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-center">TKP <span className="text-slate-300">/{MAX_TKP}</span></th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-right text-brand-600">Total</th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.history.slice().reverse().map((res: any, index: number) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-slate-600 text-xs sm:text-sm">{res.date}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-slate-800 text-xs sm:text-sm">{res.attempt}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      {res.is_passed ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold">
                          <CheckCircle2 size={12} /> LULUS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold">
                          <XCircle size={12} /> GAGAL
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">
                      <span className={`font-bold ${res.score_twk < PASS_TWK ? "text-red-500" : "text-slate-600"}`}>{res.score_twk}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">
                      <span className={`font-bold ${res.score_tiu < PASS_TIU ? "text-red-500" : "text-slate-600"}`}>{res.score_tiu}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">
                      <span className={`font-bold ${res.score_tkp < PASS_TKP ? "text-red-500" : "text-slate-600"}`}>{res.score_tkp}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-black text-base sm:text-xl text-slate-900">{res.total_score}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <Link
                        href={`/results/${res.id}/review`}
                        className="inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        <BookOpen size={14} /> <span className="hidden sm:inline">Pembahasan</span>
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
