"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Rizky Firmansyah",
    role: "Lolos CPNS Kementerian Keuangan 2024",
    content: "Taktik Ujian benar-benar membantu saya mengukur kemampuan sebelum tes asli. Soal TKP-nya sangat mirip dengan aslinya, bikin saya nggak kaget saat ujian beneran. Alhamdulillah lulus PG dengan skor tinggi!",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Siti Aminah",
    role: "Lolos CPNS Pemerintah Daerah 2024",
    content: "Sistem CAT-nya sangat akurat dan mulus. Saya yang awalnya gaptek jadi terbiasa dengan sistem BKN berkat sering tryout di sini. Analisis kelemahan materinya juga bantu saya fokus belajar TIU.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "Budi Santoso",
    role: "Lolos Sekolah Kedinasan STAN 2024",
    content: "Persaingan STAN sangat ketat, tapi berkat fitur Ranking Nasional di Taktik Ujian, saya jadi tahu posisi saya di mana dan makin terpacu untuk belajar. Recommended banget buat pejuang NIP!",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-brand-950 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-400 font-bold tracking-wide uppercase text-sm mb-3">Kisah Sukses</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Mereka Sudah Membuktikan
          </h3>
          <p className="text-lg text-slate-400">
            Ribuan peserta telah mewujudkan mimpi mereka menjadi ASN melalui persiapan matang di platform kami. Giliran Anda selanjutnya!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-800 hover:border-brand-500/50 transition-colors relative"
            >
              <Quote className="absolute top-6 right-6 text-brand-900/50 w-16 h-16 -z-10" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-500">
                  <Image 
                    src={testi.avatar} 
                    alt={testi.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{testi.name}</h4>
                  <p className="text-brand-400 text-sm font-medium">{testi.role}</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed italic">
                "{testi.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
