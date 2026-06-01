"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Edit, Trash2, LayoutGrid, X } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success('Kategori berhasil dihapus!');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan saat menghapus data.');
    }
  };

  const renderBadgePreview = (colorStr: string, label: string) => {
    const classes = colorStr.split(',');
    const bg = classes.find(c => c.startsWith('bg-'));
    const text = classes.find(c => c.startsWith('text-'));
    const border = classes.find(c => c.startsWith('border-'));
    return (
      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${bg} ${text} ${border}`}>
        {label || 'Preview'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Kelola Kategori</h1>
          <p className="text-sm text-slate-500">Atur kategori dinamis untuk paket tryout</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Nama Kategori</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Warna Badge</th>
                <th className="px-6 py-4 text-center">Jml Tryout</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <LayoutGrid size={16} />
                      </div>
                      {cat.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500 text-sm">{cat.slug}</td>
                  <td className="px-6 py-4">
                    {renderBadgePreview(cat.color, cat.name)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">
                      {cat.tryouts_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada kategori. Silakan tambah baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit Kategori" : "Tambah Kategori"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kategori</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toUpperCase().replace(/\s+/g, '_');
                      setFormData({...formData, name, slug: editingId ? formData.slug : slug});
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Misal: CPNS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Slug (Kode Unik)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase font-mono text-sm"
                    placeholder="Misal: CPNS"
                  />
                  <p className="text-xs text-slate-500 mt-1">Harus unik, huruf besar, tanpa spasi.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Tema Warna</label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset, idx) => (
                      <label key={idx} className={`flex items-center gap-2 p-2 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.color === preset.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <input type="radio" className="hidden" checked={formData.color === preset.value} onChange={() => setFormData({...formData, color: preset.value})} />
                        {renderBadgePreview(preset.value, preset.name)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
