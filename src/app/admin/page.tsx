"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, FileText, CheckCircle } from "lucide-react";
import axios from "@/lib/axios";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({ tryouts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/tryouts");
        setStats({ tryouts: res.data.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-500">Ringkasan platform TaktikUjian hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Tryout</p>
            <p className="text-2xl font-bold text-slate-900">{stats.tryouts}</p>
          </div>
        </div>

        {/* Dummy Stats for MVP */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pengguna</p>
            <p className="text-2xl font-bold text-slate-900">124</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ujian Diselesaikan</p>
            <p className="text-2xl font-bold text-slate-900">892</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Selamat datang di Panel Admin!</h2>
        <p className="text-slate-600">
          Gunakan menu di sebelah kiri untuk mengelola paket Tryout dan menambahkan soal-soal baru. Semua perubahan yang Anda buat di sini akan langsung terlihat oleh pengguna aplikasi.
        </p>
      </div>
    </div>
  );
}
