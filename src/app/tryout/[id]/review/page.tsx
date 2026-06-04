"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, X, Menu, ArrowRight } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Toast } from '@/lib/sweetalert';

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);
  const resultId = searchParams.get("resultId");
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mobile palette state
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      if (!resultId) {
        router.push("/dashboard");
        return;
      }

      try {
        const res = await axios.get(`/api/results/${resultId}/review`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        Toast.fire({ icon: 'error', title: 'Gagal memuat pembahasan ujian.' });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [resultId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <Loader2 className="animate-spin text-[#1e3a8a]" size={48} />
      </div>
    );
  }

  if (!data) return null;

  const { tryout, user_answers } = data;
  const questions = tryout.questions;
  const currentQuestion = questions[currentIndex];
  const userAnswer = user_answers ? user_answers[currentQuestion.id] : null;

  // Find max score possible for this question
  const maxScore = Math.max(
    currentQuestion.score_a,
    currentQuestion.score_b,
    currentQuestion.score_c,
    currentQuestion.score_d,
    currentQuestion.score_e
  );

  const userScore = userAnswer ? currentQuestion[`score_${userAnswer.toLowerCase()}`] : 0;
  const isTkp = currentQuestion.type === "TKP";
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#eef2f5] text-[#2d3748] font-[Arial,Helvetica,sans-serif] lg:overflow-hidden">
      
      {/* ─── HEADER BKN (Adapted for Pembahasan) ─── */}
      <header className="bg-[#1e3a8a] text-white flex flex-col md:flex-row justify-between items-stretch shrink-0 border-b-[5px] border-[#fbbf24]">
        <div className="flex items-center px-4 py-3 gap-4 justify-center md:justify-start text-center md:text-left">
          <Link 
            href={`/tryout/${id}/result?resultId=${resultId}`}
            className="p-1 hover:bg-[#1e40af] transition-colors border border-[#1e40af]"
            title="Kembali ke Halaman Hasil"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-wide m-0 leading-tight">PEMBAHASAN COMPUTER ASSISTED TEST</h1>
            <p className="text-xs md:text-sm m-0 text-gray-200 uppercase tracking-widest">{tryout.title}</p>
          </div>
        </div>

        <div className="hidden md:flex bg-[#1e40af] flex-col justify-center px-6 py-2 min-w-[250px] border-l border-[#2563eb]">
          <div className="text-xs text-[#93c5fd] uppercase mb-0.5 font-semibold">Data Peserta</div>
          <div className="font-bold text-sm tracking-wide uppercase truncate w-full">{user?.name}</div>
          <div className="text-xs text-gray-300 truncate w-full">{user?.email}</div>
        </div>
      </header>

      {/* ─── MAIN LAYOUT ─── */}
      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        
        {/* LEFT PANE: QUESTION, OPTIONS & REVIEW */}
        <div className="flex-1 flex flex-col bg-white border-r border-[#cbd5e1] lg:overflow-hidden relative">
          
          <div className="bg-[#f8fafc] border-b border-[#cbd5e1] flex items-center justify-between px-4 sm:px-6 py-3">
            <button 
              onClick={() => setIsPaletteOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#1e3a8a] text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm"
            >
              <Menu size={16} /> Daftar Soal
            </button>
            <div className="hidden lg:flex text-[#334155] font-bold text-sm sm:text-base items-center gap-2">
              Pembahasan Soal Nomor : <span className="bg-[#1e3a8a] text-white px-3 py-0.5 rounded text-base sm:text-lg">{currentIndex + 1}</span>
              <span className="ml-2 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-bold">({currentQuestion.type})</span>
            </div>
            <div className="text-right flex items-center gap-4">
              <div>
                <span className="text-[#475569] text-[10px] sm:text-xs uppercase font-bold mr-2">Poin Didapat :</span>
                <span className={`font-bold text-base sm:text-lg px-2 py-0.5 text-white ${userScore > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                  +{userScore}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
            <div className="text-base text-black mb-8 leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />

            {/* Options */}
            <div className="space-y-3 max-w-4xl mb-10">
              {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                const optionText = currentQuestion[`option_${opt.toLowerCase()}`];
                if (!optionText) return null;
                
                const isUserChoice = userAnswer === opt;
                const optScore = currentQuestion[`score_${opt.toLowerCase()}`];
                const isCorrectChoice = optScore === maxScore;
                
                let rowBg = "hover:bg-gray-50";
                let optIndicator = null;
                let borderStyle = "border border-transparent";
                
                if (isCorrectChoice) {
                  rowBg = "bg-green-50";
                  borderStyle = "border border-green-300";
                  optIndicator = <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">Kunci Jawaban (Poin {optScore})</span>;
                } else if (isUserChoice && !isCorrectChoice) {
                  rowBg = "bg-red-50";
                  borderStyle = "border border-red-300";
                  optIndicator = <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded">Jawaban Anda (Poin {optScore})</span>;
                } else if (isTkp) {
                  optIndicator = <span className="ml-2 text-xs text-gray-400 font-bold">(Poin {optScore})</span>;
                }
                
                return (
                  <div key={opt} className={`flex items-start p-3 ${rowBg} ${borderStyle} transition-colors`}>
                    <div className="w-5 h-5 flex items-center justify-center mt-1">
                      {isUserChoice ? (
                        <div className="w-3 h-3 rounded-full bg-black"></div>
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-400"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-start">
                        <span className="font-bold mr-2">{opt}.</span>
                        <div className="text-base text-black flex-1" dangerouslySetInnerHTML={{ __html: optionText }} />
                      </div>
                      {optIndicator && <div className="mt-1 ml-5">{optIndicator}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Box */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] p-6 mb-8 max-w-4xl">
              <h3 className="font-bold text-[#1e40af] uppercase tracking-wider mb-3 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1e40af] block"></span> Pembahasan Resmi
              </h3>
              {currentQuestion.explanation ? (
                <div className="text-black leading-relaxed" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
              ) : (
                <p className="text-gray-500 italic">Tidak ada pembahasan khusus untuk soal ini.</p>
              )}
            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="bg-[#f1f5f9] border-t border-[#cbd5e1] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {currentIndex > 0 ? (
              <button onClick={handlePrev} className="w-full sm:w-auto bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm tracking-wider shadow">
                SEBELUMNYA
              </button>
            ) : (
              <div className="hidden sm:block" /> 
            )}

            {currentIndex < questions.length - 1 ? (
              <button onClick={handleNext} className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm tracking-wider shadow">
                SELANJUTNYA
              </button>
            ) : (
              <Link href={`/tryout/${id}/result?resultId=${resultId}`} className="w-full sm:w-auto bg-[#16a34a] hover:bg-[#15803d] text-white px-4 sm:px-6 py-2.5 font-bold text-xs sm:text-sm tracking-wider shadow flex items-center justify-center">
                SELESAI
              </Link>
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
              {questions.map((q: any, idx: number) => {
                const uAns = user_answers ? user_answers[q.id] : null;
                const mScore = Math.max(q.score_a, q.score_b, q.score_c, q.score_d, q.score_e);
                const uScore = uAns ? q[`score_${uAns.toLowerCase()}`] : 0;
                
                const isCurrent = idx === currentIndex;
                
                let boxClass = "border border-[#94a3b8] bg-white text-[#334155]";
                
                if (uAns) {
                  if (uScore === mScore) boxClass = "border border-green-600 bg-green-600 text-white font-bold";
                  else boxClass = "border border-red-600 bg-red-600 text-white font-bold";
                }

                if (isCurrent) boxClass += " outline outline-2 outline-blue-600 outline-offset-1";

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

          <div className="p-4 bg-white border-t border-[#cbd5e1] text-xs text-[#334155] space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 border border-green-600"></div>
              <span>Benar / Poin Maksimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 border border-red-600"></div>
              <span>Salah / Poin Nol</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-[#94a3b8]"></div>
              <span>Tidak Dijawab</span>
            </div>
          </div>
        </div>

      </main>

      {/* ─── MOBILE MENUBAR ─── */}
      {isPaletteOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60">
          <div className="w-[80%] max-w-[320px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left">
            <div className="bg-[#1e3a8a] text-white font-bold px-4 py-3 flex items-center justify-between border-b-[5px] border-[#fbbf24]">
              <span className="text-sm uppercase tracking-wider">Daftar Soal</span>
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
                {questions.map((q: any, idx: number) => {
                  const uAns = user_answers ? user_answers[q.id] : null;
                  const mScore = Math.max(q.score_a, q.score_b, q.score_c, q.score_d, q.score_e);
                  const uScore = uAns ? q[`score_${uAns.toLowerCase()}`] : 0;
                  
                  const isCurrent = idx === currentIndex;
                  
                  let boxClass = "border border-[#94a3b8] bg-white text-[#334155]";
                  
                  if (uAns) {
                    if (uScore === mScore) boxClass = "border border-green-600 bg-green-600 text-white font-bold";
                    else boxClass = "border border-red-600 bg-red-600 text-white font-bold";
                  }

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
                <div className="w-4 h-4 bg-green-600 border border-green-600"></div>
                <span>Benar / Poin Maksimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 border border-red-600"></div>
                <span>Salah / Poin Nol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-[#94a3b8]"></div>
                <span>Tidak Dijawab</span>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsPaletteOpen(false)}></div>
        </div>
      )}
    </div>
  );
}
