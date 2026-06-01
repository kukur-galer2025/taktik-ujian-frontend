"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Edit, Trash2, BookOpen, Clock, X } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function TryoutManagement() {
  const [tryouts, setTryouts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', duration_minutes: 100, category_id: '', price: 0 });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [tryoutsRes, categoriesRes] = await Promise.all([
        axios.get("/api/admin/tryouts"),
        axios.get("/api/categories")
      ]);
      setTryouts(tryoutsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('duration_minutes', formData.duration_minutes.toString());
      data.append('category_id', formData.category_id);
      data.append('price', formData.price.toString());
      if (coverImage) {
        data.append('cover_image', coverImage);
      }

      if (editingId) {
        await axios.post(`/api/admin/tryouts/${editingId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Tryout berhasil diperbarui!");
      } else {
        await axios.post("/api/admin/tryouts", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Tryout baru berhasil ditambahkan!");
      }
      setShowModal(false);
      setFormData({ title: '', description: '', duration_minutes: 100, category_id: categories.length > 0 ? categories[0].id : '', price: 0 });
      setCoverImage(null);
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus tryout ini? Semua soal di dalamnya juga akan terhapus!")) return;
    try {
      await axios.delete(`/api/admin/tryouts/${id}`);
      toast.success("Tryout berhasil dihapus!");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus tryout");
    }
  };

  const openEditModal = (t: any) => {
    setEditingId(t.id);
    setFormData({ title: t.title, description: t.description || '', duration_minutes: t.duration_minutes, category_id: t.category_id || (categories.length > 0 ? categories[0].id : ''), price: t.price || 0 });
    setCoverImage(null);
    setShowModal(true);
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Tryout</h1>
          <p className="text-slate-500">Kelola paket ujian yang tersedia untuk pengguna.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', duration_minutes: 100, category_id: categories.length > 0 ? categories[0].id : '', price: 0 });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors"
        >
          <Plus size={20} /> Tambah Paket
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Judul Tryout</th>
                <th className="px-6 py-4 font-semibold text-center">Kategori</th>
                <th className="px-6 py-4 font-semibold text-center">Waktu</th>
                <th className="px-6 py-4 font-semibold text-center">Jumlah Soal</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tryouts.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{t.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-1">{t.description}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {t.category ? (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${t.category.color?.replace(/,/g, ' ')}`}>
                        {t.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <Clock size={14} className="text-amber-500" /> {t.duration_minutes}m
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <BookOpen size={14} className="text-brand-500" /> {t.questions_count || 0} Soal
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link 
                      href={`/admin/tryouts/${t.id}/questions`}
                      className="inline-flex items-center gap-1 bg-brand-50 text-brand-600 hover:bg-brand-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      Kelola Soal
                    </Link>
                    <button 
                      onClick={() => openEditModal(t)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {tryouts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada paket tryout. Silakan tambah baru.
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
          <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-blue-500"></div>
              
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Edit size={20} className="text-brand-500" />
                  {editingId ? "Edit Tryout" : "Tambah Tryout Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Judul Paket</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Misal: Tryout Nasional Batch 1"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori Tryout</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2 font-medium">💡 Kategori bisa ditambah/diubah di menu Kategori Tryout.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Durasi (Menit)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Harga (Rp)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="0 = Gratis"
                  />
                  <p className="text-xs text-slate-400 mt-1">Isi 0 untuk tryout gratis.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none"
                  placeholder="Deskripsi..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Gambar Cover (Opsional)</label>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
                <p className="text-xs text-slate-500 mt-2 font-medium">💡 Maks 2MB. Format: JPG, PNG, atau WebP.</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all"
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
