"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut, Menu, X, Receipt, User, Tag, ChevronDown, Settings, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserNavbarProps {
  user: any;
  onLogout: () => void;
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tryouts', label: 'Katalog Tryout' },
  { href: '/my-tryouts', label: 'Tryout Saya' },
  { href: '/bundles', label: 'Bundle' },
  { href: '/analytics', label: 'Analitik' },
  { href: '/vouchers', label: 'Promo' },
];

export default function UserNavbar({ user, onLogout }: UserNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <img src="/logokotak.png" alt="Taktik Ujian" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

          {/* Right: User Dropdown */}
          <div className="flex items-center gap-2">
            {/* Desktop Dropdown */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${
                  dropdownOpen ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3.5 bg-slate-50/80 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Settings size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">Edit Profil</p>
                          <p className="text-[11px] text-slate-400">Ubah nama, email & password</p>
                        </div>
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Receipt size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">Riwayat Pesanan</p>
                          <p className="text-[11px] text-slate-400">Cek status pembelianmu</p>
                        </div>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-1.5 border-t border-slate-100">
                      <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400">
                          <LogOut size={16} />
                        </div>
                        <span className="font-semibold">Keluar dari Akun</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="px-2 py-2 space-y-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    isActive(link.href) ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                  <User size={16} /> <span className="font-semibold">Edit Profil</span>
                </Link>
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                  <Receipt size={16} /> <span className="font-semibold">Riwayat Pesanan</span>
                </Link>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-100">
              <button onClick={onLogout} className="flex items-center gap-2 text-sm text-red-500 font-bold w-full px-2 py-2 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
