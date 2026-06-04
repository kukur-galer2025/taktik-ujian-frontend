"use client";

import { useEffect, useState } from "react";
import {
  Loader2, CheckCircle2, XCircle, Clock, Eye, X, AlertCircle, ShoppingCart, Search, Receipt, Shield, Package
} from "lucide-react";
import axios from "@/lib/axios";
import { Toast } from '@/lib/sweetalert';
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await axios.put(`/api/admin/orders/${selectedOrder.id}/status`, { status, admin_notes: adminNotes });
      setSelectedOrder(null);
      setAdminNotes('');
      fetchOrders();
      Toast.fire({ icon: 'success', title: 'Status pesanan berhasil diperbarui' });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: 'error', title: 'Gagal mengupdate status pesanan' });
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    pending: { label: 'Menunggu', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', icon: Clock },
    confirmed: { label: 'Dikonfirmasi', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', icon: CheckCircle2 },
    rejected: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-100 border-red-200', icon: XCircle },
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = search === '' || 
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toString().includes(search);
    return matchFilter && matchSearch;
  });
  
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
         
         <div className="relative z-10 flex flex-col items-center">
           <div className="relative">
             <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <Receipt size={24} className="text-brand-600 animate-pulse" />
             </div>
           </div>
           <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Transaksi...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 selection:bg-brand-500 selection:text-white">
      {/* Premium Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px]" />
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-amber-500/20 rounded-full blur-[80px]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <ShoppingCart size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1 flex items-center gap-3">
                 Manajemen Transaksi
                 {pendingCount > 0 && (
                   <span className="bg-red-500 text-white text-xs font-black uppercase px-3 py-1 rounded-lg ml-2 shadow-sm shadow-red-500/30 border border-red-400 flex items-center gap-1.5 animate-pulse">
                     <AlertCircle size={14} /> {pendingCount} Perlu Review
                   </span>
                 )}
               </h1>
               <p className="text-slate-300 font-medium">Verifikasi dan validasi pembayaran pengguna Anda secara aman.</p>
             </div>
           </div>
           
           <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shadow-lg min-w-[160px]">
             <p className="text-xs font-black text-brand-200 uppercase tracking-widest mb-1">Total Pesanan</p>
             <p className="text-2xl font-black text-white">{orders.length}</p>
           </div>
         </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-6 justify-between sm:items-center relative z-10">
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'Semua Status', count: orders.length, color: 'brand' },
            { key: 'pending', label: 'Menunggu', count: pendingCount, color: 'amber' },
            { key: 'confirmed', label: 'Dikonfirmasi', count: orders.filter(o => o.status === 'confirmed').length, color: 'emerald' },
            { key: 'rejected', label: 'Ditolak', count: orders.filter(o => o.status === 'rejected').length, color: 'red' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                filter === tab.key
                  ? `bg-slate-900 text-white shadow-md shadow-slate-900/20`
                  : `bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100`
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-md text-xs ${filter === tab.key ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari ID, Nama, atau Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-5 rounded-tl-[2rem]">ID Pesanan</th>
                <th className="px-6 py-5">Pengguna</th>
                <th className="px-6 py-5">Pembelian</th>
                <th className="px-6 py-5 text-right">Total Bayar</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-center">Tanggal</th>
                <th className="px-6 py-5 text-right rounded-tr-[2rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(order => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = sc.icon;
                return (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors group ${order.status === 'pending' ? 'bg-amber-50/20' : ''}`}>
                    <td className="px-6 py-5">
                       <span className="inline-flex items-center gap-1.5 font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-sm group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                         #{order.id}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800 text-sm">{order.user?.name}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                         <Package size={16} className="text-slate-400" />
                         <span className="text-sm font-bold text-slate-700 max-w-[200px] truncate">{order.bundle?.title || '-'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-base font-black text-slate-900 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl inline-block shadow-sm">
                        {formatRupiah(order.final_amount)}
                      </div>
                      {order.discount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1 flex items-center justify-end gap-1">
                          <CheckCircle2 size={10} /> Diskon {formatRupiah(order.discount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-lg border ${sc.bg} ${sc.color} shadow-sm`}>
                        <StatusIcon size={14} /> {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500 text-center whitespace-nowrap">
                       <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => { setSelectedOrder(order); setAdminNotes(order.admin_notes || ''); }}
                        className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-100 text-brand-600 hover:bg-brand-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-brand-500/30 hover:-translate-y-0.5"
                      >
                        <Eye size={16} /> Tinjau
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <ShoppingCart size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold text-lg text-slate-600 mb-1">Tidak Ada Pesanan</p>
                    <p className="text-sm font-medium">Belum ada data pesanan yang sesuai dengan filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Detail Modal */}
      <AnimatePresence>
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
            className="bg-white w-full sm:max-w-xl sm:rounded-[2.5rem] rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 border border-slate-100"
          >
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-20">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Shield size={22} className="text-brand-500" /> Validasi Pesanan
                </h2>
                <p className="text-xs font-bold text-slate-500 mt-1">ID Pesanan: #{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* User Info Card */}
              <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-100 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl" />
                
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Pembeli</h3>
                <div className="space-y-3 relative z-10 text-sm">
                  <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">Nama Pengguna</span><span className="font-black text-slate-800">{selectedOrder.user?.name}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">Alamat Email</span><span className="font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">{selectedOrder.user?.email}</span></div>
                  <div className="flex justify-between items-start mt-2 pt-3 border-t border-slate-200/60">
                    <span className="text-slate-500 font-bold pt-1">Paket Bundle</span>
                    <span className="font-black text-slate-800 text-right max-w-[200px] leading-snug">{selectedOrder.bundle?.title}</span>
                  </div>
                  <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">Harga Asli</span><span className="font-bold text-slate-700">{formatRupiah(selectedOrder.amount)}</span></div>
                  {selectedOrder.voucher_code && (
                    <div className="flex justify-between items-center"><span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Voucher ({selectedOrder.voucher_code})</span><span className="font-black text-emerald-600">-{formatRupiah(selectedOrder.discount)}</span></div>
                  )}
                  <div className="flex justify-between items-end mt-2 pt-4 border-t border-slate-200/60">
                    <span className="font-black text-slate-900">Total Harus Dibayar</span>
                    <span className="text-2xl font-black text-brand-600 leading-none bg-white px-3 py-1.5 rounded-xl border border-brand-100 shadow-sm">{formatRupiah(selectedOrder.final_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Proof Card */}
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                  <Receipt size={18} className="text-brand-500" /> Bukti Transfer (QRIS / Bank)
                </h3>
                {selectedOrder.payment_proof ? (
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col items-center gap-4">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${selectedOrder.payment_proof}`} 
                      alt="Preview Bukti" 
                      className="w-full max-h-64 object-contain rounded-2xl border-2 border-white shadow-md bg-slate-200" 
                    />
                    <a 
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${selectedOrder.payment_proof}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center text-sm font-black text-brand-600 hover:text-white bg-brand-50 hover:bg-brand-600 py-3 rounded-xl transition-colors border border-brand-100 hover:border-transparent flex items-center justify-center gap-2"
                    >
                      <Eye size={16} /> Buka Gambar Ukuran Penuh
                    </a>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-center">
                    <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-red-700">Tidak ada bukti pembayaran yang diunggah.</p>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-brand-500" /> Catatan Admin (Alasan Penolakan)
                </h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all h-28 resize-none shadow-sm"
                  placeholder="Tulis alasan jika pesanan ditolak (misal: nominal transfer kurang, bukti buram, dll)"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100">
                {selectedOrder.status === 'pending' ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleUpdateStatus('rejected')}
                      disabled={updating}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-4 rounded-2xl font-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {updating ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />} Tolak Pesanan
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('confirmed')}
                      disabled={updating}
                      className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 text-sm group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      {updating ? <Loader2 size={18} className="animate-spin relative z-10" /> : <CheckCircle2 size={18} className="relative z-10 group-hover:scale-110 transition-transform" />} 
                      <span className="relative z-10">Konfirmasi Pembayaran</span>
                    </button>
                  </div>
                ) : (
                  <div className={`p-5 rounded-2xl text-sm font-black flex items-center justify-center gap-3 border shadow-sm ${
                    selectedOrder.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {selectedOrder.status === 'confirmed' ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
                    Pesanan ini telah diverifikasi dan {selectedOrder.status === 'confirmed' ? 'dikonfirmasi' : 'ditolak'}.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
      
      {/* Shimmer CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
