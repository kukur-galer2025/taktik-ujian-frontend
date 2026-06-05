"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { Phone, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhoneNumberModal() {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in but has no phone number
    if (user && !user.phone_number) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/[-_ .]/g, "");
    const phoneRegex = /^08[0-9]{8,11}$/;

    if (!cleanPhone) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    if (!phoneRegex.test(cleanPhone)) {
      setError("Nomor HP tidak valid. Harus diawali '08' dan terdiri dari 10-13 angka.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.put("/api/user", {
        name: user?.name,
        email: user?.email,
        phone_number: cleanPhone,
      });
      setUser(res.data.user);
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors?.phone_number) {
        setError(err.response.data.errors.phone_number[0]);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 sm:p-8">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Phone size={28} className="sm:hidden" />
                <Phone size={32} className="hidden sm:block" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Lengkapi Profil Anda</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Karena Anda masuk menggunakan Google, kami memerlukan nomor handphone Anda untuk menyelesaikan pendaftaran dan keperluan komunikasi penting.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                  <AlertCircle className="text-red-500 mt-0.5" size={18} />
                  <span className="text-sm text-red-700 font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-bold text-slate-700 mb-2">
                    Nomor Handphone (WhatsApp aktif)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    </div>
                    <input
                      id="phone_number"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="appearance-none block w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 sm:text-sm font-medium transition-all hover:border-slate-300"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-500/30 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                  {loading ? "Menyimpan..." : "Simpan Nomor Handphone"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
