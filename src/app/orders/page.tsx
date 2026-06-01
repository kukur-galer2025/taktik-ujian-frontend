"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Receipt, Clock, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, Package, ShoppingCart, ArrowLeft
} from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [userRes, ordersRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/orders/my"),
        ]);
        setUser(userRes.data);
        setOrders(ordersRes.data);
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
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: 'Menunggu Konfirmasi', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
    confirmed: { label: 'Dikonfirmasi', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
    rejected: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Riwayat Pembelian...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/bundles" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Kembali ke Bundle
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Riwayat Pembelian</h1>
            <p className="text-sm text-slate-500">{orders.length} pesanan ditemukan</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order, i) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{order.bundle?.title || 'Paket Dihapus'}</h3>
                        <p className="text-xs text-slate-400">Pesanan #{order.id} • {formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.bg} ${sc.color} self-start sm:self-auto`}>
                      <StatusIcon size={14} />
                      {sc.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3">
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-0.5">Harga Asli</p>
                      <p className="text-sm font-bold text-slate-700">{formatRupiah(order.amount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-0.5">Diskon</p>
                      <p className="text-sm font-bold text-emerald-600">{order.discount > 0 ? `- ${formatRupiah(order.discount)}` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-0.5">Total Bayar</p>
                      <p className="text-sm font-black text-brand-600">{formatRupiah(order.final_amount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-0.5">Voucher</p>
                      <p className="text-sm font-bold text-slate-700">{order.voucher_code || '-'}</p>
                    </div>
                  </div>

                  {order.admin_notes && (
                    <div className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                      order.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span><strong>Catatan Admin:</strong> {order.admin_notes}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-6"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-brand-100 rounded-full animate-pulse" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                  <ShoppingCart size={48} className="text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Belum Ada Pembelian</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                Mulai perjalanan belajarmu! Beli paket bundle untuk mengakses ribuan soal tryout.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/bundles"
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:-translate-y-0.5"
                >
                  <Package size={18} /> Lihat Paket Bundle
                </Link>
                <Link
                  href="/tryouts"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all hover:border-brand-300 hover:text-brand-600"
                >
                  <ChevronRight size={18} /> Tryout Gratis
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
