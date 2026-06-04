"use client";

import { motion } from "framer-motion";
import { MonitorPlay, FileText, Trophy, Clock, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Simulasi CAT BKN Asli",
    description: "Tampilan dan sistem penilaian sama persis dengan sistem CAT dari BKN untuk membiasakan diri Anda.",
    icon: MonitorPlay,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    textColor: "text-blue-600",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Soal Terupdate & HOTS",
    description: "Ribuan bank soal terbaru yang disusun oleh tim ahli, disesuaikan dengan kisi-kisi CPNS 2026.",
    icon: FileText,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    textColor: "text-amber-600",
    shadow: "shadow-amber-500/20"
  },
  {
    title: "Ranking Nasional Real-Time",
    description: "Ukur kemampuanmu dengan membandingkan skor secara langsung dengan puluhan ribu peserta lain.",
    icon: Trophy,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    textColor: "text-emerald-600",
    shadow: "shadow-emerald-500/20"
  },
  {
    title: "Manajemen Waktu Efektif",
    description: "Latih kecepatan mengerjakan soal dengan timer yang disesuaikan dengan standar ujian sebenarnya.",
    icon: Clock,
    color: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-50",
    textColor: "text-purple-600",
    shadow: "shadow-purple-500/20"
  },
  {
    title: "Analisis Statistik Mendalam",
    description: "Evaluasi kelemahan dan kekuatanmu di setiap materi dengan grafik statistik hasil tryout yang detail.",
    icon: BarChart3,
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    textColor: "text-rose-600",
    shadow: "shadow-rose-500/20"
  },
  {
    title: "Sistem Anti Curang",
    description: "Dilengkapi fitur keamanan mencegah kecurangan agar hasil tryout murni mencerminkan kemampuan asli.",
    icon: ShieldCheck,
    color: "from-brand-500 to-indigo-500",
    bg: "bg-brand-50",
    textColor: "text-brand-600",
    shadow: "shadow-brand-500/20"
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="will-change-transform"
          >
            <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-3 block">Keunggulan Platform</span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Segala yang Anda Butuhkan untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Lulus</span>
            </h3>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Kami merancang sistem tryout terbaik untuk memberikan pengalaman ujian yang paling mendekati aslinya, sehingga mental dan materi Anda siap 100%.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              className="relative group will-change-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] blur-xl -z-10" style={{ backgroundImage: `var(--tw-gradient-stops)` }} />
              
              <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:shadow-2xl group-hover:border-transparent transition-all duration-300 h-full flex flex-col items-start group-hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.textColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg ${feature.shadow}`}>
                  <feature.icon size={32} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-600 font-medium leading-relaxed flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
