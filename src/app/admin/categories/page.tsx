"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Edit, Trash2, LayoutGrid, X, Search, Check, AlertCircle } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Dialog } from '@/lib/sweetalert';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', color: 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100' });

  // Predefined color presets for categories
  const colorPresets = [
    { name: 'Biru (Brand)', value: 'bg-brand-50,text-brand-700,border-brand-200,from-brand-50,to-brand-100' },
    { name: 'Merah Muda', value: 'bg-rose-50,text-rose-700,border-rose-200,from-rose-50,to-rose-100' },
    { name: 'Biru Laut', value: 'bg-blue-50,text-blue-700,border-blue-200,from-blue-50,to-blue-100' },
    { name: 'Hijau', value: 'bg-emerald-50,text-emerald-700,border-emerald-200,from-emerald-50,to-emerald-100' },
    { name: 'Oranye', value: 'bg-orange-50,text-orange-700,border-orange-200,from-orange-50,to-orange-100' },
    { name: 'Ungu', value: 'bg-indigo-50,text-indigo-700,border-indigo-200,from-indigo-50,to-indigo-100' },
    { name: 'Kuning', value: 'bg-amber-50,text-amber-700,border-amber-200,from-amber-50,to-amber-100' },
    { name: 'Abu-abu', value: 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100' },
  ];

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', color: colorPresets[0].value });
    setShowModal(true);
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug, color: cat.color || colorPresets[7].value });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/admin/categories/${editingId}`, formData);
        toast.success('Kategori berhasil diperbarui!');
      } else {
        await axios.post("/api/admin/categories", formData);
        toast.success('Kategori baru berhasil ditambahkan!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Dialog.fire({
      icon: 'warning',
      title: 'Yakin ingin menghapus kategori ini?',
      text: 'Semua subkategori yang terkait juga bisa terpengaruh.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success('Kategori berhasil dihapus!');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  const renderBadgePreview = (colorStr: string, label: string, size: 'sm' | 'lg' = 'sm') => {
    const classes = colorStr.split(',');
    const bg = classes.find(c => c.startsWith('bg-'));
    const text = classes.find(c => c.startsWith('text-'));
    const border = classes.find(c => c.startsWith('border-'));
    
    if (size === 'lg') {
      return (
        <span className={`inline-block text-xs font-black uppercase px-4 py-2 rounded-xl border shadow-sm ${bg} ${text} ${border}`}>
          {label || 'PREVIEW LABEL'}
        </span>
      );
    }

    return (
      <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-md border shadow-sm ${bg} ${text} ${border}`}>
        {label || 'PREVIEW'}
      </span>
    );
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 shadow-sm">
             <LayoutGrid size={28} className="text-brand-600 animate-pulse" />
           </div>
           <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Data Kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 selection:bg-brand-500 selection:text-white">
      {/* Header Premium */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px]" />
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-fuchsia-500/20 rounded-full blur-[80px]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <LayoutGrid size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">Kelola Kategori Induk</h1>
               <p className="text-slate-300 font-medium">Buat pengelompokan taksonomi utama untuk setiap paket ujian Anda.</p>
             </div>
           </div>
           
           <button 
             onClick={openAddModal}
             className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group relative overflow-hidden border border-brand-400/50"
           >
             <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
             <Plus size={20} className="relative z-10 group-hover:scale-110 transition-transform" /> 
             <span className="relative z-10">Tambah Kategori Baru</span>
           </button>
         </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-6 justify-between sm:items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 px-4 py-2.5 rounded-xl border border-brand-100 flex items-center gap-2">
            <LayoutGrid size={18} className="text-brand-600" />
            <span className="text-sm font-black text-brand-700">Total: {categories.length} Kategori Utama</span>
          </div>
        </div>

        <div className="relative max-w-sm w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        {filteredCategories.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-6">
              <AlertCircle size={40} className="text-slate-300" />
            </div>
            <p className="font-black text-slate-800 text-xl mb-2">Tidak Ada Data Kategori</p>
            <p className="text-slate-500 font-medium">Buat kategori baru untuk mulai mengelompokkan tryout.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                  <th className="px-8 py-6 rounded-tl-[2.5rem]">Kategori</th>
                  <th className="px-6 py-6">Slug (URL)</th>
                  <th className="px-6 py-6">Pratinjau Badge</th>
                  <th className="px-6 py-6 text-center">Jumlah Tryout</th>
                  <th className="px-8 py-6 text-right rounded-tr-[2.5rem]">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((cat, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={cat.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors shadow-sm text-slate-400 group-hover:text-brand-500">
                          <LayoutGrid size={20} />
                        </div>
                        <div className="font-black text-slate-900 text-base group-hover:text-brand-700 transition-colors">{cat.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">/{cat.slug}</span>
                    </td>
                    <td className="px-6 py-5">
                      {renderBadgePreview(cat.color || colorPresets[7].value, cat.name, 'lg')}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center min-w-[3rem] h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 font-black text-lg shadow-sm">
                        {cat.tryouts_count || 0}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(cat)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Create/Edit Modal */}
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
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="bg-white w-full sm:max-w-xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative z-10 border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-fuchsia-500"></div>

              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <Edit size={20} />
                  </div>
                  {editingId ? "Edit Konfigurasi Kategori" : "Buat Kategori Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 sm:p-8 flex-1 custom-scrollbar-light">
                <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">Nama Kategori</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toUpperCase().replace(/\s+/g, '_');
                        setFormData({...formData, name, slug: editingId ? formData.slug : slug});
                      }}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                      placeholder="Misal: UTBK SNBT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">Slug (Kode Unik)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-mono font-black text-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                      placeholder="Misal: UTBK_SNBT"
                    />
                    <p className="text-[10px] font-bold text-amber-600 mt-2 bg-amber-50 inline-block px-2 py-1 rounded-md">
                      ⚠️ Slug digunakan dalam sistem pencarian dan URL. Ubah dengan hati-hati jika sudah dipakai.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <label className="block text-sm font-black text-slate-700 mb-3">Tampilan Visual Label (Badge)</label>
                    
                    <div className="mb-4 flex justify-center py-4 bg-white rounded-xl border-2 border-dashed border-slate-200">
                      {renderBadgePreview(formData.color, formData.name || 'PREVIEW LABEL', 'lg')}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, idx) => (
                        <label key={idx} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.color === preset.value ? 'border-brand-500 bg-white shadow-sm' : 'border-transparent bg-slate-100 hover:bg-slate-200'
                        }`}>
                          <input type="radio" className="hidden" checked={formData.color === preset.value} onChange={() => setFormData({...formData, color: preset.value})} />
                          <div className={`w-4 h-4 rounded-full border border-slate-300 flex-shrink-0 ${formData.color === preset.value ? 'border-[4px] border-brand-500' : ''}`} />
                          <span className="text-sm font-bold text-slate-700">{preset.name}</span>
                        </label>
                      ))}
                    </div>
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
                  form="categoryForm"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl font-black text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} className="group-hover:scale-110 transition-transform" />}
                  {submitting ? 'Menyimpan...' : 'Simpan Kategori'}
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
