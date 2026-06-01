"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Shield, Save, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        const res = await axios.get("/api/user");
        setUser(res.data);
        setFormData(prev => ({
          ...prev,
          name: res.data.name,
          email: res.data.email
        }));
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try { await axios.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

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
      setTimeout(() => setSuccess(false), 3000);
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-brand-500 flex items-center justify-center text-white text-4xl font-black mb-4 border-4 border-slate-800 shadow-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-black text-white">{user?.name}</h1>
              <p className="text-slate-400 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">Pengaturan Akun</h2>
              <p className="text-sm text-slate-500">Perbarui informasi profil dan keamanan akun Anda.</p>
            </div>

            {success && (
              <div className="mb-6 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
                <CheckCircle2 size={18} /> Profil berhasil diperbarui!
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Informasi Dasar</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <User size={16} className="text-brand-500" /> Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <Mail size={16} className="text-brand-500" /> Alamat Email
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ubah Password (Opsional)</h3>
                <p className="text-xs text-slate-500">Kosongkan jika tidak ingin mengubah password.</p>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <Shield size={16} className="text-slate-400" /> Password Saat Ini
                  </label>
                  <input 
                    type="password" 
                    value={formData.current_password}
                    onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Password Baru</label>
                    <input 
                      type="password" 
                      value={formData.new_password}
                      onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      value={formData.new_password_confirmation}
                      onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/30 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
