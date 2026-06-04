"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, Save, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Settings } from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMsg('');

    if (formData.new_password && formData.new_password !== formData.new_password_confirmation) {
      setErrorMsg("Konfirmasi password baru tidak cocok.");
      setSaving(false);
      return;
    }

    try {
      const res = await axios.put("/api/user", formData);
      setUser(res.data.user);
      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }));
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        setErrorMsg(firstError[0]);
      } else {
        setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Settings size={24} className="text-brand-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-12 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
        >
          {/* Header Profile */}
          <div className="bg-slate-900 px-8 py-12 text-center relative overflow-hidden">
            {/* Animated Mesh Background for Profile */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] bg-brand-500/30 rounded-full blur-[80px] animate-[spin_15s_linear_infinite]" />
              <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[80px] animate-[spin_10s_linear_infinite_reverse]" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-5 group cursor-pointer">
                <div className="absolute inset-0 bg-brand-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300" />
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white text-4xl font-black border-4 border-slate-800 shadow-2xl relative z-10">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">{user?.name}</h1>
              <p className="text-brand-200 font-medium text-sm sm:text-base mt-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">{user?.email}</p>
            </div>
          </div>

          <div className="p-6 sm:p-10 relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mb-8 border-b border-slate-100 pb-5 relative z-10">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Settings size={22} className="text-brand-500" /> Pengaturan Akun
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Perbarui informasi profil dan perkuat keamanan akun Anda.</p>
            </div>

            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-emerald-50 text-emerald-700 px-5 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 border border-emerald-100 shadow-sm relative z-10">
                  <div className="bg-emerald-100 p-1.5 rounded-full"><CheckCircle2 size={18} /></div> Profil Anda berhasil diperbarui!
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-red-50 text-red-700 px-5 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 border border-red-100 shadow-sm relative z-10">
                  <div className="bg-red-100 p-1.5 rounded-full"><AlertCircle size={18} /></div> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   Informasi Dasar <div className="h-px bg-slate-100 flex-1 ml-2" />
                </h3>
                
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
                  <label className="block text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                    <User size={16} className="text-brand-500" /> Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                  />
                </div>

                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
                  <label className="block text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-brand-500" /> Alamat Email
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-5 pt-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Keamanan Akun</h3>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>
                
                <div className="bg-amber-50/50 p-5 sm:p-6 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                   
                   <p className="text-xs font-bold text-amber-700 mb-4 flex items-center gap-2 relative z-10 bg-amber-100/50 w-fit px-3 py-1.5 rounded-lg border border-amber-200/50">
                     <AlertCircle size={14} /> Kosongkan jika tidak ingin mengubah password.
                   </p>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="block text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                        <Shield size={16} className="text-amber-600" /> Password Saat Ini
                      </label>
                      <input 
                        type="password" 
                        value={formData.current_password}
                        onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-black text-slate-800 mb-2">Password Baru</label>
                        <input 
                          type="password" 
                          value={formData.new_password}
                          onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                          className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-slate-800 mb-2">Konfirmasi Password Baru</label>
                        <input 
                          type="password" 
                          value={formData.new_password_confirmation}
                          onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
                          className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/30 hover:-translate-y-1 disabled:opacity-50 disabled:shadow-none group relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  {saving ? <Loader2 size={20} className="animate-spin relative z-10" /> : <Save size={20} className="relative z-10 group-hover:scale-110 transition-transform" />}
                  <span className="relative z-10">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
      
      {/* Shimmer CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
      <MobileBottomNav />
    </div>
  );
}
