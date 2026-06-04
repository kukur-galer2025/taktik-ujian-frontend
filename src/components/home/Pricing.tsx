"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Loader2, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function Pricing() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await axios.get("/api/public/bundles");
        if (res.data && res.data.length > 0) {
          // Hanya tampilkan 3 paket bundling utama
          setBundles(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Gagal memuat paket", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <section id="pricing" className="py-24 bg-slate-50 flex justify-center items-center">
        <Loader2 className="animate-spin text-brand-500 w-10 h-10" />
      </section>
    );
  }

  // Jika tidak ada data bundle dari sistem, sembunyikan atau tampilkan pesan
  if (bundles.length === 0) {
    return null;
  }

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] rounded-full bg-brand-300/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="will-change-transform"
          >
            <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-3 block">Investasi Masa Depan</span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Pilih Paket Bundling Terbaik
            </h3>
            <p className="text-lg text-slate-600 font-medium">
              Hemat lebih banyak dengan membeli akses penuh ke kumpulan tryout berkualitas kami.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-center justify-center">
          {bundles.map((bundle, index) => {
            const isPopular = index === 1 || (index === 0 && bundles.length === 1); // Middle one is popular if 3, or first one if less
            const tryoutsCount = bundle.tryouts_count || (bundle.tryouts ? bundle.tryouts.length : 0);

            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                className={`relative bg-white rounded-[2.5rem] p-8 sm:p-10 border transition-all duration-300 group will-change-transform ${
                  isPopular 
                    ? "border-brand-500 shadow-2xl shadow-brand-500/20 scale-100 md:scale-105 z-10" 
                    : "border-slate-100 shadow-xl shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-2"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-black flex items-center gap-1.5 shadow-lg shadow-brand-500/30 uppercase tracking-widest">
                    <Star size={14} className="fill-white" /> Paling Diminati
                  </div>
                )}

                <div className="mb-8 mt-2">
                  <h4 className="text-2xl font-black text-slate-900 mb-2 truncate" title={bundle.name}>{bundle.name}</h4>
                  <p className="text-slate-500 font-medium h-12 overflow-hidden line-clamp-2">{bundle.description || `Paket berisi kumpulan ${tryoutsCount} tryout eksklusif.`}</p>
                </div>

                <div className="mb-10 pb-8 border-b border-slate-100 relative">
                  {bundle.discount_price ? (
                    <>
                      <p className="text-sm font-bold text-slate-400 line-through mb-1">{formatRupiah(bundle.price)}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-brand-600">Rp</span>
                        <span className="text-5xl font-black text-brand-600 tracking-tighter">{new Intl.NumberFormat('id-ID').format(bundle.discount_price)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline gap-1 mt-6">
                      <span className="text-2xl font-bold text-slate-400">Rp</span>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{new Intl.NumberFormat('id-ID').format(bundle.price)}</span>
                    </div>
                  )}
                  
                  {isPopular && (
                    <div className="absolute -bottom-3 right-0 w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center opacity-50 z-[-1]">
                      <Zap size={64} className="text-brand-100" />
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${isPopular ? 'bg-brand-100 text-brand-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <PackageOpen size={12} className="font-bold" />
                    </div>
                    <span className="text-slate-700 font-bold">Akses ke {tryoutsCount} Tryout Premium</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${isPopular ? 'bg-brand-100 text-brand-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Check size={14} className="font-bold" />
                    </div>
                    <span className="text-slate-700 font-semibold">Simulasi CAT Standar BKN</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${isPopular ? 'bg-brand-100 text-brand-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Check size={14} className="font-bold" />
                    </div>
                    <span className="text-slate-700 font-semibold">Pembahasan Soal Mendetail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${isPopular ? 'bg-brand-100 text-brand-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Check size={14} className="font-bold" />
                    </div>
                    <span className="text-slate-700 font-semibold">Ranking Nasional Real-time</span>
                  </li>
                </ul>

                <Link
                  href={`/bundles/${bundle.id}`}
                  className={`block w-full text-center py-4 rounded-2xl font-black transition-all text-lg border-2 ${
                    isPopular
                      ? "bg-brand-600 border-brand-600 hover:bg-brand-700 hover:border-brand-700 text-white shadow-lg shadow-brand-500/30 hover:-translate-y-1"
                      : "bg-white border-slate-200 hover:border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  Lihat Detail Paket
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {bundles.length > 0 && (
          <div className="mt-16 text-center">
            <Link href="/bundles" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors">
              Lihat Semua Katalog Bundle <Zap size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
