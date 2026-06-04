"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Target, ChevronRight,
  PlayCircle, Loader2, ArrowRight, Trophy, TrendingUp, BarChart3, ShieldCheck, Star,
  Sparkles, Package, Flame, Calendar, MapPin
} from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [tryouts, setTryouts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await axios.get("/api/dashboard");
        setTryouts(dashboardRes.data.tryouts);
        setAnalytics(dashboardRes.data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin size={24} className="text-brand-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  const recentTryouts = tryouts.slice(0, 3);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* Admin Banner */}
        {user?.is_admin ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-500/20 text-brand-400 p-2 rounded-lg">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-bold">Mode Administrator Aktif</h3>
                <p className="text-slate-400 text-sm">Anda memiliki akses penuh ke panel admin.</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-6 rounded-xl transition-colors whitespace-nowrap text-center text-sm"
            >
              Buka Panel Admin
            </Link>
          </motion.div>
        ) : null}

        {/* Welcome Hero with Animated Mesh Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white mb-8 overflow-hidden shadow-2xl shadow-brand-500/10 border border-slate-800"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-brand-500/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          </div>

          <div className="relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-brand-300 font-bold text-xs mb-6 shadow-sm">
              <Calendar size={14} /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-blue-200">{user?.name?.split(' ')[0]}</span>! 👋
            </h1>
            
            <p className="text-slate-300 max-w-2xl text-sm sm:text-lg leading-relaxed font-medium">
              Konsistensi adalah kunci keberhasilan. Kerjakan tryout secara rutin untuk meningkatkan peluang Anda lolos dengan skor maksimal.
            </p>
          </div>
        </motion.div>

        {/* Stats Summary (if has data) */}
        {analytics && analytics.total_tryouts > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          >
            {[
              { label: 'Tryout Dikerjakan', value: analytics.total_tryouts, icon: <Flame size={22} className="text-brand-600" />, bg: 'bg-brand-50' },
              { label: 'Tingkat Kelulusan', value: `${analytics.pass_rate}%`, icon: <TrendingUp size={22} className="text-emerald-600" />, bg: 'bg-emerald-50' },
              { label: 'Rata-rata Skor', value: analytics.avg_twk + analytics.avg_tiu + analytics.avg_tkp, icon: <BarChart3 size={22} className="text-blue-600" />, bg: 'bg-blue-50' },
              { label: 'Skor Terbaik', value: analytics.history?.length > 0 ? Math.max(...analytics.history.map((h: any) => h.total_score)) : '-', icon: <Trophy size={22} className="text-amber-600" />, bg: 'bg-amber-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-500 leading-tight">{stat.label}</span>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        ) : null}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-10"
        >
          <Link href="/tryouts" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200 transition-all duration-300 group flex items-center gap-5 hover:-translate-y-1">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shrink-0 shadow-sm">
              <BookOpen size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1 text-lg">Mulai Belajar</h3>
              <p className="text-sm text-slate-500">{tryouts.length} paket tersedia</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 ml-auto group-hover:text-brand-600 transition-colors" />
          </Link>

          <Link href="/bundles" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 group flex items-center gap-5 relative overflow-hidden hover:-translate-y-1">
            <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-red-200 shadow-sm">Hot Deals</div>
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 shadow-sm">
              <Package size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1 text-lg">Paket Bundle</h3>
              <p className="text-sm text-slate-500">Hemat sampai 50%</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 ml-auto group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link href="/analytics" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 group flex items-center gap-5 hover:-translate-y-1">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0 shadow-sm">
              <BarChart3 size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1 text-lg">Rapor Saya</h3>
              <p className="text-sm text-slate-500">Pantau perkembangan</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 ml-auto group-hover:text-emerald-600 transition-colors" />
          </Link>
        </motion.div>

        {/* Two Column: Recent Tryouts + Tips */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Tryouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles size={22} className="text-brand-500" /> Tryout Pilihan
              </h2>
              <Link href="/tryouts" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors">
                Lihat Semua <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {recentTryouts.map((tryout, i) => {
                const catLabel = tryout.category?.name || 'UMUM';
                const catColor = tryout.category?.color || 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100';
                const classes = catColor.split(',');
                const catBg = classes.find((c: string) => c.startsWith('bg-')) || 'bg-slate-50';
                const catText = classes.find((c: string) => c.startsWith('text-')) || 'text-slate-700';
                const catBorder = classes.find((c: string) => c.startsWith('border-')) || 'border-slate-200';
                const catGrad = classes.filter((c: string) => c.startsWith('from-') || c.startsWith('to-')).join(' ') || 'from-slate-50 to-slate-100';
                
                return (
                  <div key={tryout.id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="p-3 pb-0">
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-100 isolate">
                         {/* Glass Category Badge */}
                        <div className="absolute top-3 left-3 z-20">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shadow-sm backdrop-blur-md ${catBg} ${catText} ${catBorder} bg-opacity-90`}>
                            <Target size={10} className={catText} /> {catLabel}
                          </span>
                        </div>
                        
                        {tryout.cover_image ? (
                          <>
                            <img src={getImageUrl(tryout.cover_image)} alt={tryout.title} className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
                          </>
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${catGrad} flex items-center justify-center relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <BookOpen size={48} className={`${catText} opacity-40 transform group-hover:scale-110 transition-transform duration-500`} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col relative z-20">
                      <h3 className="font-black text-lg text-slate-800 line-clamp-2 leading-snug mb-4 group-hover:text-brand-600 transition-colors">
                        {tryout.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                          <Clock size={12} className="text-amber-500" />
                          <span className="text-[10px] font-bold text-slate-600">{tryout.duration_minutes}m</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                          <BookOpen size={12} className="text-brand-500" />
                          <span className="text-[10px] font-bold text-slate-600">{tryout.questions_count || '?'} soal</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/tryouts/${tryout.id}`} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-center text-sm transition-colors border border-slate-100">
                          Info
                        </Link>
                        <Link href={`/tryout/${tryout.id}`} className="flex-1 group/btn relative overflow-hidden bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-center text-sm transition-colors shadow-md shadow-brand-500/20 flex items-center justify-center gap-1">
                           <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                           <span className="relative z-10 flex items-center gap-1.5"><PlayCircle size={16} /> Mulai</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sub-category Analytics (Radar Chart) */}
            {analytics?.all_subjects && analytics.all_subjects.length > 2 && (
              <div className="mt-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <BarChart3 size={22} className="text-brand-500" /> Pemetaan Kemampuan
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Radar chart persentase skor berdasarkan sub-materi</p>
                  </div>
                </div>
                
                <div className="h-[350px] w-full bg-slate-50 rounded-3xl border border-slate-100 p-4 mb-6 relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
                  <ResponsiveContainer width="100%" height="100%" className="relative z-10" minWidth={1} minHeight={1}>
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={analytics.all_subjects}>
                      <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip 
                        formatter={(value: any) => [`${value}%`, 'Penguasaan']}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Radar name="Penguasaan" dataKey="percentage" stroke="#3b82f6" strokeWidth={3} fill="url(#colorUv)" fillOpacity={1} />
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <h4 className="text-xs font-black text-emerald-600 uppercase mb-3 flex items-center gap-1.5"><TrendingUp size={14} /> Paling Dikuasai</h4>
                    <ul className="space-y-2">
                      {analytics.strongest_subjects.map((sub: any) => (
                        <li key={sub.name} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700 truncate mr-2">{sub.name}</span>
                          <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">{sub.percentage}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                    <h4 className="text-xs font-black text-rose-600 uppercase mb-3 flex items-center gap-1.5"><Target size={14} /> Perlu Latihan</h4>
                    <ul className="space-y-2">
                      {analytics.weakest_subjects.map((sub: any) => (
                        <li key={sub.name} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700 truncate mr-2">{sub.name}</span>
                          <span className="font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">{sub.percentage}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Progress Card */}
            {analytics && analytics.total_tryouts > 0 ? (
              <div className="bg-slate-900 rounded-[2rem] p-7 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-800">
                <div className="absolute right-0 top-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-0 bottom-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <h3 className="font-black text-xl mb-6">Skor Per Kategori</h3>
                  <div className="space-y-5">
                    {[
                      { label: 'TWK', score: analytics.avg_twk, pg: 65, color: 'bg-rose-500', shadow: 'shadow-rose-500/50' },
                      { label: 'TIU', score: analytics.avg_tiu, pg: 80, color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
                      { label: 'TKP', score: analytics.avg_tkp, pg: 166, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
                    ].map(item => {
                      const percentage = Math.min((item.score / (item.pg * 1.5)) * 100, 100);
                      const isPass = item.score >= item.pg;
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-slate-300">{item.label}</span>
                            <span className={`font-black text-lg leading-none ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {item.score} <span className="text-slate-500 font-medium text-xs ml-0.5">/ {item.pg}</span>
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full ${item.color} ${item.shadow} shadow-lg rounded-full transition-all duration-1000 ease-out relative`}
                              style={{ width: `${percentage}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 w-full h-full rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Link href="/analytics" className="mt-8 bg-white/10 hover:bg-white/20 border border-white/10 text-white w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors backdrop-blur-sm">
                    Lihat Analitik Lengkap <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100 rounded-[2rem] p-8 text-center shadow-sm">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                  <Sparkles className="text-brand-500" size={36} />
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-2">Mulai Perjalanan!</h3>
                <p className="text-slate-600 text-sm mb-6">Kerjakan tryout pertama untuk merekam progres dan analitik Anda.</p>
                <Link href="/tryouts" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-brand-500/30">
                  <PlayCircle size={18} /> Mulai Sekarang
                </Link>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-7 shadow-sm">
              <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg"><Sparkles size={18} /></div> Tips Hari Ini
              </h3>
              <div className="space-y-4">
                {[
                  { text: 'Kerjakan tryout secara rutin, minimal 1x sehari.', icon: '🎯' },
                  { text: 'Fokuskan latihan pada sub-kategori terlemah Anda.', icon: '📊' },
                  { text: 'Gunakan drill khusus TWK/TIU/TKP untuk pendalaman.', icon: '🔥' },
                  { text: 'Review pembahasan setelah selesai mengerjakan.', icon: '📖' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                    <span className="text-lg shrink-0 leading-none">{tip.icon}</span>
                    <span className="font-medium">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
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
