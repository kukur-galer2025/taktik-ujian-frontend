"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Paket Gratis",
    price: "0",
    description: "Cocok untuk pemula yang ingin mencoba sistem CAT kami.",
    features: [
      "1x Tryout SKD Full",
      "Pembahasan Dasar",
      "Ranking Nasional",
      "Sistem CAT Asli",
    ],
    buttonText: "Mulai Gratis",
    isPopular: false,
  },
  {
    name: "Paket Lulus PNS",
    price: "99.000",
    period: "/bulan",
    description: "Pilihan terbaik dengan fitur super lengkap untuk kelulusanmu.",
    features: [
      "10x Tryout SKD Premium",
      "Pembahasan Video Eksklusif",
      "Analisis Kelemahan Materi",
      "Ranking Nasional Real-time",
      "Grup Diskusi Telegram",
      "Materi TWK, TIU, TKP Terupdate",
    ],
    buttonText: "Beli Paket Sekarang",
    isPopular: true,
  },
  {
    name: "Paket Intensif",
    price: "249.000",
    period: "/3 bulan",
    description: "Akses sepuasnya untuk persiapan matang hingga hari H ujian.",
    features: [
      "Tryout SKD Premium Sepuasnya",
      "Semua Fitur Paket Lulus PNS",
      "Sesi Mentoring Zoom Mingguan",
      "Simulasi Wawancara",
      "Prioritas Support Pelanggan",
    ],
    buttonText: "Pilih Paket Intensif",
    isPopular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-brand-300/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-brand-200/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-3">Investasi Masa Depan</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Pilih Paket Belajar Terbaikmu
          </h3>
          <p className="text-lg text-slate-600">
            Biaya sangat terjangkau dibandingkan dengan manfaat seumur hidup sebagai ASN. Mulai dari yang gratis hingga paket intensif!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative bg-white rounded-3xl p-8 border ${
                plan.isPopular 
                  ? "border-brand-500 shadow-2xl shadow-brand-500/20 scale-100 md:scale-105 z-10" 
                  : "border-slate-200 shadow-lg hover:shadow-xl"
              } transition-all`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-500 to-blue-400 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                  <Star size={14} className="fill-white" /> Paling Diminati
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h4>
                <p className="text-slate-500 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-slate-400">Rp</span>
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                </div>
                {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-emerald-600 font-bold" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                  plan.isPopular
                    ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/50 hover:-translate-y-1"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                }`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
