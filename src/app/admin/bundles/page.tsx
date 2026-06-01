"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Edit, Trash2, Package, Check, X as XIcon } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function BundleManagement() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [availableTryouts, setAvailableTryouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    if (!confirm("Yakin ingin menghapus bundle ini?")) return;
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
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Bundle</h1>
          <p className="text-slate-500">Kelola paket bundle tryout untuk dijual ke pengguna.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', price: 0, discount_price: 0, is_active: true, tryout_ids: [] });
            setCoverImage(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors"
        >
          <Plus size={20} /> Tambah Bundle
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Judul Bundle</th>
                <th className="px-6 py-4 font-semibold text-center">Harga (Rp)</th>
                <th className="px-6 py-4 font-semibold text-center">Jumlah Tryout</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bundles.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{b.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-1">{b.description}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.discount_price > 0 ? (
                      <div>
                        <span className="text-xs line-through text-slate-400 mr-1">{b.price}</span>
                        <span className="font-bold text-brand-600">{b.discount_price}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-700">{b.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <Package size={14} className="text-brand-500" /> {b.tryouts_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.is_active ? (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Aktif</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">Nonaktif</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(b)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {bundles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada bundle. Silakan tambah baru.
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
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-blue-500"></div>

              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Edit size={20} className="text-brand-500" />
                  {editingId ? "Edit Bundle" : "Tambah Bundle Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <XIcon size={20} />
                </button>
              </div>
            <div className="overflow-y-auto p-6 flex-1">
              <form id="bundleForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Judul Bundle</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Misal: Bundle Premium SKD"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Harga Normal (Rp)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Harga Diskon (Rp)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={formData.discount_price}
                      onChange={(e) => setFormData({...formData, discount_price: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
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

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Tryout di Dalam Bundle</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                    {availableTryouts.map(t => (
                      <label key={t.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-brand-300">
                        <input 
                          type="checkbox" 
                          checked={formData.tryout_ids.includes(t.id)}
                          onChange={() => toggleTryout(t.id)}
                          className="w-4 h-4 text-brand-600 rounded"
                        />
                        <span className="text-sm font-medium text-slate-700 line-clamp-1">{t.title}</span>
                      </label>
                    ))}
                    {availableTryouts.length === 0 && (
                      <div className="text-sm text-slate-500 p-2">Belum ada tryout tersedia.</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Aktifkan Bundle (Bisa dibeli)</label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                form="bundleForm"
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
