"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, BarChart2, Calendar, Target, Award, PieChart, Activity } from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Memuat Data Analitik...</p>
      </div>
    );
  }

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const currentMonthRevenue = stats?.monthlyRevenue?.[0]?.revenue || 0;
  const previousMonthRevenue = stats?.monthlyRevenue?.[1]?.revenue || 0;
  const growth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <BarChart2 className="text-brand-500" size={28} /> Analitik & Laporan
        </h1>
        <p className="text-slate-500 text-sm mt-1">Laporan lengkap performa keuangan dan pengguna TaktikUjian.</p>
      </div>

      {/* Main KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-brand-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="relative z-10">
            <p className="text-brand-100 font-bold uppercase tracking-wider text-xs mb-2">Total Pendapatan (Bulan Ini)</p>
            <h2 className="text-4xl font-black mb-4">{formatRupiah(currentMonthRevenue)}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">
              <TrendingUp size={16} /> 
              {growth >= 0 ? '+' : ''}{growth}% dari bulan lalu
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Rata-rata Transaksi</p>
            <h3 className="text-2xl font-black text-slate-900">
              {stats?.orderStatusDistribution?.confirmed > 0 
                ? formatRupiah(stats.totalRevenue / stats.orderStatusDistribution.confirmed) 
                : 'Rp 0'}
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-4 font-medium">Berdasarkan total {stats?.orderStatusDistribution?.confirmed || 0} transaksi berhasil.</p>
        </motion.div>

        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Tingkat Penyelesaian Ujian</p>
            <h3 className="text-2xl font-black text-slate-900">
              {stats?.totalResults > 0 
                ? Math.round((stats.totalResults / (stats.totalTryouts * stats.totalUsers || 1)) * 100) 
                : 0}%
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-4 font-medium">{stats?.totalResults} ujian telah diselesaikan sejauh ini.</p>
        </motion.div>
      </div>

      {/* Revenue Chart Full Width */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
          <Calendar className="text-brand-500" size={20} /> Tren Pendapatan (6 Bulan Terakhir)
        </h2>
        <div className="h-80 flex items-end gap-2 sm:gap-6 px-2">
          {stats?.monthlyRevenue?.reverse().map((data: any, idx: number) => {
            const maxRevenue = Math.max(...stats.monthlyRevenue.map((d: any) => d.revenue), 1000000);
            const heightPercent = Math.max((data.revenue / maxRevenue) * 100, 5); 
            
            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center group h-full relative pb-8">
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-sm font-bold py-2 px-4 rounded-xl pointer-events-none whitespace-nowrap z-10 shadow-xl">
                  {formatRupiah(data.revenue)}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
                <div 
                  className="w-full max-w-[60px] bg-slate-100 rounded-t-xl group-hover:bg-brand-500 transition-colors relative overflow-hidden border-b-2 border-slate-200 group-hover:border-brand-600"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-600 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="absolute bottom-0 text-sm font-bold text-slate-500 truncate w-full text-center mt-4">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
