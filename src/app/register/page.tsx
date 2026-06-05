"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Mail, Lock, Loader2, AlertCircle, CheckCircle2, BarChart, Phone, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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
            <img src="/logo-taktik-samping.webp" alt="Taktik Ujian" className="h-12 w-auto object-contain" />
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-12 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
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

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">atau daftar instan dengan</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/auth/google/redirect`}
                  className="w-full flex justify-center items-center gap-3 py-3.5 px-4 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Daftar dengan Google
                </a>
              </div>
            </div>
            
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
