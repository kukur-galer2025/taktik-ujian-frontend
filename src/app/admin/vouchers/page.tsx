"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Edit, Trash2, Tag, CheckCircle2, XCircle, Percent, DollarSign, X
} from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: '', discount_type: 'percentage', discount_value: 10,
    min_purchase: 0, max_uses: '', expires_at: '', is_active: true,
  });

  const fetchVouchers = async () => {
    try {
      const res = await axios.get("/api/admin/vouchers");
      setVouchers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVouchers(); }, []);

  const resetForm = () => {
    setFormData({ code: '', discount_type: 'percentage', discount_value: 10, min_purchase: 0, max_uses: '', expires_at: '', is_active: true });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        max_uses: formData.max_uses ? parseInt(formData.max_uses as string) : null,
        expires_at: formData.expires_at || null,
      };

      if (editingId) {
        await axios.put(`/api/admin/vouchers/${editingId}`, payload);
        toast.success("Voucher berhasil diperbarui!");
      } else {
        await axios.post("/api/admin/vouchers", payload);
        toast.success("Voucher baru berhasil ditambahkan!");
      }
      setShowModal(false);
      resetForm();
      fetchVouchers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus voucher ini?")) return;
    try {
      await axios.delete(`/api/admin/vouchers/${id}`);
      toast.success("Voucher berhasil dihapus!");
      fetchVouchers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus voucher.");
    }
  };

  const openEdit = (v: any) => {
    setEditingId(v.id);
    setFormData({
      code: v.code,
      discount_type: v.discount_type,
      discount_value: v.discount_value,
      min_purchase: v.min_purchase,
      max_uses: v.max_uses?.toString() || '',
      expires_at: v.expires_at ? new Date(v.expires_at).toISOString().slice(0, 16) : '',
      is_active: v.is_active,
    });
    setShowModal(true);
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Voucher</h1>
          <p className="text-slate-500 text-sm">Buat dan kelola kode voucher diskon untuk pengguna.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors"
        >
          <Plus size={20} /> Tambah Voucher
        </button>
      </div>

      {/* Voucher Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs sm:text-sm">
                <th className="px-4 sm:px-6 py-4 font-semibold">Kode</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Tipe</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Nilai</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Penggunaan</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Berlaku s/d</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-4 sm:px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vouchers.map(v => {
                const isExpired = v.expires_at && new Date(v.expires_at) < new Date();
                const isMaxed = v.max_uses && v.used_count >= v.max_uses;
                return (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="font-mono font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-lg text-sm">{v.code}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        v.discount_type === 'percentage' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {v.discount_type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                        {v.discount_type === 'percentage' ? 'Persentase' : 'Nominal'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center font-bold text-slate-800 text-sm">
                      {v.discount_type === 'percentage' ? `${v.discount_value}%` : formatRupiah(v.discount_value)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-sm">
                      <span className="font-bold text-slate-800">{v.used_count}</span>
                      <span className="text-slate-400"> / {v.max_uses || '∞'}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-xs text-slate-500">
                      {v.expires_at ? new Date(v.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Tidak ada'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      {!v.is_active || isExpired || isMaxed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                          <XCircle size={12} /> Nonaktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                          <CheckCircle2 size={12} /> Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(v)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Tag size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-medium">Belum ada voucher. Klik tombol "Tambah Voucher" untuk mulai.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[95vh] flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-blue-500"></div>

              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Edit size={20} className="text-brand-500" />
                  {editingId ? "Edit Voucher" : "Tambah Voucher Baru"}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kode Voucher</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Misal: DISKON50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipe Diskon</label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center py-3 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${
                    formData.discount_type === 'percentage' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-500'
                  }`}>
                    <input type="radio" className="hidden" checked={formData.discount_type === 'percentage'} onChange={() => setFormData({ ...formData, discount_type: 'percentage' })} />
                    <Percent size={14} className="mr-1.5" /> Persentase
                  </label>
                  <label className={`flex-1 flex items-center justify-center py-3 border-2 rounded-xl cursor-pointer font-bold text-sm transition-all ${
                    formData.discount_type === 'fixed' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-500'
                  }`}>
                    <input type="radio" className="hidden" checked={formData.discount_type === 'fixed'} onChange={() => setFormData({ ...formData, discount_type: 'fixed' })} />
                    <DollarSign size={14} className="mr-1.5" /> Nominal Tetap
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Nilai Diskon {formData.discount_type === 'percentage' ? '(%)' : '(Rupiah)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={formData.discount_type === 'percentage' ? 100 : undefined}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Min. Pembelian (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_purchase}
                    onChange={(e) => setFormData({ ...formData, min_purchase: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Maks Penggunaan</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Kosong = Tak terbatas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Berlaku Sampai (Opsional)</label>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-700">Voucher aktif dan bisa dipakai</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Simpan
                </button>
                </div>
              </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
