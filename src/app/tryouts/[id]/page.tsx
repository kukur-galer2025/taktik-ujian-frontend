"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Clock, BookOpen, Target, Trophy, Star, ArrowLeft, PlayCircle,
  ChevronRight, Users, BarChart3, CheckCircle2, ShieldCheck, Lock, CreditCard, Tag, AlertCircle, Upload, X, Shield, UploadCloud, ArrowRight, Ticket
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";

// Static category colors removed

export default function TryoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState<any>(null);
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
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const [userRes, tryoutRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get(`/api/tryouts/${id}`),
        ]);
        setUser(userRes.data);
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

  const handleLogout = async () => {
    try { await axios.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

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
      alert('Ukuran file terlalu besar. Maksimal 2MB. Silakan compress gambar Anda terlebih dahulu.');
      return;
    }
    setPaymentProof(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmitOrder = async () => {
    if (!paymentProof) {
      alert('Silakan unggah bukti pembayaran terlebih dahulu.');
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
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !tryout) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Detail Tryout...</p>
      </div>
    );
  }

  const catLabel = tryout.category?.name || 'UMUM';
  const catColor = tryout.category?.color || 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100';
  const classes = catColor.split(',');
  const catBg = classes.find((c: string) => c.startsWith('bg-')) || 'bg-slate-50';
  const catText = classes.find((c: string) => c.startsWith('text-')) || 'text-slate-700';
  const catBorder = classes.find((c: string) => c.startsWith('border-')) || 'border-slate-200';

  const avgRating = tryout.average_rating || tryout.reviews_avg_rating;
  const reviews = tryout.reviews || [];
  const questions = tryout.questions || [];
  const twkCount = questions.filter((q: any) => q.type === 'TWK').length;
  const tiuCount = questions.filter((q: any) => q.type === 'TIU').length;
  const tkpCount = questions.filter((q: any) => q.type === 'TKP').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <UserNavbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/tryouts" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Cover */}
              {tryout.cover_image ? (
                <div className="h-56 w-full bg-slate-100 overflow-hidden">
                  <img src={getImageUrl(tryout.cover_image)} alt={tryout.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-56 w-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center">
                  <Target size={64} className="text-white/30" />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${catBg} ${catText} ${catBorder}`}>
                    {catLabel}
                  </span>
                  {avgRating && (
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-700">
                      <Star size={14} className="fill-yellow-500 text-yellow-500" />
                      {parseFloat(avgRating).toFixed(1)}
                      <span className="text-yellow-600/60 font-medium text-xs">({reviews.length} ulasan)</span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">{tryout.title}</h1>
                <p className="text-slate-500 leading-relaxed text-base">{tryout.description}</p>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                <Clock size={24} className="text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{tryout.duration_minutes}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Menit</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                <BookOpen size={24} className="text-brand-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{questions.length}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Soal</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                <Users size={24} className="text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{leaderboard.length > 0 ? `${leaderboard.length}+` : '0'}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Peserta</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                <Trophy size={24} className="text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{leaderboard[0]?.total_score || '-'}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Skor Teratas</p>
              </div>
            </motion.div>

            {/* Question Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
            >
              <h2 className="text-lg font-black text-slate-900 mb-4">Komposisi Soal</h2>
              <div className="space-y-4">
                {[
                  { label: 'TWK - Tes Wawasan Kebangsaan', count: twkCount, color: 'bg-rose-500', pg: '65', total: questions.length },
                  { label: 'TIU - Tes Intelegensi Umum', count: tiuCount, color: 'bg-blue-500', pg: '80', total: questions.length },
                  { label: 'TKP - Tes Karakteristik Pribadi', count: tkpCount, color: 'bg-emerald-500', pg: '166', total: questions.length },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-400">PG: {item.pg}</span>
                        <span className="text-sm font-black text-slate-900">{item.count} soal</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {tryout.category === 'SKD' && (
                <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-brand-500" />
                    Passing Grade BKN 2024: TWK ≥ 65 | TIU ≥ 80 | TKP ≥ 166
                  </p>
                </div>
              )}
            </motion.div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
              >
                <h2 className="text-lg font-black text-slate-900 mb-4">Ulasan Pengguna</h2>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {review.user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-800">{review.user?.name || 'Anonim'}</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-slate-600 line-clamp-3">{review.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-24"
            >
              <h3 className="text-lg font-black text-slate-900 mb-4">Siap Mengerjakan?</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>{questions.length} soal harus dijawab</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Waktu pengerjaan {tryout.duration_minutes} menit</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Jawaban tersimpan otomatis</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Pembahasan langsung setelah selesai</span>
                </div>
              </div>

              {tryout.is_accessible ? (
                <Link
                  href={`/tryout/${tryout.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-brand-500/30"
                >
                  <PlayCircle size={22} /> Mulai Ujian
                </Link>
              ) : tryout.pending_order ? (
                <div className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-2xl font-black text-lg shadow-md">
                  <Clock size={22} /> Menunggu Konfirmasi Admin
                </div>
              ) : (
                <button
                  onClick={openCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-brand-500/30"
                >
                  <CreditCard size={22} /> Beli Paket Ini ({formatRupiah(tryout.price)})
                </button>
              )}

              <Link
                href={`/tryout/${tryout.id}/leaderboard`}
                className="w-full flex items-center justify-center gap-2 mt-3 bg-white hover:bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold text-sm transition-colors border-2 border-slate-100 hover:border-brand-200"
              >
                <Trophy size={18} className="text-yellow-500" /> Lihat Peringkat Nasional
              </Link>
            </motion.div>

            {/* Mini Leaderboard */}
            {leaderboard.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
              >
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" /> Top 5 Peserta
                </h3>
                <div className="space-y-2">
                  {leaderboard.map((entry: any, i: number) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-yellow-50 border border-yellow-100' : 'bg-slate-50'}`}>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        i === 0 ? 'bg-yellow-400 text-white' :
                        i === 1 ? 'bg-slate-300 text-white' :
                        i === 2 ? 'bg-amber-600 text-white' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-800 truncate">{entry.user?.name}</span>
                      <span className="text-sm font-black text-slate-900">{entry.total_score}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {successOrder ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Pesanan Berhasil Dibuat!</h2>
                <p className="text-slate-500 mb-6 text-sm">
                  Pesanan Anda sedang menunggu konfirmasi dari admin. Anda akan mendapatkan akses setelah pembayaran dikonfirmasi.
                </p>
                <div className="flex gap-3">
                  <Link href="/orders" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition-colors text-center text-sm">
                    Lihat Riwayat
                  </Link>
                  <button onClick={() => setShowCheckout(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-sm">
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Pembayaran</h2>
                    <p className="text-sm text-slate-500">{tryout.title}</p>
                  </div>
                  <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* Price Summary */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Harga Paket</span>
                      <span className="font-bold text-slate-800">{formatRupiah(tryout.price)}</span>
                    </div>
                    {voucherStatus?.valid && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Diskon Voucher ({voucherStatus.code})</span>
                        <span className="font-bold">- {formatRupiah(voucherStatus.discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-2 flex justify-between">
                      <span className="font-bold text-slate-700">Total Bayar</span>
                      <span className="text-xl font-black text-brand-600">{formatRupiah(getFinalAmount())}</span>
                    </div>
                  </div>

                  {/* Voucher Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Tag size={14} className="text-brand-500" /> Punya Kode Voucher?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherStatus(null); }}
                        placeholder="Masukkan kode voucher"
                        className="flex-1 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                      <button
                        onClick={handleValidateVoucher}
                        disabled={voucherLoading || !voucherCode.trim()}
                        className="bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-brand-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {voucherLoading ? <Loader2 size={16} className="animate-spin" /> : 'Pakai'}
                      </button>
                    </div>
                    {voucherStatus && !voucherStatus.valid && (
                      <p className="text-xs text-red-500 font-medium mt-2">{voucherStatus.message}</p>
                    )}
                    {voucherStatus?.valid && (
                      <p className="text-xs text-emerald-600 font-bold mt-2">✅ Voucher berhasil diterapkan! Hemat {formatRupiah(voucherStatus.discount)}</p>
                    )}
                  </div>

                  {/* QRIS Payment */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <CreditCard size={14} className="text-brand-500" /> Pembayaran via QRIS
                    </label>
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
                      <img src="/qris.jpeg" alt="QRIS Pembayaran" className="w-full max-w-[280px] mx-auto rounded-xl mb-3" />
                      <p className="text-sm font-bold text-slate-800 mb-1">Scan QRIS untuk membayar</p>
                      <p className="text-lg font-black text-brand-600 mb-2">{formatRupiah(getFinalAmount())}</p>
                    </div>
                  </div>

                  {/* Upload Bukti */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Upload size={14} className="text-brand-500" /> Unggah Bukti Pembayaran
                    </label>
                    <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-colors ${
                      proofPreview ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-brand-300'
                    }`}>
                      {proofPreview ? (
                        <div>
                          <img src={proofPreview} alt="Preview" className="max-h-48 mx-auto rounded-xl mb-3 shadow-sm" />
                          <p className="text-sm font-bold text-emerald-700 mb-2">✅ Bukti siap diunggah</p>
                          <button
                            onClick={() => { setPaymentProof(null); setProofPreview(null); }}
                            className="text-xs text-red-500 font-bold hover:text-red-700"
                          >
                            Hapus & Pilih Ulang
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload size={32} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-bold text-slate-600 mb-1">Klik untuk unggah atau drag & drop</p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            💡 <strong>Maks 2MB</strong>. Format: JPG, PNG, atau WebP.<br/>
                            Jika melebihi batas, silakan <em>compress</em> gambar Anda terlebih dahulu.
                          </p>
                          <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 sm:rounded-b-3xl flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full sm:w-1/3 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors order-2 sm:order-1"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting || !paymentProof}
                    className="w-full sm:w-2/3 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Kirim Bukti Pembayaran'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
