"use client";

import { useEffect, useState } from "react";
import { ListTree, Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function SubCategoriesManagement() {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ type: 'TWK', name: '' });

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
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus sub kategori ini?")) return;
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

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ListTree className="text-brand-500" size={32} />
            Kelola Sub Kategori Soal
          </h1>
          <p className="text-slate-500 mt-2">Atur daftar sub-kategori materi (misal: Deret Angka, Nasionalisme).</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ type: 'TWK', name: '' });
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20"
          >
            <Plus size={20} /> Tambah Kategori
          </button>
        )}
      </div>

      {/* Form Editor Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-blue-500"></div>
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Edit size={20} className="text-brand-500" />
                  {editingId ? "Edit Sub Kategori" : "Tambah Sub Kategori"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipe Induk</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 font-medium focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  >
                    <option value="TWK">TWK (Tes Wawasan Kebangsaan)</option>
                    <option value="TIU">TIU (Tes Intelegensia Umum)</option>
                    <option value="TKP">TKP (Tes Karakteristik Pribadi)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Sub Kategori</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Misal: Kemampuan Figural"
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 font-medium focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all">
                    <Save size={18} /> Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Tipe Induk</th>
                  <th className="px-6 py-4">Nama Sub Kategori</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subCategories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-medium">Belum ada data sub kategori.</td>
                  </tr>
                ) : (
                  subCategories.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`font-bold px-3 py-1 rounded-lg text-sm ${
                          sub.type === 'TKP' ? 'bg-blue-100 text-blue-700' : 'bg-brand-100 text-brand-700'
                        }`}>
                          {sub.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(sub)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(sub.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
