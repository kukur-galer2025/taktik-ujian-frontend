"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Mail, Lock, Loader2, AlertCircle, CheckCircle2, BarChart, Phone } from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First get CSRF cookie
      await axios.get("/sanctum/csrf-cookie");
      
      // Then register
      const response = await axios.post("/api/register", {
        name,
        email,
        phone_number: phoneNumber,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        if (response.data.user) {
          setUser(response.data.user);
        }
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        setError(firstError[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column: Beautiful Image & Glassmorphism */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-slate-900 items-center justify-center p-12">
        {/* Background Image from Unsplash */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513258496099-48166314a708?q=80&w=2000&auto=format&fit=crop')" }}
        >
          {/* Deep dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-slate-900/80 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-emerald-900/20"></div>
        </div>

        {/* Floating Glassmorphism Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full font-bold text-sm mb-8 border border-emerald-500/30">
            <CheckCircle2 size={16} /> Platform Pilihan No.1 di Indonesia
          </div>
          
          <h3 className="text-4xl font-black text-white leading-tight mb-6">
            Investasi Terbaik Untuk <span className="text-emerald-400">Karir Masa Depan.</span>
          </h3>
          <p className="text-emerald-50 text-lg mb-10 leading-relaxed opacity-90">
            Ribuan peserta CPNS dan Kedinasan sudah mempersiapkan diri mereka lebih awal. Gabung sekarang dan nikmati semua fitur simulasi unggulan kami secara gratis!
          </p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 text-white bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">100% Akses Ujian CAT Asli</p>
                <p className="text-sm text-emerald-200">Simulasi interface persis standar BKN.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <BarChart size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Evaluasi Rinci Nilai SKD</p>
                <p className="text-sm text-emerald-200">Analisis kelemahan pada materi TWK, TIU & TKP.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[48rem] xl:px-24 bg-white relative overflow-hidden">
        {/* Subtle decorative circles for the form side */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
          <Link href="/" className="flex items-center gap-2 group mb-10">
            <img src="/logokotak.png" alt="Taktik Ujian" className="h-12 w-auto object-contain" />
          </Link>
          
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-base text-slate-600">
              Siapkan diri Anda menjadi abdi negara dengan berlatih bersama TaktikUjian.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={18} />
                <span className="text-sm text-red-700 font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} />
                <span className="text-sm text-emerald-700 font-medium">Pendaftaran berhasil! Mengalihkan ke Dashboard...</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  Alamat Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="anda@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-bold text-slate-700 mb-2">
                  Nomor Handphone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                  Kata Sandi
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="Minimal 8 karakter"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-2 border-slate-300 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="terms" className="ml-2.5 block text-sm font-medium text-slate-600 cursor-pointer select-none">
                  Saya setuju dengan <a href="#" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">Syarat & Ketentuan</a>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-500/30 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : null}
                  {loading ? "Memproses..." : "Daftar Akun Sekarang"}
                </button>
              </div>
            </form>
            
            <p className="mt-10 text-center text-sm font-medium text-slate-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
