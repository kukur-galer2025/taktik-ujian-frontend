"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, LayoutDashboard, FileText, 
  LogOut, Menu, X, Loader2, ListTree, Users, MessageSquareQuote, Package, Tags, ShoppingCart, Ticket
} from "lucide-react";
import axios from "@/lib/axios";
import { Toaster } from 'react-hot-toast';

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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-500 mb-4" size={48} />
        <p className="text-slate-400 font-medium">Memeriksa Hak Akses Admin...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navigation = [
    { name: 'Dashboard Admin', href: '/admin', icon: LayoutDashboard },
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
    <div className="min-h-screen bg-slate-50 flex">
      <Toaster position="top-right" />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl">
            <ShieldCheck className="text-brand-500" />
            <span>Admin<span className="text-brand-500">Panel</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
                  ${isActive 
                    ? 'bg-brand-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Keluar Mode Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-slate-800">Admin Panel</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
