"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Target, Trophy, Star, Loader2, Search, PlayCircle,
  ChevronLeft, ChevronRight, ShoppingCart, Banknote, Sparkles, X, Filter
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 6;

export default function TryoutsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [tryouts, setTryouts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState('ALL'); // ALL, GRATIS, BERBAYAR
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tryoutRes = await axios.get("/api/tryouts");
        const catRes = await axios.get("/api/categories");
        setTryouts(tryoutRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const filteredTryouts = useMemo(() => {
    return tryouts.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'ALL' || t.category_id == activeCategory;
      const matchPrice = priceFilter === 'ALL' 
        ? true 
        : priceFilter === 'GRATIS' ? t.price === 0 : t.price > 0;
        
      return matchSearch && matchCategory && matchPrice;
    });
  }, [tryouts, searchQuery, activeCategory, priceFilter]);

  const totalPages = Math.ceil(filteredTryouts.length / ITEMS_PER_PAGE);
  const paginatedTryouts = filteredTryouts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useMemo(() => { setCurrentPage(1); }, [searchQuery, activeCategory, priceFilter]);

  const categoryCounts = useMemo(() => {
    // Hanya hitung tryout yang lolos filter pencarian dan harga
    const baseTryouts = tryouts.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = priceFilter === 'ALL' 
        ? true 
        : priceFilter === 'GRATIS' ? t.price === 0 : t.price > 0;
      return matchSearch && matchPrice;
    });

    const counts: Record<string, number> = { ALL: baseTryouts.length };
    baseTryouts.forEach(t => { 
      if (t.category_id) {
        counts[t.category_id] = (counts[t.category_id] || 0) + 1;
      }
    });
    return counts;
  }, [tryouts, searchQuery, priceFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart size={24} className="text-brand-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse">Memuat Katalog Tryout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans selection:bg-brand-500 selection:text-white">
      <UserNavbar user={user} onLogout={logout} />

      {/* Hero Header with Animated Mesh Gradient & Glassmorphism */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] bg-brand-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-brand-300 font-bold text-sm mb-6">
              <Sparkles size={16} /> Update Terbaru Tersedia
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Katalog Tryout <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">Premium</span> 🎯
            </h1>
            
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              Uji kemampuanmu dengan berbagai paket soal berstandar tinggi. Tersedia simulasi lengkap maupun latihan materi spesifik.
            </p>
            
            {/* Glassmorphic Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-50 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-400/50 transition-all">
                <div className="pl-5">
                  <Search size={22} className="text-slate-300" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci pencarian tryout..."
                  className="w-full bg-transparent border-none px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-base font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="pr-5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Curved Bottom Edge */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.41,114.16,189.7,100.8,235.3,90.43,281.33,72.63,321.39,56.44Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-8 relative z-20">
        
        {/* Modern Filters Area */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12">
          
          {/* Price Filter */}
          <div className="flex items-center p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200/60 inline-flex w-fit">
            {[
              { key: 'ALL', label: 'Semua Tipe', icon: <Filter size={16} /> },
              { key: 'GRATIS', label: 'Gratis', icon: <Star size={16} /> },
              { key: 'BERBAYAR', label: 'Berbayar', icon: <Banknote size={16} /> },
            ].map(tab => {
              const isActive = priceFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setPriceFilter(tab.key)}
                  className="relative px-5 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="priceTabIndicator" 
                      className="absolute inset-0 bg-brand-50 border border-brand-100 rounded-xl" 
                      transition={{ type: "spring", stiffness: 100, damping: 25 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}>
                    {tab.icon} {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex-1 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200/60 inline-flex">
              {[
                { id: 'ALL', name: 'Semua Kategori' },
                ...categories
              ].map(tab => {
                const count = tab.id === 'ALL' ? tryouts.length : (categoryCounts[tab.id] || 0);
                if (tab.id !== 'ALL' && count === 0) return null;
                const isActive = activeCategory === tab.id.toString();
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id.toString())}
                    className="relative px-5 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="categoryTabIndicator" 
                        className="absolute inset-0 bg-slate-900 rounded-xl shadow-md" 
                        transition={{ type: "spring", stiffness: 100, damping: 25 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                      {tab.name}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Results Counter */}
        <div className="mb-6 flex justify-end">
           <p className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm inline-block">
            Ditemukan <span className="text-brand-600 font-black">{filteredTryouts.length}</span> Paket
          </p>
        </div>

        {/* Premium Tryout Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {paginatedTryouts.map((tryout, index) => {
              const catLabel = tryout.category?.name || 'UMUM';
              const catColor = tryout.category?.color || 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100';
              const classes = catColor.split(',');
              const catBg = classes.find((c: string) => c.startsWith('bg-')) || 'bg-slate-50';
              const catText = classes.find((c: string) => c.startsWith('text-')) || 'text-slate-700';
              const catBorder = classes.find((c: string) => c.startsWith('border-')) || 'border-slate-200';
              const catGrad = classes.filter((c: string) => c.startsWith('from-') || c.startsWith('to-')).join(' ') || 'from-slate-50 to-slate-100';
              
              const isFree = tryout.price === 0;

              return (
                <motion.div
                  key={tryout.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                  layout
                  className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-50/50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Card Image Area */}
                  <div className="p-3 pb-0">
                    <div className="relative h-44 sm:h-48 w-full rounded-3xl overflow-hidden bg-slate-100 isolate">
                      {/* Glass Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-xl border shadow-sm backdrop-blur-md ${catBg} ${catText} ${catBorder} bg-opacity-90`}>
                          <Target size={12} className={catText} /> {catLabel}
                        </span>
                      </div>
                      
                      {tryout.cover_image ? (
                        <>
                          <img 
                            src={getImageUrl(tryout.cover_image)} 
                            alt={tryout.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${catGrad} flex items-center justify-center relative overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
                          <BookOpen size={64} className={`${catText} opacity-40 transform group-hover:scale-110 transition-transform duration-500`} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex-1 flex flex-col relative z-20">
                    <h3 className="font-black text-xl text-slate-800 line-clamp-2 leading-snug mb-3 group-hover:text-brand-600 transition-colors">
                      {tryout.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                      {tryout.description || 'Paket tryout komprehensif untuk mengasah kemampuan dan meraih skor idaman.'}
                    </p>

                    {/* Meta Pills */}
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                        <Clock size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-slate-600">{tryout.duration_minutes} Menit</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                        <BookOpen size={14} className="text-brand-500" />
                        <span className="text-xs font-bold text-slate-600">{tryout.questions_count} Soal</span>
                      </div>
                    </div>

                    {/* Price and Action Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 mt-auto">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Harga</p>
                        <p className={`text-xl font-black ${isFree ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {isFree ? 'GRATIS' : formatRupiah(tryout.price)}
                        </p>
                      </div>
                      
                      <Link 
                        href={`/tryouts/${tryout.id}`} 
                        className={`group/btn relative overflow-hidden px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${
                          isFree 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
                        }`}
                      >
                        <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10">Beli</span>
                        <ChevronRight size={16} className="relative z-10" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty State / Not Found (Inside Grid for Full Width) */}
          {tryouts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center p-12 sm:p-20 bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 mt-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                  <ShoppingCart size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Katalog Sedang Kosong</h2>
                <p className="text-slate-500 text-base max-w-lg mx-auto mb-10 leading-relaxed">
                  Belum ada tryout yang diterbitkan saat ini. Silakan kunjungi kembali nanti untuk persiapan ujian terbaik dari kami.
                </p>
              </div>
            </motion.div>
          )}

          {tryouts.length > 0 && filteredTryouts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full text-center p-16 bg-white rounded-[3rem] border border-slate-100 border-dashed mt-4"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-800 font-black text-2xl mb-2">Paket tidak ditemukan</p>
              <p className="text-slate-500 max-w-sm mx-auto">Tidak ada tryout yang cocok dengan filter atau kata kunci pencarian Anda.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); setPriceFilter('ALL'); }}
                className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
              >
                Reset Semua Filter
              </button>
            </motion.div>
          )}
        </div>

        {/* Premium Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="inline-flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-xl font-black text-sm transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-br from-brand-500 to-blue-500 text-white shadow-md shadow-brand-500/20 scale-105'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </main>
      <MobileBottomNav />

      {/* Shimmer CSS Animation Definition */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
