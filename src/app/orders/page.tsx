"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Receipt, Clock, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, Package, ShoppingCart, ArrowLeft, Upload, Banknote, Sparkles
} from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import InvoiceModal from "@/components/InvoiceModal";
import { Toast } from '@/lib/sweetalert';
import { Printer } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const handleReupload = async (orderId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Toast.fire({ icon: 'error', title: 'Ukuran gambar maksimal 2MB' });
      return;
    }

    setUploadingId(orderId);
    const formData = new FormData();
    formData.append("payment_proof", file);

    try {
      const res = await axios.post(`/api/orders/${orderId}/reupload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      Toast.fire({ icon: 'success', title: res.data.message });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'pending', admin_notes: null } : o));
    } catch (err: any) {
      console.error(err);
      Toast.fire({ icon: 'error', title: err.response?.data?.message || "Gagal mengunggah ulang bukti bayar" });
    } finally {
      setUploadingId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get("/api/orders/my");
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Receipt size={24} className="text-amber-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Riwayat Transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-12 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Link href="/bundles" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        {/* Premium Header Container */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl border border-slate-800">
           {/* Animated Background Elements */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-1/2 -left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px]" />
             <div className="absolute -bottom-1/2 -right-1/4 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[80px]" />
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
           </div>

           <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
             <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
                 <Receipt size={32} />
               </div>
               <div>
                 <h1 className="text-3xl font-black text-white tracking-tight mb-1">Riwayat Transaksi</h1>
                 <p className="text-slate-300 font-medium">Melacak status {orders.length} pesanan dan pembayaran Anda.</p>
               </div>
             </div>
             
             {orders.length > 0 && (
               <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center shadow-lg">
                 <p className="text-xs font-black text-brand-200 uppercase tracking-widest mb-1">Total Pembelian</p>
                 <p className="text-xl font-black text-white">
                    {formatRupiah(orders.filter(o => o.status === 'confirmed').reduce((sum, o) => sum + Number(o.final_amount), 0))}
                 </p>
               </div>
             )}
           </div>
        </div>

        <div className="space-y-6">
          {orders.map((order, i) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:-translate-y-1 transition-transform duration-300 relative group"
              >
                {/* Accent line for status */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${order.status === 'confirmed' ? 'bg-emerald-500' : order.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />

                <div className="p-6 sm:p-8 pl-8 sm:pl-10 relative">
                  {order.status === 'confirmed' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
                  {order.status === 'pending' && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />}
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 shadow-sm group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-100 transition-all">
                        {order.tryout ? <Receipt size={24} /> : <Package size={24} />}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg sm:text-xl mb-1 group-hover:text-brand-700 transition-colors">
                          {order.tryout ? order.tryout.title : (order.bundle?.title || 'Paket Dihapus')}
                        </h3>
                        <p className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 inline-block">ID Transaksi: <span className="text-slate-600">#{order.id}</span> • {formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border ${sc.bg} ${sc.color} self-start sm:self-auto shadow-sm`}>
                      <StatusIcon size={16} /> {sc.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 relative z-10">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Banknote size={12} /> Harga Asli</p>
                      <p className="text-sm font-bold text-slate-700">{formatRupiah(order.amount)}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Sparkles size={12} className="text-emerald-500" /> Diskon</p>
                      <p className="text-sm font-bold text-emerald-600">{order.discount > 0 ? `- ${formatRupiah(order.discount)}` : '-'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-brand-100 shadow-sm ring-1 ring-brand-500/10">
                      <p className="text-[10px] sm:text-xs font-black text-brand-500 uppercase tracking-widest mb-1">Total Bayar</p>
                      <p className="text-lg font-black text-brand-700">{formatRupiah(order.final_amount)}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Kode Voucher</p>
                      <p className="text-sm font-black text-slate-700">{order.voucher_code || 'TIDAK ADA'}</p>
                    </div>
                  </div>

                  {order.admin_notes && (
                    <div className={`mt-5 p-4 rounded-2xl text-sm font-medium flex items-start gap-3 border shadow-sm relative z-10 ${
                      order.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black uppercase tracking-wider text-[11px] block mb-1 opacity-80">Catatan Admin</span>
                        {order.admin_notes}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end gap-3 relative z-10">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => setSelectedInvoice(order.id)}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border border-slate-200"
                      >
                        <Printer size={16} /> Unduh Invoice PDF
                      </button>
                    )}

                    {order.status === 'rejected' && (
                      <div className="relative">
                        <input 
                          type="file" 
                          id={`reupload-${order.id}`}
                          className="hidden" 
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handleReupload(order.id, e)}
                          disabled={uploadingId === order.id}
                        />
                        <label 
                          htmlFor={`reupload-${order.id}`}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all cursor-pointer shadow-lg group relative overflow-hidden ${
                            uploadingId === order.id 
                            ? 'bg-slate-100 text-slate-500 cursor-not-allowed shadow-none' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30'
                          }`}
                        >
                          {uploadingId === order.id ? (
                            <><Loader2 size={18} className="animate-spin relative z-10" /> <span className="relative z-10">Mengunggah...</span></>
                          ) : (
                            <>
                              <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                              <Upload size={18} className="relative z-10 group-hover:-translate-y-1 transition-transform" /> <span className="relative z-10">Upload Ulang Bukti Bayar</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="relative w-40 h-40 mx-auto mb-8">
                <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-50 duration-1000" />
                <div className="relative w-40 h-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <ShoppingCart size={56} className="text-slate-300" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Belum Ada Riwayat Transaksi</h3>
              <p className="text-slate-500 text-base max-w-sm mx-auto mb-8 font-medium">
                Mulai perjalanan belajarmu sekarang. Beli paket Tryout Premium atau Bundle untuk mengakses ribuan soal berkualitas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/bundles"
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-brand-500/20 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <Package size={20} className="relative z-10" /> <span className="relative z-10">Eksplor Bundle Spesial</span>
                </Link>
                
                <Link
                  href="/tryouts"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-black py-4 px-8 rounded-2xl transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:-translate-y-1"
                >
                  <ChevronRight size={20} /> Tryout Satuan
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Shimmer CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
      <MobileBottomNav />

      {selectedInvoice && (
        <InvoiceModal 
          orderId={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
}
