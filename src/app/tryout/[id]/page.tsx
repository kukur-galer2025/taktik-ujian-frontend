"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, CheckCircle2, X, Menu } from "lucide-react";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Toast } from '@/lib/sweetalert';

export default function TryoutBKNPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tryout, setTryout] = useState<any>(null);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doubts, setDoubts] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile palette state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [checkAgreed, setCheckAgreed] = useState(false);

  useEffect(() => {
    const fetchTryout = async () => {
      try {
        const tryoutRes = await axios.get(`/api/tryouts/${id}`);
        
        setTryout(tryoutRes.data);
        setQuestions(tryoutRes.data.questions);
        setTimeLeft(tryoutRes.data.duration_minutes * 60);

        const savedAnswers = localStorage.getItem(`tryout_answers_${id}`);
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

        const savedDoubts = localStorage.getItem(`tryout_doubts_${id}`);
        if (savedDoubts) setDoubts(JSON.parse(savedDoubts));
      } catch (err) {
        console.error(err);
        Toast.fire({ icon: 'error', title: 'Gagal memuat ujian. Silakan coba lagi.' });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTryout();
  }, [id, router]);

  useEffect(() => {
    if (loading || timeLeft <= 0 || !hasAgreed) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { 
          clearInterval(timerId); 
          executeSubmit(); 
          return 0; 
        }
        if (prev === 300 && !warningShown) {
          setShowWarningModal(true);
          setWarningShown(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [loading, timeLeft, warningShown, hasAgreed]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`tryout_answers_${id}`, JSON.stringify(answers));
    }
  }, [answers, id]);

  useEffect(() => {
    localStorage.setItem(`tryout_doubts_${id}`, JSON.stringify(doubts));
  }, [doubts, id]);

  const handleAnswerSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const toggleDoubt = () => {
    const qId = questions[currentIndex].id;
    setDoubts((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const executeSubmit = async () => {
    setSubmitting(true);
    setShowSubmitModal(false);
    try {
      const timeTakenMinutes = tryout.duration_minutes - Math.floor(timeLeft / 60);
      const response = await axios.post(`/api/tryouts/${id}/submit`, {
        answers,
        time_taken_minutes: timeTakenMinutes,
      });
      localStorage.removeItem(`tryout_answers_${id}`);
      localStorage.removeItem(`tryout_doubts_${id}`);
      router.push(`/tryout/${id}/result?resultId=${response.data.result.id}`);
    } catch (err) {
      console.error(err);
      Toast.fire({ icon: 'error', title: 'Terjadi kesalahan saat menyimpan jawaban.' });
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <Loader2 className="animate-spin text-[#1e3a8a]" size={48} />
      </div>
    );
  }

  if (!hasAgreed) {
    return (
      <div className="min-h-screen lg:h-screen flex flex-col bg-[#eef2f5] font-[Arial,Helvetica,sans-serif] lg:overflow-hidden relative">
        {/* Fake Blurred Background */}
        <header className="bg-[#1e3a8a] text-white flex flex-col md:flex-row justify-between items-stretch shrink-0 border-b-[5px] border-[#fbbf24] opacity-40 blur-sm pointer-events-none">
          <div className="flex items-center px-4 py-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-wide m-0">SISTEM COMPUTER ASSISTED TEST</h1>
              <p className="text-xs md:text-sm m-0 text-gray-200 uppercase">{tryout.title}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-white opacity-40 blur-sm pointer-events-none"></main>

        {/* MODAL OVERLAY */}
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 fade-in duration-300">
             {/* Glowing accent at the top */}
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
             
             <div className="p-8 text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-rose-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100/50 -rotate-3 transition-transform hover:rotate-0">
                  <AlertTriangle size={36} strokeWidth={2.5} className="animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Peringatan Hak Cipta</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Soal ujian ini adalah properti eksklusif <strong>TaktikUjian</strong> dan dilindungi oleh Undang-Undang.
                </p>
                
                <div className="bg-slate-50/80 rounded-2xl p-5 text-left text-[13px] text-slate-600 border border-slate-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 shadow-sm shadow-red-400/50" />
                    <span>Dilarang <strong>memotret, merekam, atau menyalin</strong> soal.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 shadow-sm shadow-red-400/50" />
                    <span>Dilarang <strong>menyebarluaskan</strong> soal ke publik/sosmed.</span>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-200/80 mt-4">
                    <p className="font-bold text-red-700 text-[10px] mb-1 uppercase tracking-wider">Sanksi Pidana & Denda:</p>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Pelanggaran UU Hak Cipta No. 28/2014 & UU ITE diancam pidana penjara 10 tahun dan denda <strong>Rp 4.000.000.000 (Empat Miliar)</strong>.
                    </p>
                  </div>
                </div>
             </div>
             
             <div className="px-8 pb-4">
                <label className="flex items-start gap-3 cursor-pointer group mb-2">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={checkAgreed} 
                      onChange={(e) => setCheckAgreed(e.target.checked)} 
                      className="peer w-5 h-5 appearance-none rounded-md border-2 border-slate-300 checked:bg-brand-600 checked:border-brand-600 transition-all cursor-pointer" 
                    />
                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium group-hover:text-slate-800 transition-colors leading-relaxed select-none">
                    Saya mengerti konsekuensi hukum di atas dan berjanji tidak akan membocorkan soal.
                  </span>
                </label>
             </div>
             
             <div className="p-4 px-6 pb-6 flex gap-3">
                <button 
                  onClick={() => router.push('/my-tryouts')}
                  className="w-1/3 px-4 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={() => { if(checkAgreed) setHasAgreed(true) }}
                  disabled={!checkAgreed}
                  className={`w-2/3 px-4 py-3.5 rounded-xl font-bold text-white transition-all text-sm flex items-center justify-center gap-2 ${
                    checkAgreed ? 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30' : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {checkAgreed ? 'Mulai Ujian' : 'Setujui Dulu'}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center font-sans">
        <p className="text-xl font-bold mb-4">Soal tidak ditemukan.</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-[#1e3a8a] text-white">
          Kembali
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isDoubtCurrent = !!doubts[currentQuestion.id];

  return (
    <div ref={containerRef} className="min-h-screen lg:h-screen flex flex-col bg-[#eef2f5] text-[#2d3748] font-[Arial,Helvetica,sans-serif] lg:overflow-hidden">
      
      {/* ─── HEADER BKN ─── */}
      <header className="bg-[#1e3a8a] text-white flex flex-col md:flex-row justify-between items-stretch shrink-0 border-b-[5px] border-[#fbbf24]">
        {/* Left Header */}
        <div className="flex items-center px-4 py-3 text-center md:text-left justify-center md:justify-start">
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-wide m-0 leading-tight">SISTEM COMPUTER ASSISTED TEST</h1>
            <p className="text-xs md:text-sm m-0 text-gray-200 uppercase tracking-widest">{tryout.title}</p>
          </div>
        </div>

        {/* Right Header: User Data (No Photo) - Hidden on Mobile */}
        <div className="hidden md:flex bg-[#1e40af] flex-col justify-center px-6 py-2 min-w-[250px] border-l border-[#2563eb]">
          <div className="text-xs text-[#93c5fd] uppercase mb-0.5 font-semibold">Data Peserta</div>
          <div className="font-bold text-sm tracking-wide uppercase truncate w-full">{user?.name}</div>
          <div className="text-xs text-gray-300 truncate w-full">{user?.email}</div>
        </div>
      </header>

      {/* ─── MAIN LAYOUT ─── */}
      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        
        {/* LEFT PANE: QUESTION & OPTIONS */}
        <div className="flex-1 flex flex-col bg-white border-r border-[#cbd5e1] lg:overflow-hidden">
          
          {/* Question Sub-header */}
          <div className="bg-[#f8fafc] border-b border-[#cbd5e1] flex items-center justify-between px-4 sm:px-6 py-3">
            <button 
              onClick={() => setIsPaletteOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#1e3a8a] text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm"
            >
              <Menu size={16} /> Daftar Soal
            </button>
            <div className="hidden lg:flex text-[#334155] font-bold text-sm sm:text-base items-center gap-2">
              Soal Nomor : <span className="bg-[#1e3a8a] text-white px-3 py-0.5 rounded text-base sm:text-lg">{currentIndex + 1}</span>
            </div>
            <div className="text-right">
              <span className="text-[#475569] text-[10px] sm:text-xs uppercase font-bold mr-2">Sisa Waktu :</span>
              <span className={`font-bold text-base sm:text-lg px-2 py-0.5 ${timeLeft < 300 ? 'text-white bg-red-600' : 'text-[#dc2626]'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 lg:overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
            <div className="text-base text-black mb-8 leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />

            {/* Options */}
            <div className="space-y-3 max-w-4xl">
              {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                const optionText = currentQuestion[`option_${opt.toLowerCase()}`];
                if (!optionText) return null;
                const isSelected = answers[currentQuestion.id] === opt;
                
                return (
                  <label key={opt} className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="radio" 
                      name={`q-${currentQuestion.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(currentQuestion.id, opt)}
                      className="mt-1 w-4 h-4 cursor-pointer"
                    />
                    <div className="ml-3 flex items-start flex-1">
                      <span className="font-bold mr-2">{opt}.</span>
                      <div className="text-base text-black" dangerouslySetInnerHTML={{ __html: optionText }} />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="bg-[#f1f5f9] border-t border-[#cbd5e1] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Prev */}
            {currentIndex > 0 ? (
              <button onClick={handlePrev} className="w-full sm:w-auto bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm tracking-wider shadow">
                SEBELUMNYA
              </button>
            ) : (
              <div className="hidden sm:block w-[180px]" /> // empty div for spacing on desktop
            )}

            {/* Ragu-Ragu */}
            <label className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer bg-[#fef3c7] border border-[#f59e0b] px-4 py-2.5 shadow-sm hover:bg-[#fde68a]">
              <input type="checkbox" checked={isDoubtCurrent} onChange={toggleDoubt} className="w-5 h-5 cursor-pointer accent-[#f59e0b]" />
              <span className="font-bold text-[#b45309] text-xs sm:text-sm tracking-wider">RAGU - RAGU</span>
            </label>

            {/* Next / Submit */}
            {currentIndex === questions.length - 1 ? (
              <button onClick={() => setShowSubmitModal(true)} className="w-full sm:w-auto bg-[#16a34a] hover:bg-[#15803d] text-white px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm tracking-wider shadow">
                SELESAI UJIAN
              </button>
            ) : (
              <button onClick={handleNext} className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm tracking-wider shadow">
                SELANJUTNYA
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANE: NUMBER PALETTE */}
        {/* Desktop Palette */}
        <div className="hidden lg:flex w-[300px] bg-white flex-col shrink-0 border-l border-[#cbd5e1] h-full">
          <div className="bg-[#1e3a8a] text-white font-bold px-4 py-3 text-center border-b-[5px] border-[#fbbf24] text-sm uppercase tracking-wider">
            Nomor Soal
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isDoubt = !!doubts[q.id];
                const isCurrent = idx === currentIndex;
                
                let boxClass = "border border-[#94a3b8] text-[#334155] bg-white"; // default unanswered
                
                if (isDoubt) {
                  boxClass = "border border-[#f59e0b] bg-[#f59e0b] text-white font-bold";
                } else if (isAnswered) {
                  boxClass = "border border-[#16a34a] bg-[#16a34a] text-white font-bold";
                }

                if (isCurrent) {
                  boxClass += " outline outline-2 outline-blue-600 outline-offset-1";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full aspect-square flex items-center justify-center text-sm shadow-sm hover:opacity-80 transition-opacity ${boxClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 bg-white border-t border-[#cbd5e1] text-xs text-[#334155] space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#16a34a] border border-[#16a34a]"></div>
              <span>Sudah Dijawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#f59e0b] border border-[#f59e0b]"></div>
              <span>Ragu - Ragu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-[#94a3b8]"></div>
              <span>Belum Dijawab</span>
            </div>
          </div>
        </div>

      </main>

      {/* ─── MODALS & MOBILE MENUBAR ─── */}

      {/* Mobile Palette Drawer */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60">
          <div className="w-[80%] max-w-[320px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="bg-[#1e3a8a] text-white font-bold px-4 py-3 flex items-center justify-between border-b-[5px] border-[#fbbf24]">
              <span className="text-sm uppercase tracking-wider">Navigasi Soal</span>
              <button onClick={() => setIsPaletteOpen(false)} className="p-1 hover:bg-[#1e40af] rounded">
                <X size={20} />
              </button>
            </div>

            <div className="bg-[#1e40af] px-4 py-3 text-white border-b border-[#2563eb]">
              <div className="text-[10px] text-[#93c5fd] uppercase mb-0.5 font-semibold">Data Peserta</div>
              <div className="font-bold text-xs tracking-wide uppercase truncate w-full">{user?.name}</div>
              <div className="text-[10px] text-gray-300 truncate w-full">{user?.email}</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isDoubt = !!doubts[q.id];
                  const isCurrent = idx === currentIndex;
                  
                  let boxClass = "border border-[#94a3b8] text-[#334155] bg-white";
                  
                  if (isDoubt) boxClass = "border border-[#f59e0b] bg-[#f59e0b] text-white font-bold";
                  else if (isAnswered) boxClass = "border border-[#16a34a] bg-[#16a34a] text-white font-bold";

                  if (isCurrent) boxClass += " outline outline-2 outline-blue-600 outline-offset-1";

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPaletteOpen(false);
                      }}
                      className={`w-full aspect-square flex items-center justify-center text-sm shadow-sm ${boxClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#cbd5e1] text-xs text-[#334155] space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#16a34a] border border-[#16a34a]"></div>
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f59e0b] border border-[#f59e0b]"></div>
                <span>Ragu - Ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-[#94a3b8]"></div>
                <span>Belum Dijawab</span>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsPaletteOpen(false)}></div>
        </div>
      )}
      
      {/* 5 Minute Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-600 max-w-sm w-full p-0 overflow-hidden shadow-2xl">
            <div className="bg-red-600 text-white font-bold px-4 py-2">Peringatan Sistem</div>
            <div className="p-6 text-center">
              <AlertTriangle size={48} className="text-red-600 mx-auto mb-4" />
              <p className="text-[#334155] font-bold mb-6">Waktu pengerjaan tersisa kurang dari 5 menit.</p>
              <button 
                onClick={() => setShowWarningModal(false)}
                className="bg-red-600 text-white font-bold px-8 py-2 hover:bg-red-700"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#1e3a8a] max-w-md w-full p-0 shadow-2xl">
            <div className="bg-[#1e3a8a] text-white font-bold px-4 py-2 flex justify-between items-center">
              <span>Konfirmasi Selesai Ujian</span>
              <button onClick={() => setShowSubmitModal(false)} className="hover:text-gray-300"><X size={18}/></button>
            </div>
            <div className="p-6">
              <p className="text-center font-bold text-[#334155] mb-4">Apakah Anda yakin ingin mengakhiri ujian ini?</p>
              
              <div className="bg-gray-100 p-4 border border-gray-300 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Soal Terjawab:</span>
                  <span className="font-bold text-green-700">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Soal Ragu-ragu:</span>
                  <span className="font-bold text-yellow-700">{Object.values(doubts).filter(Boolean).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Belum Terjawab:</span>
                  <span className="font-bold text-red-600">{questions.length - answeredCount}</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 shadow"
                >
                  TIDAK
                </button>
                <button 
                  onClick={executeSubmit}
                  disabled={submitting}
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-6 py-2 flex items-center gap-2 shadow disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  YA, AKHIRI UJIAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
