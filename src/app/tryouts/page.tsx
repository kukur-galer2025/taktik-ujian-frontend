"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Clock, Target, Trophy, Star, Loader2, Search, Filter, Eye, PlayCircle,
  ChevronLeft, ChevronRight, CreditCard, Lock
} from "lucide-react";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserNavbar from "@/components/UserNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";

// Category config removed, using dynamic categories from DB

const ITEMS_PER_PAGE = 6;

export default function TryoutsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const [userRes, tryoutRes, catRes] = await Promise.all([
          axios.get("/api/user"),
          axios.get("/api/tryouts"),
          axios.get("/api/categories"),
        ]);
        setUser(userRes.data);
        setTryouts(tryoutRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Memuat Daftar Tryout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <UserNavbar user={user} onLogout={handleLogout} />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-4xl font-black mb-3">Katalog Tryout 📚</h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base mb-6 sm:mb-8">
              Pilih paket tryout yang sesuai kebutuhan. Tersedia tryout SKD lengkap maupun drill khusus per materi.
            </p>
            <div className="relative max-w-xl">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tryout..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm sm:text-base"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-4 mb-6">
          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 hidden sm:block">Tipe:</span>
            {[
              { key: 'ALL', label: 'Semua Tipe' },
              { key: 'GRATIS', label: 'Gratis' },
              { key: 'BERBAYAR', label: 'Berbayar' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setPriceFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  priceFilter === tab.key
                    ? 'bg-brand-100 text-brand-700 shadow-sm border border-brand-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-slate-400 mr-1 hidden sm:block" />
            {[
              { id: 'ALL', name: 'Semua Kategori' },
              ...categories
            ].map(tab => {
              const count = tab.id === 'ALL' ? tryouts.length : (categoryCounts[tab.id] || 0);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id.toString())}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeCategory === tab.id.toString()
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-1.5 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md ${activeCategory === tab.id.toString() ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            <span className="font-black text-slate-800">{filteredTryouts.length}</span> paket ditemukan
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-brand-600 hover:text-brand-700">
              Hapus pencarian
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedTryouts.map((tryout, index) => {
              // Parse category colors
              const catLabel = tryout.category?.name || 'UMUM';
              const catColor = tryout.category?.color || 'bg-slate-50,text-slate-700,border-slate-200,from-slate-50,to-slate-100';
              const classes = catColor.split(',');
              const catBg = classes.find((c: string) => c.startsWith('bg-')) || 'bg-slate-50';
              const catText = classes.find((c: string) => c.startsWith('text-')) || 'text-slate-700';
              const catBorder = classes.find((c: string) => c.startsWith('border-')) || 'border-slate-200';
              const catGrad = classes.filter((c: string) => c.startsWith('from-') || c.startsWith('to-')).join(' ') || 'from-slate-50 to-slate-100';
              
              return (
                <motion.div
                  key={tryout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all flex flex-col h-full overflow-hidden group relative"
                >
                  {tryout.cover_image ? (
                    <div className="h-36 sm:h-40 w-full bg-slate-100 overflow-hidden relative">
                      <img src={getImageUrl(tryout.cover_image)} alt={tryout.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                      <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${catBg} ${catText} ${catBorder}`}>
                        {catLabel}
                      </span>
                    </div>
                  ) : (
                    <div className={`h-36 sm:h-40 w-full bg-gradient-to-br ${catGrad} flex items-center justify-center relative`}>
                      <Target size={40} className={`${catText} opacity-30`} />
                      <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${catBg} ${catText} ${catBorder}`}>
                        {catLabel}
                      </span>
                    </div>
                  )}

                  {!tryout.is_accessible && (
                    <div className="absolute top-0 left-0 right-0 h-36 sm:h-40 bg-slate-900/30 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                      <div className="bg-white/90 p-3 rounded-full text-slate-800 shadow-xl mb-2">
                        <Lock size={24} />
                      </div>
                      <span className="bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">Terkunci</span>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 flex-1 flex flex-col relative z-20 bg-white">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1.5 gap-2">
                        <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug">{tryout.title}</h3>
                        {tryout.reviews_avg_rating && (
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg text-yellow-700 text-xs font-bold shrink-0">
                            <Star size={11} className="fill-yellow-500 text-yellow-500" />
                            {parseFloat(tryout.reviews_avg_rating).toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">{tryout.description}</p>
                    </div>

                    {/* Price + Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-amber-500" /> {tryout.duration_minutes}m</span>
                        <span className="text-slate-200">•</span>
                        <span className="flex items-center gap-1"><BookOpen size={12} className="text-brand-500" /> {tryout.questions_count} soal</span>
                      </div>
                      <span className={`font-black text-sm ${tryout.price > 0 ? 'text-brand-600' : 'text-emerald-600'}`}>
                        {tryout.price > 0 ? formatRupiah(tryout.price) : 'GRATIS'}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link href={`/tryouts/${tryout.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors border-2 border-slate-100 hover:border-brand-200">
                        <Eye size={14} /> Detail
                      </Link>
                      {tryout.is_accessible ? (
                        <Link href={`/tryout/${tryout.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-brand-600 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-md">
                          <PlayCircle size={14} /> Mulai
                        </Link>
                      ) : (
                        <Link href={`/tryouts/${tryout.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-md">
                          <Lock size={14} /> Buka
                        </Link>
                      )}
                      <Link href={`/tryout/${tryout.id}/leaderboard`} className="bg-white hover:bg-yellow-50 text-yellow-600 p-2.5 rounded-xl transition-colors border-2 border-slate-100 hover:border-yellow-200" title="Peringkat">
                        <Trophy size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTryouts.length === 0 && (
            <div className="col-span-full text-center p-12 sm:p-16 bg-white rounded-3xl border border-slate-100 border-dashed">
              <Search size={28} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-lg mb-1">Tidak ditemukan</p>
              <p className="text-slate-400 text-sm">Coba ubah kata kunci atau filter kategori.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  currentPage === page
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
      <MobileBottomNav />
    </div>
  );
}
