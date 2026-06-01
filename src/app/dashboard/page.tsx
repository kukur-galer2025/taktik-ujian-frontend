"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Target, ChevronRight,
  PlayCircle, Loader2, ArrowRight, Trophy, TrendingUp, BarChart3, ShieldCheck, Star,
  Sparkles, Package, Flame, Calendar
} from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tryouts, setTryouts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const [userRes, tryoutRes, analyticsRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/tryouts"),
          axios.get("/api/user/analytics"),
        ]);
        setUser(userRes.data);
        setTryouts(tryoutRes.data);
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
        <p className="text-slate-500 font-medium animate-pulse">Memuat Dashboard...</p>
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
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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

        {/* Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-600 via-brand-500 to-blue-500 rounded-3xl p-8 sm:p-10 text-white mb-8 shadow-xl shadow-brand-500/20 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
          <div className="absolute left-1/2 bottom-0 -mb-20 w-96 h-96 bg-blue-400 opacity-10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-brand-200 text-sm font-bold mb-1 flex items-center gap-2">
              <Calendar size={14} /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black mb-2">{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-brand-100 max-w-xl text-sm sm:text-base leading-relaxed">
              Konsistensi adalah kunci keberhasilan. Kerjakan tryout secara rutin untuk meningkatkan peluang Anda lolos CPNS.
            </p>
          </div>
        </motion.div>

        {/* Stats Summary (if has data) */}
        {analytics && analytics.total_tryouts > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Flame size={20} className="text-brand-600" />
                </div>
                <span className="text-sm font-bold text-slate-500">Tryout Dikerjakan</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{analytics.total_tryouts}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-slate-500">Tingkat Kelulusan</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{analytics.pass_rate}<span className="text-lg text-slate-400">%</span></p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-500">Rata-rata Skor</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{analytics.avg_twk + analytics.avg_tiu + analytics.avg_tkp}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Trophy size={20} className="text-amber-600" />
                </div>
                <span className="text-sm font-bold text-slate-500">Skor Terbaik</span>
              </div>
              <p className="text-3xl font-black text-slate-900">
                {analytics.history?.length > 0 ? Math.max(...analytics.history.map((h: any) => h.total_score)) : '-'}
              </p>
            </div>
          </motion.div>
        ) : null}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid sm:grid-cols-3 gap-4 mb-8"
        >
          <Link href="/tryouts" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all group flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform shrink-0">
              <BookOpen size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-0.5">Mulai Belajar</h3>
              <p className="text-xs text-slate-500">{tryouts.length} paket tersedia</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 ml-auto" />
          </Link>

          <Link href="/bundles" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all group flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">New</div>
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shrink-0">
              <Package size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-0.5">Paket Bundle</h3>
              <p className="text-xs text-slate-500">Hemat sampai 50%</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 ml-auto" />
          </Link>

          <Link href="/analytics" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
              <BarChart3 size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-0.5">Rapor & Analitik</h3>
              <p className="text-xs text-slate-500">Pantau perkembangan</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 ml-auto" />
          </Link>
        </motion.div>

        {/* Two Column: Recent Tryouts + Tips */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Tryouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-brand-500" /> Tryout Terbaru
              </h2>
              <Link href="/tryouts" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentTryouts.map((tryout, i) => (
                <div key={tryout.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
                  {/* Thumbnail */}
                  {tryout.cover_image ? (
                    <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={tryout.cover_image} alt={tryout.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-16 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center shrink-0">
                      <Target size={24} className="text-brand-300" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{tryout.title}</h3>
                      {tryout.category ? (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 border ${tryout.category.color?.replace(/,/g, ' ')}`}>
                          {tryout.category.name}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 border bg-slate-50 text-slate-500 border-slate-200">
                          SKD UMUM
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-amber-500" /> {tryout.duration_minutes}m</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} className="text-brand-500" /> {tryout.questions_count || '?'} soal</span>
                      {tryout.reviews_avg_rating && (
                        <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /> {parseFloat(tryout.reviews_avg_rating).toFixed(1)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/tryouts/${tryout.id}`}
                      className="text-xs font-bold text-slate-500 hover:text-brand-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-brand-200 transition-colors"
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/tryout/${tryout.id}`}
                      className="text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <PlayCircle size={14} /> Mulai
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Progress or CTA */}
            {analytics && analytics.total_tryouts > 0 ? (
              <div className="bg-slate-900 rounded-2xl p-6 text-white mb-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <h3 className="font-black text-lg mb-3">Skor Per Kategori</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'TWK', score: analytics.avg_twk, pg: 65, color: 'bg-rose-500' },
                      { label: 'TIU', score: analytics.avg_tiu, pg: 80, color: 'bg-blue-500' },
                      { label: 'TKP', score: analytics.avg_tkp, pg: 166, color: 'bg-emerald-500' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold">{item.label}</span>
                          <span className={`font-black ${item.score >= item.pg ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.score} <span className="text-slate-500 font-medium text-xs">/ {item.pg}</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-700`}
                            style={{ width: `${Math.min((item.score / (item.pg * 1.5)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/analytics" className="mt-4 text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
                    Lihat Analitik Lengkap <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center mb-4">
                <Sparkles className="mx-auto text-brand-400 mb-3" size={32} />
                <h3 className="font-black text-brand-900 text-lg mb-1">Mulai Perjalanan!</h3>
                <p className="text-brand-700 text-sm mb-4">Kerjakan tryout pertama untuk merekam progres Anda.</p>
                <Link href="/tryouts" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm">
                  <PlayCircle size={16} /> Mulai Sekarang
                </Link>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                💡 Tips Hari Ini
              </h3>
              <div className="space-y-3">
                {[
                  { text: 'Kerjakan tryout secara rutin, minimal 1x sehari.', icon: '🎯' },
                  { text: 'Fokuskan latihan pada sub-kategori terlemah Anda.', icon: '📊' },
                  { text: 'Gunakan drill khusus TWK/TIU/TKP untuk pendalaman.', icon: '🔥' },
                  { text: 'Review pembahasan setelah selesai mengerjakan.', icon: '📖' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-base shrink-0">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </main>
      <MobileBottomNav />
    </div>
  );
}
