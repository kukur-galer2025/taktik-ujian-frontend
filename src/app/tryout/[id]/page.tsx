"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, Clock, ChevronLeft, ChevronRight, CheckCircle2, 
  Flag, Maximize, Minimize, AlertTriangle, AlertCircle, X
} from "lucide-react";
import axios from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function TryoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tryout, setTryout] = useState<any>(null);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doubts, setDoubts] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningShown, setWarningShown] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchTryout = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`/api/tryouts/${id}`);
        setTryout(res.data);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.duration_minutes * 60);

        const savedAnswers = localStorage.getItem(`tryout_answers_${id}`);
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

        const savedDoubts = localStorage.getItem(`tryout_doubts_${id}`);
        if (savedDoubts) setDoubts(JSON.parse(savedDoubts));
      } catch (err) {
        console.error(err);
        alert("Gagal memuat ujian. Silakan coba lagi.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTryout();
  }, [id, router]);

  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { 
          clearInterval(timerId); 
          executeSubmit(); 
          return 0; 
        }
        // Show warning when exactly 5 minutes left
        if (prev === 300 && !warningShown) {
          setShowWarningModal(true);
          setWarningShown(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [loading, timeLeft, warningShown]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`tryout_answers_${id}`, JSON.stringify(answers));
    }
  }, [answers, id]);

  useEffect(() => {
    localStorage.setItem(`tryout_doubts_${id}`, JSON.stringify(doubts));
  }, [doubts, id]);

  // Fullscreen listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleAnswerSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const toggleDoubt = (questionId: number) => {
    setDoubts((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
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
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      router.push(`/tryout/${id}/result?resultId=${response.data.result.id}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan jawaban.");
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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-500 mb-4" size={48} />
        <p className="text-slate-400 font-medium">Mempersiapkan Ujian CBT...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <p className="text-slate-600 font-bold mb-4">Soal tidak ditemukan untuk ujian ini.</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const doubtCount = Object.values(doubts).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;
  const isUrgent = timeLeft < 300;

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">
      
      {/* ─── HEADER ─── */}
      <header className="bg-slate-900 text-white shrink-0 shadow-md relative z-20">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h1 className="font-black text-sm uppercase tracking-wider">{tryout?.title}</h1>
                <p className="text-slate-400 text-xs">Simulasi Computer Assisted Test</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800 border-slate-700'
            }`}>
              <Clock className={isUrgent ? "text-red-500 animate-pulse" : "text-brand-400"} size={18} />
              <span className={`font-mono text-xl font-black tracking-widest ${isUrgent ? "text-red-400" : "text-white"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <button 
              onClick={() => setShowSubmitModal(true)}
              disabled={submitting}
              className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              <span className="hidden sm:inline">Selesai Ujian</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT PANE: QUESTION AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Question Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner">
                    {currentIndex + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Soal Ke-{currentIndex + 1} dari {questions.length}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md font-black text-[10px] text-white uppercase tracking-wider ${
                        currentQuestion.type === 'TWK' ? 'bg-red-500' :
                        currentQuestion.type === 'TIU' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}>
                        {currentQuestion.type}
                      </span>
                      {currentQuestion.sub_category && (
                        <span className="text-xs font-bold text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                          {currentQuestion.sub_category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleDoubt(currentQuestion.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                    doubts[currentQuestion.id]
                      ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Flag size={16} className={doubts[currentQuestion.id] ? 'fill-amber-400' : ''} />
                  Ragu-Ragu
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* Question Text */}
                <div 
                  className="prose prose-slate prose-lg max-w-none mb-10 text-slate-800"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
                />

                {/* Options */}
                <div className="space-y-4">
                  {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                    const optionText = currentQuestion[`option_${opt.toLowerCase()}`];
                    if (!optionText) return null;
                    const isSelected = answers[currentQuestion.id] === opt;
                    
                    return (
                      <label 
                        key={opt}
                        className={`flex items-start p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                          isSelected 
                            ? 'border-brand-500 bg-brand-50/50 shadow-sm' 
                            : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center h-6 mt-0.5">
                          <input 
                            type="radio" 
                            name={`question-${currentQuestion.id}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(currentQuestion.id, opt)}
                            className="w-5 h-5 text-brand-600 border-slate-300 focus:ring-brand-500 focus:ring-offset-2"
                          />
                        </div>
                        <div className="ml-4 flex-1 flex">
                          <span className={`font-black text-lg mr-3 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`}>{opt}.</span>
                          <div 
                            className="prose prose-slate max-w-none text-slate-700 text-base flex-1 pt-0.5" 
                            dangerouslySetInnerHTML={{ __html: optionText }} 
                          />
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Navigation */}
            <div className="mt-6 flex justify-between gap-4">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                <ChevronLeft size={20} /> <span className="hidden sm:inline">Soal Sebelumnya</span>
              </button>
              
              {currentIndex === questions.length - 1 ? (
                <button 
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/30"
                >
                  Akhiri Ujian <CheckCircle2 size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  <span className="hidden sm:inline">Soal Selanjutnya</span> <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: QUESTION NAVIGATOR (Always visible on desktop, scrollable) */}
        <div className="lg:w-[340px] shrink-0 bg-white border-l border-slate-200 flex flex-col h-64 lg:h-auto z-10">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">Navigasi Soal</h3>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{answeredCount}/{questions.length} Dijawab</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isDoubt = !!doubts[q.id];
                const isCurrent = idx === currentIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`
                      w-full aspect-square rounded-xl font-bold text-sm flex items-center justify-center transition-all relative overflow-hidden
                      ${isCurrent ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
                      ${isDoubt
                        ? 'bg-amber-400 text-white shadow-sm'
                        : isAnswered
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'bg-white border-2 border-slate-200 text-slate-500 hover:border-slate-300'
                      }
                    `}
                  >
                    {idx + 1}
                    {isDoubt && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-amber-600 border-l-[16px] border-l-transparent"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-medium text-slate-600 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-md bg-emerald-500 shadow-sm shrink-0"></div>
              <span>Sudah Dijawab ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-md bg-amber-400 shadow-sm shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[8px] border-t-amber-600 border-l-[8px] border-l-transparent"></div>
              </div>
              <span>Ragu-Ragu ({doubtCount})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-md bg-white border-2 border-slate-200 shrink-0"></div>
              <span>Belum Dijawab ({unansweredCount})</span>
            </div>
          </div>
        </div>

      </main>

      {/* ─── MODALS ─── */}
      <AnimatePresence>
        {/* 5 Minute Warning Modal */}
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-red-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Waktu Hampir Habis!</h2>
              <p className="text-slate-600 mb-8 font-medium">Waktu Anda tersisa kurang dari 5 menit. Segera periksa kembali jawaban yang masih ragu-ragu.</p>
              <button 
                onClick={() => setShowWarningModal(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-red-500/30"
              >
                Saya Mengerti
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600">
                  <CheckCircle2 size={32} />
                </div>
                <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2">Akhiri Ujian?</h2>
              <p className="text-slate-600 mb-6 font-medium">Pastikan semua soal telah terjawab. Ujian yang sudah diakhiri tidak dapat diulang kembali.</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Terjawab</span>
                  <span className="font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg">{answeredCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Ragu-ragu</span>
                  <span className="font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-lg">{doubtCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Belum Terjawab</span>
                  <span className="font-black text-red-600 bg-red-100 px-3 py-1 rounded-lg">{unansweredCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-colors"
                >
                  Cek Kembali
                </button>
                <button 
                  onClick={executeSubmit}
                  disabled={submitting}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : "Ya, Akhiri"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
