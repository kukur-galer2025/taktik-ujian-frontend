"use client";

import { motion } from "framer-motion";
import { UserPlus, BookOpenCheck, LineChart, Trophy } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Buat Akun",
    description: "Daftar secara gratis dalam hitungan detik. Akses langsung ke dashboard personal Anda.",
    icon: UserPlus,
    color: "bg-blue-500",
    shadow: "shadow-blue-500/30"
  },
  {
    id: 2,
    title: "Pilih Tryout",
    description: "Pilih paket tryout SKD atau Kedinasan yang sesuai dengan target impian Anda.",
    icon: BookOpenCheck,
    color: "bg-brand-500",
    shadow: "shadow-brand-500/30"
  },
  {
    id: 3,
    title: "Simulasi CAT",
    description: "Kerjakan simulasi dengan interface yang 100% mirip dengan tes asli dari BKN.",
    icon: LineChart,
    color: "bg-fuchsia-500",
    shadow: "shadow-fuchsia-500/30"
  },
  {
    id: 4,
    title: "Evaluasi Hasil",
    description: "Lihat hasil, pembahasan detail, dan ranking nasional Anda seketika setelah selesai.",
    icon: Trophy,
    color: "bg-emerald-500",
    shadow: "shadow-emerald-500/30"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-3 block">Alur Belajar</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">Bagaimana Cara Kerjanya?</h2>
          <p className="text-slate-600 text-lg">Hanya 4 langkah mudah menuju kesuksesan tes ASN Anda. Mulai persiapan sekarang dan jadilah yang terbaik.</p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full ${step.color} text-white flex items-center justify-center mb-6 shadow-xl ${step.shadow} group-hover:scale-110 transition-transform duration-300 relative z-10 border-4 border-white`}>
                  <step.icon size={32} />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm border-2 border-white">
                    {step.id}
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
