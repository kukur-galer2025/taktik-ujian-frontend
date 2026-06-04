"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, FileText, CheckCircle, Wallet, TrendingUp, TrendingDown, ArrowUpRight, Package, Calendar, ShieldCheck, Activity, Clock } from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
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
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <Loader2 className="animate-spin text-brand-600 mb-4 relative z-10" size={40} />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-sm relative z-10 animate-pulse">Memuat Metrik Sistem...</p>
      </div>
    );
  }

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50 min-h-screen selection:bg-brand-500 selection:text-white">
      {/* Premium Header Panel */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-1/2 -left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px]" />
           <div className="absolute -bottom-1/2 -right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <ShieldCheck size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                 Halo, {user?.name?.split(' ')[0] || 'Admin'}! 👋
               </h1>
               <p className="text-slate-300 font-medium">Berikut adalah rangkuman aktivitas dan performa platform hari ini.</p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center shadow-lg">
               <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                 <Activity size={12} /> Status Sistem
               </p>
               <p className="text-sm font-black text-white">Online & Optimal</p>
             </div>
           </div>
         </div>
      </div>

      {/* 3D Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Pengguna', value: stats?.totalUsers || 0, icon: Users, color: 'blue', desc: 'Akun Terdaftar' },
          { title: 'Pendapatan', value: formatRupiah(stats?.totalRevenue || 0), icon: Wallet, color: 'emerald', desc: 'Total Sales Masuk' },
          { title: 'Ujian Selesai', value: stats?.totalResults || 0, icon: CheckCircle, color: 'purple', desc: 'Sesi Ujian Selesai' },
          { title: 'Total Tryout', value: stats?.totalTryouts || 0, icon: FileText, color: 'amber', desc: 'Paket Tersedia' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{opacity: 0, y: 20}} 
            animate={{opacity: 1, y: 0}} 
            transition={{delay: 0.1 * i}} 
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shadow-sm border border-${stat.color}-100 shrink-0`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-slate-900 leading-none mb-2">{stat.value}</p>
                <p className={`text-[10px] font-bold text-${stat.color}-600 uppercase tracking-wider bg-${stat.color}-50 px-2 py-0.5 rounded-md inline-block`}>{stat.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                <TrendingUp className="text-brand-500" size={24} /> Tren Pendapatan 6 Bulan
              </h2>
              <p className="text-sm font-medium text-slate-500">Pergerakan transaksi yang dikonfirmasi bulan per bulan.</p>
            </div>
            <Link href="/admin/analytics" className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
              Laporan Detail <ArrowUpRight size={16} />
            </Link>
          </div>
          
          <div className="h-72 flex items-end gap-3 sm:gap-6 px-2 relative z-10">
            {stats?.monthlyRevenue?.reverse().map((data: any, idx: number) => {
              const maxRevenue = Math.max(...stats.monthlyRevenue.map((d: any) => d.revenue), 1000000);
              const heightPercent = Math.max((data.revenue / maxRevenue) * 100, 5);
              
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center group h-full relative pb-10">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2 bg-slate-900 text-white text-sm font-black py-2 px-4 rounded-xl pointer-events-none whitespace-nowrap z-20 shadow-xl border border-slate-700">
                    {formatRupiah(data.revenue)}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-slate-100 rounded-t-2xl group-hover:bg-brand-500 transition-colors relative overflow-hidden shadow-inner"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-600 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className="absolute bottom-0 text-xs sm:text-sm font-black text-slate-500 group-hover:text-brand-600 transition-colors truncate w-full text-center py-2 border-t border-slate-100">
                    {data.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <h2 className="text-xl font-black text-slate-900 mb-2">Status Pesanan</h2>
          <p className="text-sm font-medium text-slate-500 mb-8">Kondisi antrean validasi pembayaran saat ini.</p>
          
          <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
            <div className="flex items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                   <p className="font-black text-amber-900 text-sm">Menunggu Konfirmasi</p>
                   <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Perlu Tindakan</p>
                </div>
              </div>
              <span className="text-3xl font-black text-amber-700">{stats?.orderStatusDistribution?.pending || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle size={20} />
                </div>
                <div>
                   <p className="font-black text-emerald-900 text-sm">Dikonfirmasi</p>
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Transaksi Sukses</p>
                </div>
              </div>
              <span className="text-3xl font-black text-emerald-700">{stats?.orderStatusDistribution?.confirmed || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-200 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
                  <TrendingDown size={20} />
                </div>
                <div>
                   <p className="font-black text-red-900 text-sm">Ditolak</p>
                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Transaksi Gagal</p>
                </div>
              </div>
              <span className="text-3xl font-black text-red-700">{stats?.orderStatusDistribution?.rejected || 0}</span>
            </div>
            
            {stats?.orderStatusDistribution?.pending > 0 && (
              <Link href="/admin/orders" className="mt-4 block w-full py-4 bg-amber-500 hover:bg-amber-600 text-white text-center text-sm font-black rounded-2xl transition-all shadow-lg shadow-amber-500/30 group relative overflow-hidden">
                <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center justify-center gap-2">Validasi Pesanan Baru <ArrowUpRight size={18} /></span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-black text-slate-900">Pesanan Masuk Terkini</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Live Feed</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition-colors">Lihat Semua</Link>
          </div>
          <div className="divide-y divide-slate-100 p-4">
            {stats?.recentOrders?.map((order: any) => (
              <div key={order.id} className="p-4 sm:p-5 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                    order.status === 'rejected' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {order.status === 'confirmed' ? <CheckCircle size={20} /> :
                     order.status === 'rejected' ? <TrendingDown size={20} /> :
                     <Clock size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{order.user?.name}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-1 group-hover:text-brand-600 transition-colors">{order.bundle?.title || order.tryout?.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-base">{formatRupiah(order.final_amount)}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md mt-1 inline-block ${
                    order.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {stats?.recentOrders?.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-bold">Belum ada pesanan terbaru.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Bundles */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-black text-slate-900">Leaderboard Produk</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Bundle Terlaris</p>
          </div>
          <div className="divide-y divide-slate-100 p-4 space-y-2">
            {stats?.topBundles?.map((bundle: any, idx: number) => (
              <div key={bundle.id} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-600 border-yellow-200' :
                  idx === 1 ? 'bg-slate-200 text-slate-600 border-slate-300' :
                  idx === 2 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-brand-50 text-brand-600 border-brand-100'
                }`}>
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-sm mb-1.5">{bundle.title}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Package size={12} className="text-brand-500"/> {bundle.orders_count} Sales
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                      <Wallet size={12}/> {formatRupiah(bundle.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {stats?.topBundles?.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-bold">Belum ada data penjualan bundle.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
