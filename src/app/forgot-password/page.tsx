"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const whatsappMessage = encodeURIComponent("Halo Admin, saya lupa kata sandi akun TaktikUjian saya. Mohon bantuannya untuk melakukan reset kata sandi.");
  const waLink = `https://wa.me/628985477864?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 group mb-8">
          <img src="/logokotak.png" alt="Taktik Ujian" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 rounded-3xl sm:px-10 border border-slate-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Lupa Kata Sandi?</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Untuk alasan keamanan, penyetelan ulang kata sandi saat ini dilakukan secara manual. Silakan hubungi admin kami melalui WhatsApp untuk mereset kata sandi Anda.
            </p>
          </div>

          <div className="space-y-6">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-500/30 text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Admin via WhatsApp
            </a>

            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke halaman Login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
