"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Edit, Trash2, Package, Check, X as XIcon, Search, Image as ImageIcon, Box, Wallet, FileText } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Dialog } from '@/lib/sweetalert';

export default function BundleManagement() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [availableTryouts, setAvailableTryouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ title: '', description: '', price: 0, discount_price: 0, is_active: true, tryout_ids: [] as number[] });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [resBundles, resTryouts] = await Promise.all([
        axios.get("/api/admin/bundles"),
        axios.get("/api/admin/tryouts")
      ]);
      setBundles(resBundles.data);
      setAvailableTryouts(resTryouts.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data bundle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('discount_price', formData.discount_price.toString());
      data.append('is_active', formData.is_active ? '1' : '0');
      
      formData.tryout_ids.forEach((id) => {
        data.append('tryout_ids[]', id.toString());
      });

      if (coverImage) {
        data.append('cover_image', coverImage);
      }

      if (editingId) {
        await axios.post(`/api/admin/bundles/${editingId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Bundle berhasil diperbarui!");
      } else {
        await axios.post("/api/admin/bundles", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Bundle baru berhasil ditambahkan!");
      }
      setShowModal(false);
      setFormData({ title: '', description: '', price: 0, discount_price: 0, is_active: true, tryout_ids: [] });
      setCoverImage(null);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Dialog.fire({
      icon: 'warning',
      title: 'Yakin ingin menghapus bundle ini?',
      text: 'Semua relasi dengan tryout pada bundle ini akan hilang.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/admin/bundles/${id}`);
      toast.success("Bundle berhasil dihapus!");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus bundle");
    }
  };

  const openEditModal = (b: any) => {
    setEditingId(b.id);
    setFormData({ 
      title: b.title, 
      description: b.description || '', 
      price: b.price,
      discount_price: b.discount_price || 0,
      is_active: b.is_active,
      tryout_ids: b.tryouts ? b.tryouts.map((t: any) => t.id) : []
    });
    setCoverImage(null);
    setShowModal(true);
  };

  const toggleTryout = (id: number) => {
    setFormData(prev => ({
      ...prev,
      tryout_ids: prev.tryout_ids.includes(id) 
        ? prev.tryout_ids.filter(tId => tId !== id)
        : [...prev.tryout_ids, id]
    }));
  };

  const filteredBundles = bundles.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 shadow-sm">
             <Package size={28} className="text-brand-600 animate-pulse" />
           </div>
           <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Data Bundle...</p>
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
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px] animate-[spin_15s_linear_infinite_reverse]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <Package size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">Manajemen Bundle</h1>
               <p className="text-slate-300 font-medium">Kelola dan rangkai paket tryout untuk promosi terbaik.</p>
             </div>
           </div>
           
           <button 
             onClick={() => {
               setEditingId(null);
               setFormData({ title: '', description: '', price: 0, discount_price: 0, is_active: true, tryout_ids: [] });
               setCoverImage(null);
               setShowModal(true);
             }}
             className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group relative overflow-hidden border border-brand-400/50"
           >
             <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
             <Plus size={20} className="relative z-10 group-hover:scale-110 transition-transform" /> 
             <span className="relative z-10">Tambah Bundle Baru</span>
           </button>
         </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-6 justify-between sm:items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 px-4 py-2.5 rounded-xl border border-brand-100 flex items-center gap-2">
            <Box size={18} className="text-brand-600" />
            <span className="text-sm font-black text-brand-700">Total: {bundles.length} Bundle</span>
          </div>
        </div>

        <div className="relative max-w-sm w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama bundle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                <th className="px-8 py-6 rounded-tl-[2.5rem]">Informasi Bundle</th>
                <th className="px-6 py-6 text-center">Harga</th>
                <th className="px-6 py-6 text-center">Isi Tryout</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right rounded-tr-[2.5rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBundles.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors shadow-sm overflow-hidden relative">
                        {b.cover_image ? (
                          <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${b.cover_image}`} alt={b.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={24} className="text-slate-400 group-hover:text-brand-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-base mb-1 group-hover:text-brand-700 transition-colors">{b.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-xs font-medium">{b.description || 'Tidak ada deskripsi.'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {b.discount_price > 0 ? (
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold line-through text-slate-400">{formatRupiah(b.price)}</span>
                        <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 mt-1">{formatRupiah(b.discount_price)}</span>
                      </div>
                    ) : (
                      <span className="font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{formatRupiah(b.price)}</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-xl shadow-sm">
                      <FileText size={14} className="text-brand-500" /> {b.tryouts_count || 0} Paket
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {b.is_active ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Aktif
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-black px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(b)}
                        className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBundles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                      <Package size={32} className="text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-600 text-lg mb-1">Belum Ada Bundle</p>
                    <p className="text-sm font-medium text-slate-400">Klik "Tambah Bundle Baru" untuk membuat paket pertama Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full sm:max-w-3xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative z-10 border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-purple-500"></div>

              <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-20">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <Edit size={20} />
                  </div>
                  {editingId ? "Edit Konfigurasi Bundle" : "Tambah Bundle Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <XIcon size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 sm:p-8 flex-1 custom-scrollbar-light">
                <form id="bundleForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-5">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Informasi Dasar <div className="h-px bg-slate-200 flex-1 ml-2" />
                    </h3>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">Judul Bundle</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                        placeholder="Misal: Bundle Premium SKD CPNS 2026"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">Deskripsi Singkat</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all h-24 resize-none shadow-sm"
                        placeholder="Jelaskan keunggulan bundle ini..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-2">Gambar Cover (Opsional)</label>
                      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-300 transition-colors">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon size={20} />
                        </div>
                        <input 
                          type="file" 
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
                          className="w-full text-sm font-bold text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-colors cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] font-bold text-amber-600 mt-2 flex items-center gap-1 bg-amber-50 w-fit px-2 py-1 rounded-md">
                        💡 Maks 2MB (JPG, PNG, WebP). Gunakan rasio 16:9.
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 space-y-5">
                    <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      Harga & Penawaran <div className="h-px bg-emerald-200 flex-1 ml-2" />
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2"><Wallet size={16} className="text-slate-400"/> Harga Normal (Rp)</label>
                        <input 
                          type="number" 
                          required
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                          className="w-full bg-white border-2 border-emerald-200 rounded-xl px-4 py-3 font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2 flex items-center gap-2"><Wallet size={16} className="text-emerald-500"/> Harga Diskon (Rp)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={formData.discount_price}
                          onChange={(e) => setFormData({...formData, discount_price: parseInt(e.target.value) || 0})}
                          className="w-full bg-white border-2 border-emerald-200 rounded-xl px-4 py-3 font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                          placeholder="Kosongkan jika tidak ada diskon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tryout Selection */}
                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-5">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      Isi Paket Bundle <div className="h-px bg-blue-200 flex-1 ml-2" />
                    </h3>
                    <div>
                      <label className="block text-sm font-black text-slate-700 mb-3">Pilih Tryout di Dalam Bundle ({formData.tryout_ids.length} dipilih)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 border-2 border-blue-100 rounded-2xl bg-white custom-scrollbar-light shadow-inner">
                        {availableTryouts.map(t => (
                          <label key={t.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${formData.tryout_ids.includes(t.id) ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                            <input 
                              type="checkbox" 
                              checked={formData.tryout_ids.includes(t.id)}
                              onChange={() => toggleTryout(t.id)}
                              className="w-5 h-5 text-blue-600 rounded-md border-slate-300 mt-0.5 focus:ring-blue-500"
                            />
                            <div>
                              <span className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{t.title}</span>
                              <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded uppercase">{t.category?.name || 'UMUM'}</span>
                            </div>
                          </label>
                        ))}
                        {availableTryouts.length === 0 && (
                          <div className="col-span-1 sm:col-span-2 text-sm font-bold text-slate-500 p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            Belum ada tryout tersedia di sistem.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div>
                      <p className="font-black text-slate-800 text-sm">Status Publikasi</p>
                      <p className="text-xs font-medium text-slate-500">Tentukan apakah bundle ini bisa dilihat dan dibeli.</p>
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
                        {formData.is_active ? 'Aktif' : 'Draft'}
                      </span>
                    </label>
                  </div>

                </form>
              </div>
              <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3.5 rounded-2xl font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  form="bundleForm"
                  className="px-8 py-3.5 rounded-2xl font-black text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 group"
                >
                  <Check size={18} className="group-hover:scale-110 transition-transform" /> Simpan Konfigurasi
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
