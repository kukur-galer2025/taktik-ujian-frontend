"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CtaButton from "@/components/home/CtaButton";
import { useState, useEffect } from "react";

const heroImages = [
  "/hero-image.png",
  "/hero-image-2.png",
  "/hero-image-3.png"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl will-change-transform"
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
              <CtaButton />
              <Link
                href="#features"
                className="inline-flex justify-center items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md"
              >
                Lihat Fitur
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-brand-500" />
                <span>10.000+ Peserta</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                <span>95% Tingkat Kelulusan</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative mt-12 lg:mt-0 will-change-transform flex justify-center lg:justify-end"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-brand-400/30 to-indigo-400/30 blur-[80px] rounded-full"></div>
            
            {/* Main Image Frame */}
            <div className="relative w-full max-w-lg xl:max-w-xl p-3 sm:p-5 bg-white/50 backdrop-blur-2xl border border-white/80 rounded-[2rem] sm:rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group mx-auto">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-[2.2rem] overflow-hidden shadow-inner bg-slate-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={heroImages[currentImageIndex]}
                      alt="Peserta Seleksi ASN dan Kedinasan"
                      fill
                      className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      priority={currentImageIndex === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
