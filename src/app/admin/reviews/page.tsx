"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, Trash2, Loader2, Star, AlertCircle, Quote } from "lucide-react";
import axios from "@/lib/axios";
import { Toast, Dialog } from '@/lib/sweetalert';
import { motion } from "framer-motion";

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/admin/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Dialog.fire({
      icon: 'warning',
      title: 'Yakin ingin menghapus ulasan ini?',
      text: 'Ulasan ini akan dihapus dari sistem secara permanen dan tidak akan terlihat lagi oleh pengguna lain.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      fetchReviews();
      Toast.fire({ icon: 'success', title: 'Ulasan berhasil dihapus' });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: 'error', title: 'Gagal menghapus ulasan' });
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 shadow-sm">
             <MessageSquareQuote size={28} className="text-brand-600 animate-pulse" />
           </div>
           <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Data Ulasan...</p>
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
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-[80px] animate-[spin_15s_linear_infinite_reverse]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-yellow-400 shadow-xl border border-white/20">
               <MessageSquareQuote size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">Ulasan & Testimoni</h1>
               <p className="text-slate-300 font-medium">Kelola masukan dan penilaian dari para peserta tryout Anda.</p>
             </div>
           </div>
           
           <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 text-center shadow-lg min-w-[120px]">
               <p className="text-[10px] font-black text-brand-200 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5"><MessageSquareQuote size={12} /> Total</p>
               <p className="text-2xl font-black text-white">{reviews.length}</p>
             </div>
             <div className="bg-gradient-to-br from-yellow-400 to-amber-500 px-6 py-3.5 rounded-2xl shadow-lg shadow-yellow-500/20 text-center min-w-[120px]">
               <p className="text-[10px] font-black text-yellow-900/80 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5"><Star size={12} className="fill-yellow-900/80" /> Rata-Rata</p>
               <p className="text-2xl font-black text-yellow-950">{getAverageRating()}</p>
             </div>
           </div>
         </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        {reviews.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-6">
              <AlertCircle size={40} className="text-slate-300" />
            </div>
            <p className="font-black text-slate-800 text-xl mb-2">Belum Ada Ulasan</p>
            <p className="text-slate-500 font-medium">Sistem belum menerima ulasan apapun dari pengguna.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                  <th className="px-8 py-6 rounded-tl-[2.5rem]">Peserta</th>
                  <th className="px-6 py-6">Paket Ujian</th>
                  <th className="px-6 py-6 text-center">Penilaian</th>
                  <th className="px-6 py-6">Testimoni</th>
                  <th className="px-8 py-6 text-right rounded-tr-[2.5rem]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reviews.map((review, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={review.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                          {review.user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 group-hover:text-brand-600 transition-colors">{review.user?.name || 'Anonim'}</div>
                          <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded inline-block mt-0.5 border border-slate-100">{review.user?.email || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg text-sm border border-slate-200 line-clamp-1 max-w-[200px]">
                        {review.tryout?.title || 'Tryout Dihapus'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 shadow-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={`${star <= review.rating ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-200 text-slate-200'}`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {review.comment ? (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative group-hover:border-brand-200 transition-colors">
                          <Quote size={12} className="text-brand-400 absolute top-2 left-2 opacity-50" />
                          <p className="text-sm font-medium text-slate-600 pl-4 line-clamp-2" title={review.comment}>
                            {review.comment}
                          </p>
                        </div>
                      ) : (
                        <span className="italic text-slate-400 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-lg">Hanya memberikan bintang</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        title="Hapus Ulasan"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
