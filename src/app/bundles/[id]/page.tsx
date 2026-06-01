"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Target, Loader2, CheckCircle2, Star, ArrowLeft,
  ShoppingCart, CreditCard, Upload, Tag, AlertCircle, X, ChevronRight,
  FileText, Users, Shield, Sparkles, Zap, Award
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function BundleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
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
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [userRes, bundleRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get(`/api/bundles/${params.id}`),
        ]);
        setUser(userRes.data);
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

  const handleLogout = async () => {
    try { await axios.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

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
      alert("Ukuran file terlalu besar. Maksimal 2MB. Silakan compress gambar Anda terlebih dahulu.");
      return;
    }
    setPaymentProof(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmitOrder = async () => {
    if (!paymentProof) { alert("Silakan unggah bukti pembayaran terlebih dahulu."); return; }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("bundle_id", bundle.id.toString());
      data.append("payment_proof", paymentProof);
      if (voucherStatus?.valid) data.append("voucher_code", voucherCode);
      const res = await axios.post("/api/orders", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccessOrder(res.data.order);
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan saat membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalQuestions = bundle?.tryouts?.reduce((sum: number, t: any) => sum + (t.questions_count || 0), 0) || 0;
  const totalDuration = bundle?.tryouts?.reduce((sum: number, t: any) => sum + (t.duration_minutes || 0), 0) || 0;
  const savedAmount = bundle?.discount_price ? bundle.price - bundle.discount_price : 0;
  const savedPercent = savedAmount > 0 ? Math.round((savedAmount / bundle?.price) * 100) : 0;
  const separatePrice = bundle?.tryouts?.reduce((sum: number, t: any) => sum + (t.price || 0), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Detail Bundle...</p>
      </div>
    );
  }

  if (!bundle) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      {/* Hero Banner */}
      <div className="relative bg-slate-900 overflow-hidden">
        {bundle.cover_image && (
          <img src={getImageUrl(bundle.cover_image)} alt={bundle.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <Link href="/bundles" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              {savedPercent > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full mb-4">
                  <Zap size={12} /> HEMAT {savedPercent}%
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">{bundle.title}</h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">{bundle.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><BookOpen size={15} /> {bundle.tryouts_count} Tryout</span>
                <span className="flex items-center gap-1.5"><FileText size={15} /> {totalQuestions} Soal</span>
                <span className="flex items-center gap-1.5"><Clock size={15} /> {totalDuration} Menit</span>
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:min-w-[280px]"
            >
              {bundle.discount_price ? (
                <>
                  <p className="text-slate-400 line-through text-sm mb-0.5">{formatRupiah(bundle.price)}</p>
                  <p className="text-3xl font-black text-white">{formatRupiah(bundle.discount_price)}</p>
                </>
              ) : (
                <p className="text-3xl font-black text-white">{bundle.price === 0 ? "GRATIS" : formatRupiah(bundle.price)}</p>
              )}
              {separatePrice > 0 && (
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Beli satuan: {formatRupiah(separatePrice)} — Hemat {formatRupiah(separatePrice - getBundlePrice())}!
                </p>
              )}
              <button
                onClick={() => { setShowCheckout(true); setSuccessOrder(null); setPaymentProof(null); setProofPreview(null); setVoucherCode(''); setVoucherStatus(null); }}
                className="w-full mt-4 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:-translate-y-0.5"
              >
                <CreditCard size={18} /> Beli Paket Ini
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Shield, color: "bg-blue-500", title: "Akses Selamanya", desc: "Kerjakan ulang kapanpun, tanpa batasan waktu." },
            { icon: Target, color: "bg-rose-500", title: "Pembahasan Detail", desc: "Setiap soal dilengkapi pembahasan lengkap dan skor." },
            { icon: Award, color: "bg-amber-500", title: "Ranking Nasional", desc: "Bandingkan skor Anda dengan ribuan peserta lain." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 shadow-sm"
            >
              <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                <f.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-0.5">{f.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tryout List */}
        <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
          <BookOpen size={22} className="text-brand-600" /> Isi Paket ({bundle.tryouts_count} Tryout)
        </h2>
        <div className="space-y-3 mb-10">
          {bundle.tryouts?.map((tryout: any, i: number) => (
            <motion.div
              key={tryout.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-black text-sm shrink-0 group-hover:bg-brand-100 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{tryout.title}</h3>
                    {tryout.category && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {tryout.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FileText size={12} /> {tryout.questions_count || 0} Soal</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {tryout.duration_minutes} Menit</span>
                    {tryout.price > 0 && (
                      <span className="flex items-center gap-1 line-through text-slate-300">{formatRupiah(tryout.price)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600">Termasuk</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-brand-500/20"
        >
          <div className="text-center sm:text-left">
            <p className="text-white font-black text-xl mb-1">Siap Meraih Skor Tertinggi? 🚀</p>
            <p className="text-brand-100 text-sm">Dapatkan akses ke semua {bundle.tryouts_count} tryout dengan harga spesial.</p>
          </div>
          <button
            onClick={() => { setShowCheckout(true); setSuccessOrder(null); setPaymentProof(null); setProofPreview(null); setVoucherCode(''); setVoucherStatus(null); }}
            className="shrink-0 bg-white text-brand-700 hover:bg-brand-50 font-bold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg text-sm"
          >
            Beli Sekarang — {formatRupiah(getBundlePrice())}
          </button>
        </motion.div>
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
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
                  <p className="text-slate-500 mb-6 text-sm">Pesanan Anda sedang menunggu konfirmasi admin.</p>
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">ID Pesanan</span>
                      <span className="font-bold text-slate-800">#{successOrder.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Total Bayar</span>
                      <span className="font-black text-brand-600">{formatRupiah(successOrder.final_amount)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/orders" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold text-center text-sm transition-colors">
                      Lihat Riwayat
                    </Link>
                    <button onClick={() => setShowCheckout(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm transition-colors">
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Pembayaran</h2>
                      <p className="text-sm text-slate-500">{bundle.title}</p>
                    </div>
                    <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="p-5 sm:p-6 space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Harga Paket</span>
                        <span className="font-bold text-slate-800">{formatRupiah(getBundlePrice())}</span>
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
                          className="bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
                        >
                          {voucherLoading ? <Loader2 size={16} className="animate-spin" /> : "Pakai"}
                        </button>
                      </div>
                      {voucherStatus && !voucherStatus.valid && (
                        <p className="text-xs text-red-500 font-medium mt-2">{voucherStatus.message}</p>
                      )}
                      {voucherStatus?.valid && (
                        <p className="text-xs text-emerald-600 font-bold mt-2">✅ Voucher berhasil diterapkan!</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-brand-500" /> Pembayaran via QRIS
                      </label>
                      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-center">
                        <img src="/qris.jpeg" alt="QRIS" className="w-full max-w-[280px] mx-auto rounded-xl mb-3" />
                        <p className="text-sm font-bold text-slate-800 mb-1">Scan QRIS untuk membayar</p>
                        <p className="text-lg font-black text-brand-600 mb-2">{formatRupiah(getFinalAmount())}</p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                          <p className="text-xs text-amber-800 font-bold flex items-start gap-2">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <span>Pastikan nominal transfer sesuai total bayar. Pembayaran kurang/lebih akan ditolak.</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Upload size={14} className="text-brand-500" /> Unggah Bukti Pembayaran
                      </label>
                      <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-colors ${
                        proofPreview ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-brand-300"
                      }`}>
                        {proofPreview ? (
                          <div>
                            <img src={proofPreview} alt="Preview" className="max-h-48 mx-auto rounded-xl mb-3 shadow-sm" />
                            <p className="text-sm font-bold text-emerald-700 mb-2">✅ Bukti siap diunggah</p>
                            <button onClick={() => { setPaymentProof(null); setProofPreview(null); }} className="text-xs text-red-500 font-bold hover:text-red-700">
                              Hapus & Pilih Ulang
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <Upload size={32} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-600 mb-1">Klik untuk unggah</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              💡 <strong>Maks 2MB</strong>. Format: JPG, PNG, atau WebP.
                            </p>
                            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
                          </label>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitOrder}
                      disabled={submitting || !paymentProof}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
                    >
                      {submitting ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
                      {submitting ? "Memproses..." : "Konfirmasi Pembayaran"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileBottomNav />
    </div>
  );
}
