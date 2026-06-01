"use client";

import { useEffect, useState } from "react";
import {
  Loader2, CheckCircle2, XCircle, Clock, Eye, X, AlertCircle, ShoppingCart
} from "lucide-react";
import axios from "@/lib/axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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
    } catch (err) {
      console.error(err);
      alert("Gagal mengupdate status pesanan.");
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
    confirmed: { label: 'Dikonfirmasi', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    rejected: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-50' },
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Manajemen Pesanan
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{pendingCount} baru</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm">Konfirmasi atau tolak pembayaran pengguna.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'Semua', count: orders.length },
          { key: 'pending', label: 'Menunggu', count: orders.filter(o => o.status === 'pending').length },
          { key: 'confirmed', label: 'Dikonfirmasi', count: orders.filter(o => o.status === 'confirmed').length },
          { key: 'rejected', label: 'Ditolak', count: orders.filter(o => o.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === tab.key
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
            }`}
          >
            {tab.label} <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs sm:text-sm">
                <th className="px-4 sm:px-6 py-4 font-semibold">ID</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Pengguna</th>
                <th className="px-4 sm:px-6 py-4 font-semibold">Bundle</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Tanggal</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(order => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                return (
                  <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${order.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-slate-800">#{order.id}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{order.user?.name}</div>
                      <div className="text-xs text-slate-400">{order.user?.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-slate-600 font-medium">{order.bundle?.title || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-black text-slate-900 text-right">
                      {formatRupiah(order.final_amount)}
                      {order.discount > 0 && (
                        <span className="block text-xs text-emerald-600 font-medium">Diskon {formatRupiah(order.discount)}</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs text-slate-500 text-center whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedOrder(order); setAdminNotes(order.admin_notes || ''); }}
                        className="inline-flex items-center gap-1 bg-brand-50 text-brand-600 hover:bg-brand-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                      >
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-medium">Tidak ada pesanan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Detail Pesanan #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* User Info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Pengguna</span><span className="font-bold">{selectedOrder.user?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium">{selectedOrder.user?.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Bundle</span><span className="font-bold">{selectedOrder.bundle?.title}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Harga Asli</span><span className="font-medium">{formatRupiah(selectedOrder.amount)}</span></div>
                {selectedOrder.voucher_code && (
                  <div className="flex justify-between"><span className="text-slate-500">Voucher</span><span className="font-bold text-brand-600">{selectedOrder.voucher_code} (-{formatRupiah(selectedOrder.discount)})</span></div>
                )}
                <div className="flex justify-between border-t pt-2"><span className="font-bold text-slate-700">Total Bayar</span><span className="font-black text-brand-600">{formatRupiah(selectedOrder.final_amount)}</span></div>
              </div>

              {/* Payment Proof */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Bukti Pembayaran:</p>
                {selectedOrder.payment_proof ? (
                  <img src={selectedOrder.payment_proof} alt="Bukti" className="w-full rounded-xl border border-slate-200 shadow-sm" />
                ) : (
                  <p className="text-sm text-slate-400 italic">Tidak ada bukti pembayaran.</p>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Admin (Opsional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 h-20 resize-none"
                  placeholder="Tulis catatan jika perlu (misal: alasan penolakan)"
                />
              </div>

              {/* Action Buttons */}
              {selectedOrder.status === 'pending' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={updating}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Konfirmasi
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={updating}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {updating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />} Tolak
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  selectedOrder.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {selectedOrder.status === 'confirmed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  Pesanan ini sudah {selectedOrder.status === 'confirmed' ? 'dikonfirmasi' : 'ditolak'}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
