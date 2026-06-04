"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      setLoading(false);
      return;
    }
    
    if (password.trim() === "") {
      setError("Kata sandi tidak boleh kosong.");
      setLoading(false);
      return;
    }

    try {
      // First get CSRF cookie
      await axios.get("/sanctum/csrf-cookie");
      
      // Then login
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      if (response.data.access_token) {
        // Save token to localStorage (or you could rely entirely on Sanctum cookies)
        localStorage.setItem("token", response.data.access_token);
        
        // Update auth context state immediately
        if (response.data.user) {
          setUser(response.data.user);
        }
        
        // Smart Redirect
        const nextPath = searchParams.get('next') || '/dashboard';
        router.push(nextPath);
      }
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
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
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[48rem] xl:px-24 relative overflow-hidden">
        {/* Subtle decorative circles for the form side */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
          <Link href="/" className="flex items-center gap-2 group mb-10">
            <img src="/logo-taktik-samping.webp" alt="Taktik Ujian" className="h-12 w-auto object-contain" />
          </Link>
          
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Selamat Datang Kembali! 👋
            </h2>
            <p className="text-base text-slate-600">
              Masuk untuk melanjutkan persiapan tes CPNS dan raih skor tertinggi Anda hari ini.
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

            <form className="space-y-5" onSubmit={handleLogin} noValidate>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="nama@email.com"
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-12 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                    placeholder="••••••••"
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

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-2 border-slate-300 rounded cursor-pointer transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2.5 block text-sm font-medium text-slate-700 cursor-pointer select-none">
                    Ingat saya
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    href="/forgot-password"
                    className="font-bold text-brand-600 hover:text-brand-500 transition-colors"
                  >
                    Lupa sandi?
                  </Link>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-500/30 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : null}
                  {loading ? "Menautkan..." : "Masuk ke Dashboard"}
                </button>
              </div>
            </form>
            
            <p className="mt-10 text-center text-sm font-medium text-slate-600">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Beautiful Image & Glassmorphism */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-slate-900 items-end justify-center pb-24 px-12">
        {/* Background Image from Unsplash */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop')" }}
        >
          {/* Deep dark gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-brand-900/20"></div>
        </div>

        {/* Floating Glassmorphism Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-6 h-6 text-amber-400 fill-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <h3 className="text-3xl font-black text-white leading-snug mb-6">
            "Sistem CAT-nya yang paling mirip dengan aslinya. Bikin saya nggak grogi waktu tes CPNS sungguhan. Nilai TIU saya meroket!"
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-brand-400 overflow-hidden bg-slate-300">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Rizky" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Rizky Firmansyah</p>
              <p className="text-brand-300 font-medium">Lolos CPNS Kemenkeu 2024</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
