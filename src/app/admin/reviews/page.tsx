"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, Trash2, Loader2, Star, AlertCircle } from "lucide-react";
import axios from "@/lib/axios";

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
    if (!confirm("Yakin ingin menghapus ulasan ini? (Akan menghapus dari sistem secara permanen)")) return;
    try {
      await axios.delete(`/api/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus ulasan");
    }
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <MessageSquareQuote className="text-brand-500" size={32} />
          Kelola Ulasan & Rating
        </h1>
        <p className="text-slate-500 mt-2">Daftar testimoni dan penilaian dari para peserta tryout.</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <AlertCircle className="mb-4" size={48} />
            <p className="font-medium text-lg text-slate-600">Belum ada ulasan yang masuk.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Peserta</th>
                  <th className="px-6 py-4">Tryout</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Testimoni</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{review.user?.name}</div>
                      <div className="text-xs text-slate-500">{review.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-600">
                      {review.tryout?.title}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            className={`${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                      {review.comment ? (
                        <p className="line-clamp-2" title={review.comment}>"{review.comment}"</p>
                      ) : (
                        <span className="italic text-slate-400">Tanpa testimoni</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus Ulasan"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
