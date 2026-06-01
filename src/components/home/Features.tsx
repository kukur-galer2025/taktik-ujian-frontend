"use client";

import { motion } from "framer-motion";
import { MonitorPlay, FileText, Trophy, Clock, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Simulasi CAT BKN Asli",
    description: "Tampilan dan sistem penilaian sama persis dengan sistem CAT dari BKN untuk membiasakan diri Anda.",
    icon: MonitorPlay,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Soal Terupdate & HOTS",
    description: "Ribuan bank soal terbaru yang disusun oleh tim ahli, disesuaikan dengan kisi-kisi CPNS 2026 (TWK, TIU, TKP).",
    icon: FileText,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Ranking Nasional Real-Time",
    description: "Ukur kemampuanmu dengan membandingkan skor secara langsung dengan puluhan ribu peserta lain se-Indonesia.",
    icon: Trophy,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Manajemen Waktu Efektif",
    description: "Latih kecepatan mengerjakan soal dengan timer yang disesuaikan dengan standar ujian sebenarnya.",
    icon: Clock,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Analisis Statistik Mendalam",
    description: "Evaluasi kelemahan dan kekuatanmu di setiap materi dengan grafik statistik hasil tryout yang detail.",
    icon: BarChart3,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Sistem Anti Curang",
    description: "Dilengkapi fitur keamanan mencegah kecurangan agar hasil tryout murni mencerminkan kemampuan asli.",
    icon: ShieldCheck,
    color: "bg-teal-100 text-teal-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-3">Keunggulan Taktik Ujian</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
            Segala yang Anda Butuhkan untuk Lulus
          </h3>
          <p className="text-lg text-slate-600">
            Kami merancang sistem tryout terbaik untuk memberikan pengalaman ujian yang paling mendekati aslinya, sehingga mental dan materi Anda siap 100%.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-brand-100/50 hover:-translate-y-1 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
