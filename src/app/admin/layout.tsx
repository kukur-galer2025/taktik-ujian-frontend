"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, LayoutDashboard, FileText, 
  LogOut, Menu, X, Loader2, ListTree, Users, MessageSquareQuote, Package, Tags, ShoppingCart, Ticket, BarChart2, Zap
} from "lucide-react";
import axios from "@/lib/axios";
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get("/api/user");
        
        if (res.data.is_admin) {
          setIsAdmin(true);
        } else {
          router.push("/dashboard"); // Redirect non-admins
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full animate-pulse delay-1000" />
        <Loader2 className="animate-spin text-brand-500 mb-6 relative z-10" size={48} />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-sm relative z-10 animate-pulse">Otentikasi Admin...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navigation = [
    { name: 'Dashboard Admin', href: '/admin', icon: LayoutDashboard },
    { name: 'Analitik & Laporan', href: '/admin/analytics', icon: BarChart2 },
    { name: 'Manajemen Tryout', href: '/admin/tryouts', icon: FileText },
    { name: 'Manajemen Bundle', href: '/admin/bundles', icon: Package },
    { name: 'Pesanan Masuk', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Manajemen Voucher', href: '/admin/vouchers', icon: Ticket },
    { name: 'Kategori Tryout', href: '/admin/categories', icon: Tags },
    { name: 'Sub Kategori', href: '/admin/subcategories', icon: ListTree },
    { name: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
    { name: 'Kelola Ulasan', href: '/admin/reviews', icon: MessageSquareQuote },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-brand-500 selection:text-white relative">
      <Toaster position="top-right" />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0A0F1C] text-slate-300 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0 border-r border-slate-800/50 shadow-2xl flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Subtle glow behind sidebar */}
        <div className="absolute top-0 left-0 w-full h-64 bg-brand-500/5 blur-[80px] pointer-events-none" />

        <div className="h-20 flex items-center justify-between px-8 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-slate-800/50 z-10 sticky top-0">
          <Link href="/admin" className="flex items-center gap-3 font-black text-2xl group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(var(--brand-500),0.2)]">
              <ShieldCheck size={24} />
            </div>
            <span className="text-white">Tak<span className="text-brand-500">Tik</span><span className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 absolute -mt-4">Admin</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white bg-slate-800/50 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 px-4 space-y-1 relative z-10">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Menu Utama</p>
          
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm overflow-hidden group
                  ${isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }
                `}
              >
                {isActive && (
                  <>
                    <motion.div layoutId="activeNavBackground" className="absolute inset-0 bg-brand-600 z-0" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay z-0 pointer-events-none" />
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 bg-white/20 blur-xl rounded-full z-0 pointer-events-none" />
                  </>
                )}
                <item.icon size={20} className={`relative z-10 transition-transform ${isActive ? 'text-white' : 'text-slate-500 group-hover:scale-110 group-hover:text-brand-400'}`} />
                <span className="relative z-10">{item.name}</span>
                
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full z-10 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="p-6 border-t border-slate-800/50 bg-[#0A0F1C]/80 backdrop-blur-md relative z-10">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-2xl text-sm font-black text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Keluar Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50 relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white/80 backdrop-blur-lg border-b border-slate-200 flex items-center px-6 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 -ml-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="ml-4 flex items-center gap-2 font-black text-xl text-slate-900">
             <ShieldCheck className="text-brand-500" size={24} /> Admin
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto custom-scrollbar-light pb-10">
          {children}
        </div>
      </main>

      {/* Global CSS for scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        
        .custom-scrollbar-light::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}} />
    </div>
  );
}
