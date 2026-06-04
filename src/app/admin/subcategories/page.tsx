"use client";

import { useEffect, useState } from "react";
import { ListTree, Plus, Edit, Trash2, Loader2, Save, X, Search, Check, AlertCircle } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Dialog } from '@/lib/sweetalert';

export default function SubCategoriesManagement() {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ type: 'TWK', name: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("/api/admin/subcategories");
      setSubCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat sub kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/admin/subcategories/${editingId}`, formData);
        toast.success("Sub Kategori berhasil diperbarui!");
      } else {
        await axios.post("/api/admin/subcategories", formData);
        toast.success("Sub Kategori baru berhasil ditambahkan!");
      }
      setShowForm(false);
      setFormData({ type: 'TWK', name: '' });
      setEditingId(null);
      fetchSubCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Dialog.fire({
      icon: 'warning',
      title: 'Yakin ingin menghapus sub kategori ini?',
      text: 'Semua soal yang menggunakan sub-kategori ini akan kehilangan relasinya.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/admin/subcategories/${id}`);
      toast.success("Sub Kategori berhasil dihapus!");
      fetchSubCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus sub kategori");
    }
  };

  const openEdit = (sub: any) => {
    setEditingId(sub.id);
    setFormData({ type: sub.type, name: sub.name });
    setShowForm(true);
  };

  const filteredData = subCategories.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'TWK': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'TIU': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TKP': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 shadow-sm">
             <ListTree size={28} className="text-brand-600 animate-pulse" />
           </div>
           <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Sub Kategori...</p>
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
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <ListTree size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">Materi Sub Kategori</h1>
               <p className="text-slate-300 font-medium">Atur kelompok materi spesifik (misal: Figural, Deret Angka) untuk analisis soal.</p>
             </div>
           </div>
           
           <button 
             onClick={() => {
               setEditingId(null);
               setFormData({ type: 'TWK', name: '' });
               setShowForm(true);
             }}
             className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group relative overflow-hidden border border-brand-400/50"
           >
             <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
             <Plus size={20} className="relative z-10 group-hover:scale-110 transition-transform" /> 
             <span className="relative z-10">Tambah Materi Baru</span>
           </button>
         </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-6 justify-between sm:items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 px-4 py-2.5 rounded-xl border border-brand-100 flex items-center gap-2">
            <ListTree size={18} className="text-brand-600" />
            <span className="text-sm font-black text-brand-700">Total: {subCategories.length} Sub Kategori</span>
          </div>
        </div>

        <div className="relative max-w-sm w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari materi soal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        {filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-6">
              <AlertCircle size={40} className="text-slate-300" />
            </div>
            <p className="font-black text-slate-800 text-xl mb-2">Tidak Ada Data Sub Kategori</p>
            <p className="text-slate-500 font-medium">Materi yang Anda cari tidak ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                  <th className="px-8 py-6 rounded-tl-[2.5rem]">Nama Materi</th>
                  <th className="px-6 py-6 text-center">Kelompok Induk</th>
                  <th className="px-8 py-6 text-right rounded-tr-[2.5rem]">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((sub, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={sub.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors shadow-sm text-slate-400 group-hover:text-brand-500">
                          <ListTree size={16} />
                        </div>
                        <div className="font-black text-slate-900 text-base group-hover:text-brand-700 transition-colors">{sub.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-block text-xs font-black uppercase px-3 py-1.5 rounded-lg border shadow-sm ${getTypeStyle(sub.type)}`}>
                        {sub.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(sub)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(sub.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Hapus">
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
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="bg-white w-full sm:max-w-md sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative z-10 border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-indigo-500"></div>

              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <Edit size={20} />
                  </div>
                  {editingId ? "Edit Materi" : "Tambah Materi"}
                </h2>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 sm:p-8 flex-1 custom-scrollbar-light">
                <form id="subCategoryForm" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-3">Tipe Kelompok Induk</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['TWK', 'TIU', 'TKP'].map(type => (
                        <label key={type} className={`flex items-center justify-center py-3 border-2 rounded-xl cursor-pointer font-black text-sm transition-all shadow-sm ${
                          formData.type === type ? (
                            type === 'TWK' ? 'border-rose-500 bg-rose-50 text-rose-700' :
                            type === 'TIU' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                            'border-emerald-500 bg-emerald-50 text-emerald-700'
                          ) : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                        }`}>
                          <input type="radio" className="hidden" checked={formData.type === type} onChange={() => setFormData({ ...formData, type })} />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">Nama Materi Spesifik</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Misal: Kemampuan Figural"
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                    />
                    <p className="text-[10px] font-bold text-slate-400 mt-2">
                      Nama ini akan muncul pada rincian hasil analisis ujian peserta.
                    </p>
                  </div>

                </form>
              </div>

              <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3.5 rounded-2xl font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  form="subCategoryForm"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl font-black text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} className="group-hover:scale-110 transition-transform" />}
                  Simpan
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
