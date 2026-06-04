"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Award, Home, XCircle, CheckCircle2, ChevronRight, BarChart, Star, Send, Trophy } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { CertificateTemplate } from "@/components/CertificateTemplate";
import { Toast } from '@/lib/sweetalert';

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);
  const resultId = searchParams.get("resultId");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) {
        router.push("/dashboard");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`/api/results/${resultId}`);
        setResult(res.data);
      } catch (err) {
        console.error(err);
        Toast.fire({ icon: 'error', title: 'Gagal memuat hasil ujian' });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Menganalisis hasil ujian Anda...</p>
      </div>
    );
  }

  if (!result) return null;

  const isPassed = result.is_passed;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloading(true);
      const htmlToImage = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const imgData = await htmlToImage.toPng(certificateRef.current, {
        pixelRatio: 2,
      });
      
      // A4 Landscape is 297 x 210 mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Rapor_SKD_${result.user?.name || 'Peserta'}_${result.tryout?.title}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      Toast.fire({ icon: 'error', title: 'Gagal mengunduh rapor PDF' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      setSubmittingReview(true);
      await axios.post(`/api/tryouts/${id}/review`, { rating, comment });
      setHasReviewed(true);
      setShowReviewModal(false);
      Toast.fire({ icon: 'success', title: 'Terima kasih atas ulasannya!' });
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: 'error', title: 'Gagal mengirim ulasan' });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-6 px-4 sm:px-6 lg:px-8 relative flex flex-col items-center justify-center">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] opacity-30 pointer-events-none">
        <div className={`absolute inset-0 blur-[100px] rounded-full ${isPassed ? 'bg-emerald-300/50' : 'bg-red-300/50'}`}></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10 w-full">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 mb-6 tracking-wide">
          <Link href="/dashboard" className="hover:text-brand-600 transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Home size={14} /> Dashboard
          </Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">{result.tryout?.title}</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full shadow-sm">Hasil Ujian</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 relative"
        >
          <div className="flex flex-col md:flex-row">
            {/* LEFT COLUMN: Status & Total Score */}
            <div className={`p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border-b md:border-b-0 md:border-r w-full md:w-5/12 ${
              isPassed 
                ? 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-transparent' 
                : 'border-red-100 bg-gradient-to-br from-red-50 to-transparent'
            }`}>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                className="relative z-10 flex flex-col items-center w-full"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-xl relative ${
                  isPassed ? 'bg-emerald-500 text-white border-4 border-emerald-100' : 'bg-red-500 text-white border-4 border-red-100'
                }`}>
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isPassed ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  {isPassed ? <Award size={40} strokeWidth={1.5} /> : <XCircle size={40} strokeWidth={1.5} />}
                </div>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isPassed ? 'SELAMAT, ANDA LULUS!' : 'MAAF, BELUM LULUS'}
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mb-6">
                  {isPassed 
                    ? 'Luar biasa! Skor Anda telah menembus Passing Grade SKD CPNS. Terus asah kemampuanmu!' 
                    : 'Jangan patah semangat! Evaluasi hasil belajarmu di bawah dan perbanyak latihan soal lagi.'}
                </p>

                <div className="w-full pt-6 border-t border-slate-200/50 mt-auto">
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Skor Anda</h2>
                  <div className="text-5xl sm:text-6xl font-black text-slate-800 tracking-tighter drop-shadow-sm mb-3">
                    {result.total_score}
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-[10px] font-medium text-slate-500 shadow-sm">
                    <BarChart size={12} className="text-brand-500" />
                    Waktu: <span className="text-slate-700 font-bold">{result.time_taken_minutes} menit</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Breakdown & Actions */}
            <div className="p-6 sm:p-8 w-full md:w-7/12 flex flex-col justify-center bg-white relative">
              <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" /> Rincian Nilai SKD
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                {/* TWK */}
                <motion.div whileHover={{ y: -3 }} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                  <div className={`absolute top-0 inset-x-0 h-1.5 transition-all group-hover:h-2 ${result.score_twk >= 65 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-slate-500 text-xs font-bold mb-0.5 tracking-widest">TWK</h3>
                  <p className="text-[9px] text-slate-400 mb-3 uppercase tracking-wider">PG: 65</p>
                  <div className="text-3xl font-black text-slate-800 mb-3">{result.score_twk}</div>
                  <div className="flex justify-center">
                    {result.score_twk >= 65 
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Lulus</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded-full"><XCircle size={12}/> Gagal</span>
                    }
                  </div>
                </motion.div>

                {/* TIU */}
                <motion.div whileHover={{ y: -3 }} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                  <div className={`absolute top-0 inset-x-0 h-1.5 transition-all group-hover:h-2 ${result.score_tiu >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-slate-500 text-xs font-bold mb-0.5 tracking-widest">TIU</h3>
                  <p className="text-[9px] text-slate-400 mb-3 uppercase tracking-wider">PG: 80</p>
                  <div className="text-3xl font-black text-slate-800 mb-3">{result.score_tiu}</div>
                  <div className="flex justify-center">
                    {result.score_tiu >= 80 
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Lulus</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded-full"><XCircle size={12}/> Gagal</span>
                    }
                  </div>
                </motion.div>

                {/* TKP */}
                <motion.div whileHover={{ y: -3 }} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                  <div className={`absolute top-0 inset-x-0 h-1.5 transition-all group-hover:h-2 ${result.score_tkp >= 166 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <h3 className="text-slate-500 text-xs font-bold mb-0.5 tracking-widest">TKP</h3>
                  <p className="text-[9px] text-slate-400 mb-3 uppercase tracking-wider">PG: 166</p>
                  <div className="text-3xl font-black text-slate-800 mb-3">{result.score_tkp}</div>
                  <div className="flex justify-center">
                    {result.score_tkp >= 166 
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Lulus</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded-full"><XCircle size={12}/> Gagal</span>
                    }
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-auto pt-6 border-t border-slate-100">
                <Link 
                  href="/dashboard"
                  className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600 font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 hover:shadow-sm text-xs"
                >
                  Kembali
                </Link>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 text-white font-black rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all text-center flex items-center justify-center gap-1.5 text-xs"
                >
                  {isDownloading ? <Loader2 className="animate-spin text-white" size={14} /> : <Award size={14} className="text-white" />}
                  Unduh Rapor
                </button>
                <Link 
                  href={`/tryout/${id}/review?resultId=${resultId}`}
                  className="w-full sm:w-auto px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transition-all text-center flex items-center justify-center gap-1.5 text-xs"
                >
                  Lihat Pembahasan
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
            
            <div className="mt-5 flex justify-center w-full">
              <Link 
                href={`/tryout/${id}/leaderboard`}
                className="w-full sm:w-auto px-6 sm:px-10 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-yellow-900 font-black tracking-wide rounded-2xl shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/60 transition-all text-center flex items-center justify-center gap-2 transform hover:-translate-y-1 text-sm sm:text-base"
              >
                <Trophy size={20} className="text-yellow-900" />
                LIHAT RANKING NASIONAL
              </Link>
            </div>

            {!hasReviewed && (
              <div className="mt-8 pt-6 border-t border-slate-200/50 flex flex-col items-center w-full">
                <p className="text-slate-500 mb-4 font-medium text-center tracking-wide text-xs sm:text-sm">Bagaimana pengalaman Anda mengerjakan tryout ini?</p>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-brand-500/50 text-brand-600 hover:bg-brand-50 hover:border-brand-500 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  <Star size={16} className="fill-brand-500" />
                  Beri Rating & Testimoni
                </button>
              </div>
            )}
      </div>

      {/* Hidden Certificate Render Target */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px", pointerEvents: "none" }}>
        <CertificateTemplate 
          ref={certificateRef}
          userName={result.user?.name || "Peserta"}
          tryoutTitle={result.tryout?.title || "Simulasi SKD"}
          totalScore={result.total_score}
          scoreTwk={result.score_twk}
          scoreTiu={result.score_tiu}
          scoreTkp={result.score_tkp}
          isPassed={result.is_passed}
          dateStr={new Date(result.created_at || Date.now()).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
            >
              <XCircle size={22} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Beri Penilaian</h2>
            <p className="text-slate-500 mb-8 text-sm">Bagaimana kesan Anda mengikuti simulasi tryout ini?</p>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={44} 
                    className={`${star <= rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'fill-slate-100 text-slate-200'} transition-all`} 
                  />
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">Testimoni (Opsional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Misal: Soalnya sangat relevan dengan kisi-kisi terbaru!"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 h-32 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/30 transition-all flex justify-center items-center gap-2 text-lg"
            >
              {submittingReview ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
