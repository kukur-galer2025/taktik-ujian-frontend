"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const defaultTestimonials = [
  {
    name: "Rizky Firmansyah",
    content: "Soal TKP-nya sangat mirip dengan aslinya, bikin saya nggak kaget saat ujian beneran. Lulus PG dengan skor tinggi!",
  },
  {
    name: "Siti Aminah",
    content: "Sistem CAT-nya sangat akurat dan mulus. Analisis kelemahan materinya juga bantu saya fokus belajar TIU.",
  },
  {
    name: "Budi Santoso",
    content: "Berkat fitur Ranking Nasional, saya jadi tahu posisi saya di mana dan makin terpacu untuk belajar. Recommended!",
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/public/reviews');
        if (res.data && res.data.length > 0) {
          setReviews(res.data.slice(0, 3));
        } else {
          setReviews(defaultTestimonials);
        }
      } catch (err) {
        setReviews(defaultTestimonials);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="testimonials" className="py-16 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="will-change-transform"
          >
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
              Mereka Sudah Membuktikan
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Kisah sukses ribuan peserta Taktik Ujian.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-800 hover:border-brand-500/30 transition-all duration-300 relative group will-change-transform"
            >
              <Quote className="absolute top-5 right-5 text-slate-800 w-8 h-8 -z-10 group-hover:text-brand-900/30 transition-colors" />
              
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-medium mb-6 min-h-[60px]">
                "{testi.content || testi.comment}"
              </p>
              
              <div className="flex items-center gap-3 mt-auto border-t border-slate-800/50 pt-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white shrink-0">
                  {(testi.name || testi.user?.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{testi.name || testi.user?.name}</h4>
                  <p className="text-brand-400 text-[10px] font-bold uppercase tracking-wider">{testi.tryout?.title ? `Peserta ${testi.tryout.title}` : 'Alumni'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
