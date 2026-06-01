"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse"></span>
              Pendaftaran CPNS 2026 Segera Dibuka!
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Wujudkan Mimpimu Menjadi <span className="text-gradient">ASN Tahun Ini</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Platform Tryout SKD CPNS dan Sekolah Kedinasan terbaik dengan simulasi CAT BKN akurat, pembahasan komprehensif, dan ranking nasional. Persiapan #TaktikUjian maksimal!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-1"
              >
                Mulai Tryout Gratis
                <ArrowRight size={20} />
              </Link>
              <Link
                href="#features"
                className="inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md"
              >
                Lihat Fitur
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-brand-500" />
                <span>10.000+ Peserta</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                <span>95% Tingkat Kelulusan</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Mockup Container */}
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-full bg-gradient-to-tr from-brand-100 to-brand-50 rounded-3xl border border-white shadow-2xl p-4 overflow-hidden">
              {/* Decorative elements representing app UI */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
              
              <div className="relative h-full flex flex-col gap-4">
                {/* Mock Header */}
                <div className="flex justify-between items-center p-4 bg-white/80 rounded-2xl shadow-sm border border-slate-100">
                  <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">PB</div>
                </div>
                
                {/* Mock Chart/Score */}
                <div className="p-6 bg-white/80 rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" className="animate-[spin_3s_ease-in-out_infinite]" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-800">420</span>
                      <span className="text-xs text-slate-500 font-medium">Skor SKD</span>
                    </div>
                  </div>
                  <div className="mt-8 w-full space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">TWK (100)</span>
                      <span className="font-bold text-slate-700">Lulus Passing Grade</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[80%]"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -right-6 top-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                >
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle2 className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <p className="text-sm font-bold text-slate-800">Lulus Seleksi</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
