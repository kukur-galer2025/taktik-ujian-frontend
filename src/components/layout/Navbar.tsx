"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Alur Belajar", href: "/#how-it-works" },
    { name: "Keunggulan", href: "/#features" },
    { name: "Paket Tryout", href: "/#pricing" },
    { name: "Testimoni", href: "/#testimonials" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-10">
            <img 
              src="/logokotak.png" 
              alt="Taktik Ujian" 
              className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-8' : 'h-10'}`} 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-brand-600 font-medium px-4 py-2 rounded-full hover:bg-slate-50 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading ? (
              user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="text-slate-600 hover:text-brand-600 font-semibold px-4 py-2 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
                  >
                    Profil
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-600 hover:text-brand-600 font-semibold px-4 py-2 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
                  >
                    Daftar Gratis
                  </Link>
                </>
              )
            ) : (
              <div className="h-10 w-32 bg-slate-100 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center relative z-10">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-brand-600 p-2 -mr-2 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200/50 shadow-2xl overflow-hidden md:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-2 max-w-7xl mx-auto">
              {navLinks.map((link, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-slate-700 font-semibold text-lg hover:text-brand-600 hover:bg-brand-50 px-4 py-3 rounded-2xl transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-3 px-2"
              >
                {!loading ? (
                  user ? (
                    <>
                      <Link
                        href={user.role === 'admin' ? '/admin' : '/dashboard'}
                        className="text-center text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold py-3.5 rounded-2xl transition-colors"
                      >
                        Ke Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="text-center bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-2xl font-semibold shadow-md shadow-brand-500/20 transition-all"
                      >
                        Profil Saya
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-center text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold py-3.5 rounded-2xl transition-colors"
                      >
                        Masuk
                      </Link>
                      <Link
                        href="/register"
                        className="text-center bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-2xl font-semibold shadow-md shadow-brand-500/20 transition-all"
                      >
                        Daftar Sekarang
                      </Link>
                    </>
                  )
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
