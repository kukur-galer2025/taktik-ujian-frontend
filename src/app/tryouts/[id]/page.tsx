"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Clock, BookOpen, Target, Trophy, Star, ArrowLeft, PlayCircle,
  ChevronRight, Users, BarChart3, CheckCircle2, ShieldCheck, Lock, CreditCard, Tag, AlertCircle, Upload, X, Shield, UploadCloud, ArrowRight, Ticket, Banknote, MapPin
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import { useAuth } from "@/context/AuthContext";
import { Toast } from '@/lib/sweetalert';

export default function TryoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { user, logout } = useAuth();
  const [tryout, setTryout] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout State
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherStatus, setVoucherStatus] = useState<any>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tryoutRes = await axios.get(`/api/tryouts/${id}`);
        setTryout(tryoutRes.data);

        try {
          const lbRes = await axios.get(`/api/tryouts/${id}/leaderboard`);
          setLeaderboard(lbRes.data.slice(0, 5));
        } catch { /* ignore */ }
      } catch (err) {
        console.error(err);
        router.push("/tryouts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const openCheckout = () => {
    setVoucherCode('');
    setVoucherStatus(null);
    setPaymentProof(null);
    setProofPreview(null);
    setSuccessOrder(null);
    setShowCheckout(true);
  };

  const getFinalAmount = () => {
    const base = tryout.price;
    if (voucherStatus?.valid) return voucherStatus.final_amount;
    return base;
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const res = await axios.post('/api/voucher/validate', {
        code: voucherCode,
        amount: tryout.price,
      });
      setVoucherStatus(res.data);
    } catch (err: any) {
      setVoucherStatus({ valid: false, message: err.response?.data?.message || 'Voucher tidak valid.' });
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Toast.fire({ icon: 'error', title: 'Ukuran file terlalu besar. Maksimal 2MB.' });
      return;
    }
    setPaymentProof(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmitOrder = async () => {
    if (!paymentProof) {
      Toast.fire({ icon: 'warning', title: 'Unggah bukti pembayaran!' });
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('tryout_id', tryout.id.toString());
      data.append('payment_proof', paymentProof);
      if (voucherStatus?.valid) {
        data.append('voucher_code', voucherCode);
      }

      const res = await axios.post('/api/orders', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessOrder(res.data.order);
      // Update pending state locally
      setTryout({...tryout, pending_order: true});
      Toast.fire({ icon: 'success', title: 'Pesanan berhasil dibuat' });
    } catch (err: any) {
      console.error(err);
      Toast.fire({ icon: 'error', title: err.response?.data?.message || 'Gagal membuat pesanan' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !tryout) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={24} className="text-brand-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Detail Tryout...</p>
        </div>
      </div>
    );
  }

  const catLabel = tryout.category?.name || 'UMUM';
  const catColor = tryout.category?.color || 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100';
  const classes = catColor.split(',');
  const catBg = classes.find((c: string) => c.startsWith('bg-')) || 'bg-slate-50';
  const catText = classes.find((c: string) => c.startsWith('text-')) || 'text-slate-700';
  const catBorder = classes.find((c: string) => c.startsWith('border-')) || 'border-slate-200';
  const catGrad = classes.filter((c: string) => c.startsWith('from-') || c.startsWith('to-')).join(' ') || 'from-slate-50 to-slate-100';

  const avgRating = tryout.average_rating || tryout.reviews_avg_rating;
  const reviews = tryout.reviews || [];
  const questions = tryout.questions || [];
  const twkCount = questions.filter((q: any) => q.type === 'TWK').length;
  const tiuCount = questions.filter((q: any) => q.type === 'TIU').length;
  const tkpCount = questions.filter((q: any) => q.type === 'TKP').length;
  const isFree = tryout.price === 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-500 selection:text-white pb-10">
      <UserNavbar user={user} onLogout={logout} />

      {/* Premium Gradient Background Layer */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] animate-[spin_20s_linear_infinite]" />
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-[spin_15s_linear_infinite_reverse]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Link href="/tryouts" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
            >
              {/* Cover Image Area */}
              <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden group">
                {/* Glass Category Badge */}
                <div className="absolute top-5 left-5 z-20">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase px-3.5 py-2 rounded-xl border shadow-lg backdrop-blur-md ${catBg} ${catText} ${catBorder} bg-opacity-90`}>
                    <Target size={14} className={catText} /> {catLabel}
                  </span>
                </div>

                {/* Rating Badge */}
                {avgRating && (
                  <div className="absolute top-5 right-5 z-20 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg flex items-center gap-1.5">
                     <Star size={14} className="fill-yellow-400 text-yellow-400" />
                     <span className="font-black text-white text-sm">{parseFloat(avgRating).toFixed(1)}</span>
                     <span className="text-slate-400 text-xs font-medium">({reviews.length})</span>
                  </div>
                )}

                {tryout.cover_image ? (
                  <>
                    <img src={getImageUrl(tryout.cover_image)} alt={tryout.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                  </>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${catGrad} flex items-center justify-center relative`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <Target size={96} className={`${catText} opacity-30 group-hover:scale-110 transition-transform duration-700`} />
                  </div>
                )}
              </div>

              <div className="p-8 sm:p-10 relative">
                <div className="absolute -top-12 right-10 w-24 h-24 bg-brand-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
                
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
                  {tryout.title}
                </h1>
                
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-8">
                  {tryout.description || 'Paket tryout komprehensif berstandar nasional untuk mengukur dan mengasah kemampuan Anda. Dilengkapi dengan penilaian real-time dan pembahasan detail.'}
                </p>

                {/* Stats Grid Inside Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: <Clock size={22} className="text-amber-500 mb-2" />, val: tryout.duration_minutes, label: 'Menit', bg: 'bg-amber-50' },
                    { icon: <BookOpen size={22} className="text-brand-500 mb-2" />, val: questions.length, label: 'Total Soal', bg: 'bg-brand-50' },
                    { icon: <Users size={22} className="text-purple-500 mb-2" />, val: leaderboard.length > 0 ? `${leaderboard.length}+` : '0', label: 'Peserta', bg: 'bg-purple-50' },
                    { icon: <Trophy size={22} className="text-yellow-500 mb-2" />, val: leaderboard[0]?.total_score || '-', label: 'Skor Teratas', bg: 'bg-yellow-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className={`w-10 h-10 mx-auto ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                        {stat.icon}
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-slate-900">{stat.val}</p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Question Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                <BarChart3 size={22} className="text-brand-500" /> Komposisi Materi Ujian
              </h2>
              
              <div className="space-y-5 relative z-10">
                {[
                  { label: 'TWK - Tes Wawasan Kebangsaan', count: twkCount, color: 'bg-rose-500', pg: '65', total: questions.length, shadow: 'shadow-rose-500/30' },
                  { label: 'TIU - Tes Intelegensi Umum', count: tiuCount, color: 'bg-blue-500', pg: '80', total: questions.length, shadow: 'shadow-blue-500/30' },
                  { label: 'TKP - Tes Karakteristik Pribadi', count: tkpCount, color: 'bg-emerald-500', pg: '166', total: questions.length, shadow: 'shadow-emerald-500/30' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">PG: {item.pg}</span>
                        <span className="text-sm font-black text-slate-900">{item.count} soal</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out shadow-md ${item.shadow}`}
                        style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {tryout.category?.name?.includes('SKD') && (
                <div className="mt-8 bg-brand-50 rounded-2xl p-5 border border-brand-100 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-brand-900 mb-1">Standar BKN 2024</p>
                    <p className="text-xs text-brand-700 leading-relaxed">
                      Komposisi soal dan Passing Grade telah disesuaikan dengan standar terbaru pelaksanaan tes SKD CPNS oleh Badan Kepegawaian Negara.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm"
              >
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Star size={22} className="text-yellow-500" /> Ulasan Peserta
                </h2>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review: any, i: number) => (
                    <div key={i} className="flex gap-4 p-5 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                        {review.user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-base text-slate-800">{review.user?.name || 'Anonim'}</span>
                          <div className="flex items-center gap-0.5 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar Floating CTA */}
          <div className="space-y-6 sticky top-24 z-20">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-7 shadow-xl shadow-slate-200/50"
            >
              {/* Header Box */}
              <div className={`p-5 rounded-2xl mb-6 text-center border ${isFree ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Akses Ujian</p>
                 <p className={`text-3xl font-black ${isFree ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isFree ? 'GRATIS' : formatRupiah(tryout.price)}
                 </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { text: `${questions.length} soal wajib dijawab` },
                  { text: `Waktu pengerjaan ${tryout.duration_minutes} menit` },
                  { text: 'Sistem penyimpanan otomatis' },
                  { text: 'Akses pembahasan selamanya' },
                  { text: 'Pemeringkatan Nasional Real-time' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-3 rounded-xl">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {tryout.is_accessible ? (
                <Link
                  href={`/tryout/${tryout.id}`}
                  className="w-full group/btn relative overflow-hidden flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-brand-500/30"
                >
                  <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 flex items-center gap-2"><PlayCircle size={22} /> Mulai Kerjakan</span>
                </Link>
              ) : tryout.pending_order ? (
                <div className="w-full flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-600 py-4 rounded-2xl font-black text-base shadow-sm">
                  <Clock size={20} className="animate-pulse" /> Menunggu Konfirmasi
                </div>
              ) : (
                <button
                  onClick={openCheckout}
                  className={`w-full group/btn relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl ${
                    isFree 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' 
                      : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30'
                  }`}
                >
                  <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isFree ? <PlayCircle size={22} /> : <Banknote size={22} />} 
                    {isFree ? 'Ambil Gratis' : 'Beli Sekarang'}
                  </span>
                </button>
              )}

              <Link
                href={`/tryout/${tryout.id}/leaderboard`}
                className="w-full flex items-center justify-center gap-2 mt-4 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold text-sm transition-colors border-2 border-slate-100 hover:border-brand-200 group"
              >
                <Trophy size={18} className="text-yellow-500 group-hover:scale-110 transition-transform" /> Lihat Peringkat
              </Link>
            </motion.div>

            {/* Mini Leaderboard Card */}
            {leaderboard.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2 relative z-10">
                  <Trophy size={20} className="text-yellow-500" /> Top 5 Nasional
                </h3>
                
                <div className="space-y-2 relative z-10">
                  {leaderboard.map((entry: any, i: number) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-slate-50 ${i === 0 ? 'bg-gradient-to-r from-yellow-50 to-white border border-yellow-100/50 shadow-sm' : 'border border-transparent'}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-sm ${
                        i === 0 ? 'bg-yellow-400 text-white shadow-yellow-400/30' :
                        i === 1 ? 'bg-slate-300 text-white' :
                        i === 2 ? 'bg-amber-600 text-white' :
                        'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-sm font-bold truncate ${i === 0 ? 'text-yellow-900' : 'text-slate-700'}`}>{entry.user?.name}</span>
                      <span className="text-sm font-black text-slate-900">{entry.total_score}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Modern Premium Checkout Modal */}
      <AnimatePresence>
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setShowCheckout(false)}
          />
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full sm:max-w-lg sm:rounded-[2.5rem] rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 border border-slate-100"
          >
            {successOrder ? (
              <div className="p-8 sm:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-100 border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3">Pesanan Berhasil!</h2>
                  <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                    Terima kasih! Bukti pembayaran Anda sedang diproses oleh tim admin. Sistem akan membuka akses otomatis setelah dikonfirmasi.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/orders" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-2xl font-bold transition-colors text-center text-sm shadow-lg shadow-brand-500/20">
                      Cek Status Pesanan
                    </Link>
                    <button onClick={() => setShowCheckout(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold transition-colors text-sm">
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Pembayaran</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider line-clamp-1">{tryout.title}</p>
                  </div>
                  <button onClick={() => setShowCheckout(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Price Summary */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-brand-500/5 rounded-full blur-xl" />
                    
                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-500">Harga Paket</span>
                        <span className="font-black text-slate-800 text-base">{formatRupiah(tryout.price)}</span>
                      </div>
                      
                      <AnimatePresence>
                        {voucherStatus?.valid && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-between items-center text-sm text-emerald-600 bg-emerald-50/50 p-2 -mx-2 rounded-lg">
                            <span className="font-bold flex items-center gap-1"><Ticket size={14} /> Diskon ({voucherStatus.code})</span>
                            <span className="font-black">- {formatRupiah(voucherStatus.discount)}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="border-t border-slate-200/60 pt-3 flex justify-between items-end mt-2">
                        <span className="font-black text-slate-900">Total Tagihan</span>
                        <span className="text-2xl font-black text-brand-600 leading-none">{formatRupiah(getFinalAmount())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Input */}
                  <div>
                    <label className="block text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                      <Ticket size={16} className="text-brand-500" /> Punya Kode Promo?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherStatus(null); }}
                        placeholder="Ketik kode di sini..."
                        className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:normal-case placeholder:font-medium"
                      />
                      <button
                        onClick={handleValidateVoucher}
                        disabled={voucherLoading || !voucherCode.trim()}
                        className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 whitespace-nowrap shadow-md"
                      >
                        {voucherLoading ? <Loader2 size={18} className="animate-spin" /> : 'Gunakan'}
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {voucherStatus && !voucherStatus.valid && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-bold mt-2.5 flex items-center gap-1">
                          <AlertCircle size={14} /> {voucherStatus.message}
                        </motion.p>
                      )}
                      {voucherStatus?.valid && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-emerald-600 font-bold mt-2.5 flex items-center gap-1 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                          <CheckCircle2 size={14} /> Berhasil menghemat {formatRupiah(voucherStatus.discount)}!
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* QRIS Payment Section */}
                  <div>
                    <label className="block text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-brand-500" /> Metode Pembayaran (QRIS)
                    </label>
                    <div className="bg-gradient-to-b from-white to-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-center shadow-sm">
                      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 inline-block mb-4">
                        <img src="/qris.jpeg" alt="QRIS Pembayaran" className="w-full max-w-[200px] h-auto rounded-xl" />
                      </div>
                      <p className="text-sm font-bold text-slate-600 mb-1">Total yang harus dibayar:</p>
                      <p className="text-2xl font-black text-slate-900 bg-white px-4 py-2 rounded-xl inline-block border border-slate-100 shadow-sm">{formatRupiah(getFinalAmount())}</p>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div>
                    <label className="block text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                      <UploadCloud size={16} className="text-brand-500" /> Upload Bukti Transfer
                    </label>
                    <div className={`border-2 border-dashed rounded-[2rem] p-6 text-center transition-all duration-300 ${
                      proofPreview ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30'
                    }`}>
                      {proofPreview ? (
                        <div>
                          <div className="relative inline-block">
                             <img src={proofPreview} alt="Preview" className="max-h-40 mx-auto rounded-xl shadow-md border-2 border-white" />
                             <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                               <CheckCircle2 size={16} />
                             </div>
                          </div>
                          <p className="text-sm font-black text-emerald-700 mt-4 mb-2">Bukti Siap Dikirim</p>
                          <button
                            onClick={() => { setPaymentProof(null); setProofPreview(null); }}
                            className="text-xs text-red-500 font-bold hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Ganti Gambar
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud size={28} />
                          </div>
                          <p className="text-sm font-black text-slate-700 mb-1">Pilih File atau Drag & Drop</p>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                            Format JPG, PNG, atau WebP.<br/>
                            <span className="font-bold text-slate-700">Maksimal ukuran file 2MB.</span>
                          </p>
                          <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 sm:p-8 border-t border-slate-100 bg-white sm:rounded-b-[2.5rem] flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full sm:w-1/3 py-4 rounded-2xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors order-2 sm:order-1 text-sm"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting || !paymentProof}
                    className="w-full sm:w-2/3 py-4 rounded-2xl font-black text-white bg-brand-600 hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:shadow-none order-1 sm:order-2 text-sm group"
                  >
                    {submitting ? (
                      <Loader2 size={20} className="animate-spin" /> 
                    ) : (
                      <>
                        Kirim Bukti Pembayaran <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Shimmer CSS Animation Definition */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
