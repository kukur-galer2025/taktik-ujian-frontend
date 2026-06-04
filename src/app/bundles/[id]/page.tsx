"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Target, Loader2, CheckCircle2, Star, ArrowLeft,
  ShoppingCart, CreditCard, Upload, Tag, AlertCircle, X, ChevronRight,
  FileText, Users, Shield, Sparkles, Zap, Award, Banknote, MapPin, Ticket, UploadCloud
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/context/AuthContext";
import { Toast } from '@/lib/sweetalert';

export default function BundleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuth();
  const [bundle, setBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherStatus, setVoucherStatus] = useState<any>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bundleRes = await axios.get(`/api/bundles/${params.id}`);
        setBundle(bundleRes.data);
      } catch (err) {
        console.error(err);
        router.push("/bundles");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router, params.id]);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const getBundlePrice = () => {
    if (!bundle) return 0;
    return bundle.discount_price || bundle.price;
  };

  const getFinalAmount = () => {
    if (voucherStatus?.valid) return voucherStatus.final_amount;
    return getBundlePrice();
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const res = await axios.post("/api/voucher/validate", { code: voucherCode, amount: getBundlePrice() });
      setVoucherStatus(res.data);
    } catch (err: any) {
      setVoucherStatus({ valid: false, message: err.response?.data?.message || "Voucher tidak valid." });
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
    if (!paymentProof) { Toast.fire({ icon: 'warning', title: 'Unggah bukti pembayaran!' }); return; }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("bundle_id", bundle.id.toString());
      data.append("payment_proof", paymentProof);
      if (voucherStatus?.valid) data.append("voucher_code", voucherCode);
      const res = await axios.post("/api/orders", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccessOrder(res.data.order);
      Toast.fire({ icon: 'success', title: 'Pesanan berhasil dibuat' });
    } catch (err: any) {
      Toast.fire({ icon: 'error', title: err.response?.data?.message || 'Gagal membuat pesanan' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalQuestions = bundle?.tryouts?.reduce((sum: number, t: any) => sum + (t.questions_count || 0), 0) || 0;
  const totalDuration = bundle?.tryouts?.reduce((sum: number, t: any) => sum + (t.duration_minutes || 0), 0) || 0;
  const savedAmount = bundle?.discount_price ? bundle.price - bundle.discount_price : 0;
  const savedPercent = savedAmount > 0 && bundle?.price > 0 ? Math.round((savedAmount / bundle?.price) * 100) : 0;
  const separatePrice = bundle?.tryouts?.reduce((sum: number, t: any) => sum + (t.price || 0), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={24} className="text-purple-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Detail Bundle...</p>
        </div>
      </div>
    );
  }

  if (!bundle) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans selection:bg-purple-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      {/* Hero Banner with Animated Background */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Animated Mesh Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {bundle.cover_image && (
          <img src={getImageUrl(bundle.cover_image)} alt={bundle.title} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 z-10">
          <Link href="/bundles" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors mb-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-white/20">
            <ArrowLeft size={16} /> Kembali ke Katalog Bundle
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              {savedPercent > 0 && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black px-4 py-1.5 rounded-full mb-5 shadow-lg shadow-red-500/30 border border-white/10">
                  <Zap size={14} className="fill-white" /> HEMAT {savedPercent}%
                </div>
              )}
              <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
                {bundle.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-medium">
                {bundle.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-medium text-sm shadow-sm">
                  <BookOpen size={16} className="text-purple-400" /> {bundle.tryouts_count} Tryout
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-medium text-sm shadow-sm">
                  <FileText size={16} className="text-blue-400" /> {totalQuestions} Soal
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-medium text-sm shadow-sm">
                  <Clock size={16} className="text-amber-400" /> {totalDuration} Menit
                </div>
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 sm:min-w-[320px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <p className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">Total Investasi</p>
              
              {bundle.discount_price ? (
                <>
                  <p className="text-slate-400 line-through text-lg font-medium mb-1">{formatRupiah(bundle.price)}</p>
                  <p className="text-4xl font-black text-white mb-2">{formatRupiah(bundle.discount_price)}</p>
                </>
              ) : (
                <p className="text-4xl font-black text-white mb-2">{bundle.price === 0 ? "GRATIS" : formatRupiah(bundle.price)}</p>
              )}
              
              {separatePrice > 0 && separatePrice > getBundlePrice() && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl mt-3 flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>Beli satuan: {formatRupiah(separatePrice)} — Hemat {formatRupiah(separatePrice - getBundlePrice())}!</span>
                </div>
              )}
              
              <button
                onClick={() => { setShowCheckout(true); setSuccessOrder(null); setPaymentProof(null); setProofPreview(null); setVoucherCode(''); setVoucherStatus(null); }}
                className="w-full mt-6 group relative overflow-hidden bg-white text-slate-900 font-black py-4 rounded-xl transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10 flex items-center gap-2"><Banknote size={20} /> Ambil Promo Ini</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Shield, color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20", title: "Akses Selamanya", desc: "Kerjakan ulang kapanpun, tanpa batasan waktu." },
            { icon: Target, color: "from-rose-500 to-red-600", shadow: "shadow-rose-500/20", title: "Pembahasan Detail", desc: "Setiap soal dilengkapi pembahasan lengkap dan skor." },
            { icon: Award, color: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20", title: "Ranking Nasional", desc: "Bandingkan skor Anda dengan ribuan peserta lain." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-6 flex items-start gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${f.shadow} shrink-0`}>
                <f.icon size={28} />
              </div>
              <div className="mt-1">
                <h4 className="font-black text-slate-900 text-base mb-1">{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tryout List */}
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <BookOpen size={28} className="text-purple-600" /> 
          Isi Paket Premium ({bundle.tryouts_count} Tryout)
        </h2>
        
        <div className="space-y-4 mb-12">
          {bundle.tryouts?.map((tryout: any, i: number) => (
            <motion.div
              key={tryout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 group"
            >
              <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-black text-lg shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-black text-slate-900 text-lg truncate group-hover:text-purple-600 transition-colors">{tryout.title}</h3>
                    {tryout.category && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {tryout.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><FileText size={14} className="text-blue-500" /> {tryout.questions_count || 0} Soal</span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Clock size={14} className="text-amber-500" /> {tryout.duration_minutes} Menit</span>
                    {tryout.price > 0 && (
                      <span className="flex items-center gap-1.5 bg-red-50 text-red-500 px-2 py-1 rounded-md border border-red-100 line-through text-xs font-bold">{formatRupiah(tryout.price)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-sm font-bold text-emerald-700">Termasuk</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-[2.5rem] overflow-hidden p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl"
        >
           {/* Animated Background for Bottom CTA */}
           <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0" />
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl z-0" />
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-500/30 rounded-full blur-3xl z-0" />

          <div className="text-center sm:text-left relative z-10">
            <p className="text-white font-black text-2xl sm:text-3xl mb-2 tracking-tight">Siap Meraih Skor Tertinggi? 🚀</p>
            <p className="text-slate-300 text-sm sm:text-base font-medium">Amankan diskon Anda sekarang dan mulai berlatih secara intensif.</p>
          </div>
          
          <button
            onClick={() => { setShowCheckout(true); setSuccessOrder(null); setPaymentProof(null); setProofPreview(null); setVoucherCode(''); setVoucherStatus(null); }}
            className="shrink-0 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 py-4 rounded-2xl transition-all hover:-translate-y-1 shadow-xl shadow-white/10 text-base sm:text-lg group relative overflow-hidden z-10 flex items-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-slate-300/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10 flex items-center gap-2">Beli Sekarang — {formatRupiah(getBundlePrice())}</span>
          </button>
        </motion.div>
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
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
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
                  <p className="text-slate-500 mb-6 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                    Terima kasih! Bukti pembayaran Anda sedang diproses oleh tim admin. Sistem akan membuka akses otomatis setelah dikonfirmasi.
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-bold">ID Pesanan</span>
                      <span className="font-black text-slate-800">#{successOrder.id}</span>
                    </div>
                    <div className="border-t border-slate-200/60 pt-2 mt-2 flex justify-between text-sm items-center">
                      <span className="text-slate-500 font-bold">Total Tagihan</span>
                      <span className="font-black text-brand-600 text-lg">{formatRupiah(successOrder.final_amount)}</span>
                    </div>
                  </div>

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
                    <h2 className="text-xl font-black text-slate-900">Pembayaran Bundle</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider line-clamp-1">{bundle.title}</p>
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
                        <span className="font-black text-slate-800 text-base">{formatRupiah(getBundlePrice())}</span>
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
                        placeholder="Ketik kode promo..."
                        className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:normal-case placeholder:font-medium"
                      />
                      <button
                        onClick={handleValidateVoucher}
                        disabled={voucherLoading || !voucherCode.trim()}
                        className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 whitespace-nowrap shadow-md"
                      >
                        {voucherLoading ? <Loader2 size={18} className="animate-spin" /> : "Gunakan"}
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
                        <img src="/qris.jpeg" alt="QRIS" className="w-full max-w-[200px] h-auto rounded-xl" />
                      </div>
                      <p className="text-sm font-bold text-slate-600 mb-1">Total yang harus dibayar:</p>
                      <p className="text-2xl font-black text-slate-900 bg-white px-4 py-2 rounded-xl inline-block border border-slate-100 shadow-sm">{formatRupiah(getFinalAmount())}</p>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left mt-4">
                        <p className="text-xs text-amber-800 font-bold flex items-start gap-2">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>Pastikan nominal transfer sesuai total bayar. Pembayaran kurang/lebih akan ditolak otomatis.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div>
                    <label className="block text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                      <UploadCloud size={16} className="text-brand-500" /> Upload Bukti Transfer
                    </label>
                    <div className={`border-2 border-dashed rounded-[2rem] p-6 text-center transition-all duration-300 ${
                      proofPreview ? "border-emerald-400 bg-emerald-50/50" : "border-slate-300 hover:border-brand-400 hover:bg-brand-50/30"
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
                          <button onClick={() => { setPaymentProof(null); setProofPreview(null); }} className="text-xs text-red-500 font-bold hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
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
                        Konfirmasi Pembayaran <CreditCard size={18} className="group-hover:scale-110 transition-transform" />
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

      <MobileBottomNav />

      {/* Shimmer CSS Animation Definition */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
