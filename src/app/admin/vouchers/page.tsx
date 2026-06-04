"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Edit, Trash2, Tag, CheckCircle2, XCircle, Percent, DollarSign, X, Search, Ticket, Check
} from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Dialog } from '@/lib/sweetalert';

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: '', discount_type: 'percentage', discount_value: 10 as number | string,
    min_purchase: 0 as number | string, max_uses: '', expires_at: '', is_active: true,
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
        min_purchase: formData.min_purchase === '' ? 0 : parseInt(formData.min_purchase as string),
        discount_value: formData.discount_value === '' ? 0 : parseInt(formData.discount_value as string),
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
    const result = await Dialog.fire({
      icon: 'warning',
      title: 'Yakin ingin menghapus voucher ini?',
      text: 'Voucher tidak akan bisa digunakan lagi setelah dihapus.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    });
    if (!result.isConfirmed) return;

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

  const filteredVouchers = vouchers.filter(v => v.code.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 shadow-sm">
             <Ticket size={28} className="text-brand-600 animate-pulse" />
           </div>
           <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Data Voucher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 selection:bg-brand-500 selection:text-white">
      {/* Header Premium */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px] animate-[spin_20s_linear_infinite]" />
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-rose-500/20 rounded-full blur-[80px] animate-[spin_15s_linear_infinite_reverse]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <Ticket size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">Manajemen Voucher</h1>
               <p className="text-slate-300 font-medium">Buat dan kelola kode promo diskon untuk meningkatkan penjualan.</p>
             </div>
           </div>
           
           <button 
             onClick={() => { resetForm(); setShowModal(true); }}
             className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group relative overflow-hidden border border-brand-400/50"
           >
             <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
             <Plus size={20} className="relative z-10 group-hover:scale-110 transition-transform" /> 
             <span className="relative z-10">Tambah Voucher Baru</span>
           </button>
         </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-6 justify-between sm:items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 px-4 py-2.5 rounded-xl border border-brand-100 flex items-center gap-2">
            <Ticket size={18} className="text-brand-600" />
            <span className="text-sm font-black text-brand-700">Total: {vouchers.length} Voucher</span>
          </div>
        </div>

        <div className="relative max-w-sm w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari kode voucher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm uppercase"
          />
        </div>
      </div>

      {/* Voucher Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                <th className="px-8 py-6 rounded-tl-[2.5rem]">Kode Promo</th>
                <th className="px-6 py-6 text-center">Tipe Diskon</th>
                <th className="px-6 py-6 text-center">Nilai</th>
                <th className="px-6 py-6 text-center">Aturan Transaksi</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right rounded-tr-[2.5rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVouchers.map(v => {
                const isExpired = v.expires_at && new Date(v.expires_at) < new Date();
                const isMaxed = v.max_uses && v.used_count >= v.max_uses;
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-brand-700 bg-brand-50 border border-brand-200 px-4 py-2 rounded-xl text-lg tracking-widest shadow-sm w-fit group-hover:scale-105 transition-transform">{v.code}</span>
                        {v.expires_at && (
                          <span className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                            ⏰ Kedaluwarsa: {new Date(v.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border shadow-sm ${
                        v.discount_type === 'percentage' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {v.discount_type === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}
                        {v.discount_type === 'percentage' ? 'PERSENTASE' : 'NOMINAL'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="font-black text-slate-800 text-lg bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                        {v.discount_type === 'percentage' ? `${v.discount_value}%` : formatRupiah(v.discount_value)}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400">Min. Beli</span>
                        <span className="font-bold text-slate-700 text-sm">
                          {v.min_purchase > 0 ? formatRupiah(v.min_purchase) : <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Tanpa Minimum</span>}
                        </span>
                        <div className="h-px w-12 bg-slate-200 my-1"></div>
                        <span className="text-[10px] font-black uppercase text-slate-400">Penggunaan</span>
                        <span className="font-bold text-slate-700 text-sm bg-slate-100 px-2 rounded-md">
                          <span className={isMaxed ? "text-red-500" : "text-brand-600"}>{v.used_count}</span> / {v.max_uses || '∞'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      {!v.is_active || isExpired || isMaxed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 shadow-sm">
                          <XCircle size={14} /> {isExpired ? 'Kedaluwarsa' : isMaxed ? 'Habis' : 'Nonaktif'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(v)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                      <Tag size={32} className="text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-600 text-lg mb-1">Belum Ada Voucher</p>
                    <p className="text-sm font-medium text-slate-400">Buat kode promo pertama Anda untuk menarik lebih banyak peserta.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { setShowModal(false); resetForm(); }}
            />
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full sm:max-w-2xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative z-10 border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-rose-500"></div>

              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <Edit size={20} />
                  </div>
                  {editingId ? "Edit Konfigurasi Voucher" : "Buat Voucher Baru"}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 sm:p-8 flex-1 custom-scrollbar-light">
                <form id="voucherForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Identity */}
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-5">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Kode Promo <div className="h-px bg-slate-200 flex-1 ml-2" />
                    </h3>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">Kode Voucher (Unik)</label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-mono font-black uppercase text-brand-600 text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                        placeholder="Misal: DISKON50"
                      />
                    </div>
                  </div>

                  {/* Value */}
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 space-y-5">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      Besaran Diskon <div className="h-px bg-emerald-200 flex-1 ml-2" />
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">Tipe Diskon</label>
                      <div className="flex gap-3">
                        <label className={`flex-1 flex items-center justify-center py-4 border-2 rounded-xl cursor-pointer font-black text-sm transition-all shadow-sm ${
                          formData.discount_type === 'percentage' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                        }`}>
                          <input type="radio" className="hidden" checked={formData.discount_type === 'percentage'} onChange={() => setFormData({ ...formData, discount_type: 'percentage' })} />
                          <Percent size={18} className="mr-2" /> Persentase (%)
                        </label>
                        <label className={`flex-1 flex items-center justify-center py-4 border-2 rounded-xl cursor-pointer font-black text-sm transition-all shadow-sm ${
                          formData.discount_type === 'fixed' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                        }`}>
                          <input type="radio" className="hidden" checked={formData.discount_type === 'fixed'} onChange={() => setFormData({ ...formData, discount_type: 'fixed' })} />
                          <DollarSign size={18} className="mr-2" /> Nominal (Rp)
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">
                        Nilai Diskon {formData.discount_type === 'percentage' ? '(Maks 100%)' : '(Rupiah)'}
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={formData.discount_type === 'percentage' ? 100 : undefined}
                        value={formData.discount_value}
                        onChange={(e) => setFormData({ ...formData, discount_value: e.target.value === '' ? '' : parseInt(e.target.value) })}
                        className="w-full bg-white border-2 border-emerald-200 rounded-xl px-4 py-3 font-black text-emerald-800 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-5">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      Syarat & Ketentuan <div className="h-px bg-blue-200 flex-1 ml-2" />
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">Min. Pembelian (Rp)</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.min_purchase}
                          onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value === '' ? '' : parseInt(e.target.value) })}
                          className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          placeholder="0 = Tanpa Minimum"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">Batas Total Penggunaan</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.max_uses}
                          onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                          className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          placeholder="Kosong = Bebas pakai"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">Tanggal Kedaluwarsa</label>
                      <input
                        type="datetime-local"
                        value={formData.expires_at}
                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                        className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      />
                      <p className="text-[10px] font-bold text-slate-400 mt-1.5">Kosongkan jika voucher berlaku selamanya.</p>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div>
                      <p className="font-black text-slate-800 text-sm">Status Voucher</p>
                      <p className="text-xs font-medium text-slate-500">Tentukan apakah voucher dapat digunakan langsung.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      />
                      <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-500 shadow-inner"></div>
                      <span className={`ml-3 text-sm font-black ${formData.is_active ? 'text-brand-600' : 'text-slate-400'}`}>
                        {formData.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </label>
                  </div>

                </form>
              </div>

              <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3.5 rounded-2xl font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  form="voucherForm"
                  className="px-8 py-3.5 rounded-2xl font-black text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 group"
                >
                  <Check size={18} className="group-hover:scale-110 transition-transform" /> Simpan Voucher
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
