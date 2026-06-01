"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Award, Home, XCircle, CheckCircle2, ChevronRight, BarChart, Star, Send } from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState as useReactState } from "react";
import { CertificateTemplate } from "@/components/CertificateTemplate";

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
        alert("Gagal memuat hasil ujian.");
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
      alert("Gagal mengunduh sertifikat PDF.");
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
      alert("Terima kasih atas ulasannya!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim ulasan");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/dashboard" className="hover:text-brand-600 transition-colors flex items-center gap-1">
            <Home size={16} /> Dashboard
          </Link>
          <ChevronRight size={14} />
          <span>{result.tryout?.title}</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-slate-900">Hasil Ujian</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
        >
          {/* Status Banner */}
          <div className={`p-8 sm:p-12 text-center relative overflow-hidden ${
            isPassed 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
          }`}>
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="currentColor"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${
                isPassed ? 'bg-emerald-400 text-white' : 'bg-red-400 text-white'
              }`}>
                {isPassed ? <Award size={48} /> : <XCircle size={48} />}
              </div>
              <h1 className="text-4xl font-black tracking-tight mb-2">
                {isPassed ? 'SELAMAT, ANDA LULUS!' : 'MAAF, ANDA BELUM LULUS'}
              </h1>
              <p className="text-lg opacity-90 max-w-lg mx-auto">
                {isPassed 
                  ? 'Skor Anda telah memenuhi Passing Grade SKD CPNS 2024. Pertahankan belajarmu!' 
                  : 'Jangan menyerah! Analisis nilai Anda di bawah dan perbanyak latihan soal lagi.'}
              </p>
            </div>
          </div>

          {/* Scores Breakdown */}
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Skor Anda</h2>
              <div className="text-6xl font-black text-slate-900 tracking-tighter">
                {result.total_score}
              </div>
              <div className="mt-2 inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-sm font-medium text-slate-600">
                <BarChart size={16} />
                Waktu pengerjaan: {result.time_taken_minutes} menit
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {/* TWK */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 ${result.score_twk >= 65 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <h3 className="text-slate-500 font-bold mb-1">TWK</h3>
                <p className="text-xs text-slate-400 mb-4">Passing Grade: 65</p>
                <div className="text-4xl font-black text-slate-800 mb-2">{result.score_twk}</div>
                {result.score_twk >= 65 
                  ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md"><CheckCircle2 size={12}/> Memenuhi</span>
                  : <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md"><XCircle size={12}/> Tidak Memenuhi</span>
                }
              </div>

              {/* TIU */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 ${result.score_tiu >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <h3 className="text-slate-500 font-bold mb-1">TIU</h3>
                <p className="text-xs text-slate-400 mb-4">Passing Grade: 80</p>
                <div className="text-4xl font-black text-slate-800 mb-2">{result.score_tiu}</div>
                {result.score_tiu >= 80 
                  ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md"><CheckCircle2 size={12}/> Memenuhi</span>
                  : <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md"><XCircle size={12}/> Tidak Memenuhi</span>
                }
              </div>

              {/* TKP */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 ${result.score_tkp >= 166 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <h3 className="text-slate-500 font-bold mb-1">TKP</h3>
                <p className="text-xs text-slate-400 mb-4">Passing Grade: 166</p>
                <div className="text-4xl font-black text-slate-800 mb-2">{result.score_tkp}</div>
                {result.score_tkp >= 166 
                  ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md"><CheckCircle2 size={12}/> Memenuhi</span>
                  : <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md"><XCircle size={12}/> Tidak Memenuhi</span>
                }
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-2"
              >
                Kembali
              </Link>
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all text-center flex items-center justify-center gap-2"
              >
                {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Award size={20} />}
                Unduh Rapor PDF
              </button>
              <Link 
                href={`/tryout/${id}/review?resultId=${resultId}`}
                className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-500/30 transition-all text-center flex items-center justify-center gap-2"
              >
                Lihat Pembahasan
              </Link>
            </div>

            {!hasReviewed && (
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
                <p className="text-slate-600 mb-4 font-medium text-center">Bagaimana pengalaman Anda mengerjakan tryout ini?</p>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-2.5 border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Star size={18} className="fill-brand-500" />
                  Beri Rating & Testimoni
                </button>
              </div>
            )}
          </div>
        </motion.div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
              <XCircle size={20} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Beri Penilaian</h2>
            <p className="text-slate-500 mb-6 text-sm">Bagaimana kesan Anda mengikuti simulasi tryout ini?</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={40} 
                    className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'} transition-colors`} 
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Testimoni (Opsional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Misal: Soalnya sangat relevan dengan kisi-kisi terbaru!"
                className="w-full border-2 border-slate-200 rounded-xl p-4 h-32 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all resize-none text-slate-700"
              />
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all flex justify-center items-center gap-2"
            >
              {submittingReview ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
