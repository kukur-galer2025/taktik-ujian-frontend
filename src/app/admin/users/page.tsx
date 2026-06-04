"use client";

import { useEffect, useState } from "react";
import { Users, Search, Trash2, Mail, Phone, Calendar, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import axios from "@/lib/axios";
import { Toast, Dialog } from '@/lib/sweetalert';
import { motion } from "framer-motion";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Dialog.fire({
      icon: 'warning',
      title: 'Yakin ingin menghapus?',
      text: 'Menghapus user akan menghapus semua data ujian dan transaksi mereka secara permanen.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444'
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
      Toast.fire({ icon: 'success', title: 'User berhasil dihapus' });
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        Toast.fire({ icon: 'error', title: 'Tidak dapat menghapus akun Admin!' });
      } else {
        Toast.fire({ icon: 'error', title: 'Terjadi kesalahan saat menghapus user' });
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.phone_number && user.phone_number.includes(search))
  );

  if (loading) {
    return (
      <div className="flex-1 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 shadow-sm">
             <Users size={28} className="text-brand-600 animate-pulse" />
           </div>
           <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
           <p className="text-slate-500 font-bold tracking-widest uppercase text-xs animate-pulse">Memuat Data Pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 selection:bg-brand-500 selection:text-white">
      {/* Header Premium */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 mb-8 relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute -top-1/2 -left-1/4 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px]" />
           <div className="absolute -bottom-1/2 -right-1/4 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px]" />
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-300 shadow-xl border border-white/20">
               <Users size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight mb-1">Manajemen Pengguna</h1>
               <p className="text-slate-300 font-medium">Pantau dan kelola seluruh peserta terdaftar di platform Anda.</p>
             </div>
           </div>
           
           <div className="bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 text-center shadow-lg min-w-[160px]">
             <p className="text-[10px] font-black text-brand-200 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5"><Users size={12} /> Total Terdaftar</p>
             <p className="text-2xl font-black text-white">{users.length} Akun</p>
           </div>
         </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-[2rem] p-6 mb-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex justify-end items-center relative z-10">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3.5 font-bold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative z-10">
        {filteredUsers.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-6">
              <AlertCircle size={40} className="text-slate-300" />
            </div>
            <p className="font-black text-slate-800 text-xl mb-2">Tidak Ada Data Pengguna</p>
            <p className="text-slate-500 font-medium">Kata kunci pencarian tidak cocok dengan akun manapun.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
                  <th className="px-8 py-6 rounded-tl-[2.5rem]">Peserta</th>
                  <th className="px-6 py-6">Informasi Kontak</th>
                  <th className="px-6 py-6 text-center">Partisipasi Ujian</th>
                  <th className="px-6 py-6 text-center">Bergabung Sejak</th>
                  <th className="px-8 py-6 text-right rounded-tr-[2.5rem]">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    key={user.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`absolute inset-0 ${user.is_admin ? 'bg-blue-400' : 'bg-brand-400'} rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity`} />
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-md relative z-10 ${user.is_admin ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-brand-400 to-brand-600'}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base mb-1 group-hover:text-brand-700 transition-colors flex items-center gap-2">
                            {user.name}
                            {user.is_admin && (
                              <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                <ShieldCheck size={10} /> Admin
                              </span>
                            )}
                          </p>
                          <p className="text-xs font-bold text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><Mail size={14} /></div>
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><Phone size={14} /></div>
                          {user.phone_number || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center min-w-[3rem] h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 font-black text-lg shadow-sm">
                        {user.results_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!user.is_admin ? (
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-red-500/30 group/btn"
                          title="Hapus Akun Permanen"
                        >
                          <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                          Dilindungi
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
