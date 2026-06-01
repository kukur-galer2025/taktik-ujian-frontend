"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Info, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);
  const resultId = searchParams.get("resultId");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReview = async () => {
      if (!resultId) {
        router.push("/dashboard");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`/api/results/${resultId}/review`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat pembahasan ujian.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [resultId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Membuka lembar pembahasan...</p>
      </div>
    );
  }

  if (!data) return null;

  const { tryout, user_answers } = data;
  const questions = tryout.questions;
  const currentQuestion = questions[currentIndex];
  const userAnswer = user_answers ? user_answers[currentQuestion.id] : null;

  // Determine if user got it fully correct (max points)
  // Find the max score possible for this question
  const maxScore = Math.max(
    currentQuestion.score_a,
    currentQuestion.score_b,
    currentQuestion.score_c,
    currentQuestion.score_d,
    currentQuestion.score_e
  );

  const userScore = userAnswer ? currentQuestion[`score_${userAnswer.toLowerCase()}`] : 0;
  const isCorrect = userScore === maxScore;
  const isTkp = currentQuestion.type === "TKP";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href={`/tryout/${id}/result?resultId=${resultId}`}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="text-slate-600" />
            </Link>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">Pembahasan Soal</h1>
              <p className="text-brand-600 text-sm font-medium">{tryout.title}</p>
            </div>
          </div>
          
          <Link 
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Question & Explanation */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-lg font-bold text-sm">
                Soal Ke-{currentIndex + 1}
              </div>
              <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg font-bold text-sm uppercase">
                Materi: {currentQuestion.type}
              </div>
            </div>

            <div 
              className="prose prose-slate prose-lg max-w-none mb-8 font-medium text-slate-800"
              dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
            />

            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                const optionText = currentQuestion[`option_${opt.toLowerCase()}`];
                const optionScore = currentQuestion[`score_${opt.toLowerCase()}`];
                
                if (!optionText) return null;
                
                const isSelected = userAnswer === opt;
                const isMaxScore = optionScore === maxScore;

                // Determine styling based on whether it's the correct answer or user's answer
                let borderStyle = "border-slate-100 bg-slate-50";
                let icon = null;

                if (isMaxScore && !isTkp) {
                  borderStyle = "border-emerald-500 bg-emerald-50";
                  icon = <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />;
                } else if (isSelected && !isMaxScore && !isTkp) {
                  borderStyle = "border-red-500 bg-red-50";
                  icon = <XCircle className="text-red-500 shrink-0" size={20} />;
                } else if (isSelected && isTkp) {
                  borderStyle = "border-brand-500 bg-brand-50";
                  icon = <CheckCircle2 className="text-brand-500 shrink-0" size={20} />;
                }

                return (
                  <div 
                    key={opt}
                    className={`flex items-start justify-between p-4 rounded-xl border-2 ${borderStyle}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`font-bold mt-0.5 ${isMaxScore && !isTkp ? 'text-emerald-700' : isSelected && !isMaxScore && !isTkp ? 'text-red-700' : 'text-slate-900'}`}>
                        {opt}.
                      </div>
                      <div 
                        className="prose prose-slate max-w-none text-slate-700 flex-1"
                        dangerouslySetInnerHTML={{ __html: optionText }} 
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {isTkp && (
                        <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                          Poin: {optionScore}
                        </span>
                      )}
                      {!isTkp && isSelected && userScore !== maxScore && (
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Jawaban Anda</span>
                      )}
                      {!isTkp && isSelected && userScore === maxScore && (
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Jawaban Anda Benar</span>
                      )}
                      {icon}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Explanation Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={`explanation-${currentQuestion.id}`}
            className="bg-brand-900 rounded-2xl shadow-lg border border-brand-800 p-6 sm:p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen size={120} />
            </div>

            <div className="relative z-10">
              <h3 className="flex items-center gap-2 text-brand-300 font-bold mb-4 uppercase tracking-wider text-sm">
                <Info size={18} /> Pembahasan Resmi
              </h3>
              
              <div 
                className="prose prose-invert prose-lg max-w-none text-brand-50" 
                dangerouslySetInnerHTML={{ __html: currentQuestion.explanation || "Pembahasan untuk soal ini belum tersedia." }}
              />

              {!isTkp && (
                <div className="mt-6 pt-6 border-t border-brand-800 flex items-center gap-2 text-sm font-medium">
                  <span className="text-brand-300">Kunci Jawaban:</span> 
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-md font-bold">
                    {['A', 'B', 'C', 'D', 'E'].find(opt => currentQuestion[`score_${opt.toLowerCase()}`] === maxScore)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
              Sebelumnya
            </button>
            
            <button 
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-md shadow-brand-200"
            >
              Selanjutnya
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

        {/* Right Column: Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4">Navigasi Pembahasan</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q: any, idx: number) => {
                const uAnswer = user_answers ? user_answers[q.id] : null;
                const mScore = Math.max(q.score_a, q.score_b, q.score_c, q.score_d, q.score_e);
                const uScore = uAnswer ? q[`score_${uAnswer.toLowerCase()}`] : 0;
                
                const isCurrent = idx === currentIndex;
                const isCorrect = uScore === mScore;
                const isTKP = q.type === "TKP";
                
                // Color logic for navigator
                let bgColor = "bg-slate-100 text-slate-400"; // Unanswered
                
                if (uAnswer) {
                  if (isTKP) {
                    bgColor = "bg-blue-100 text-blue-700 border-blue-200";
                  } else if (isCorrect) {
                    bgColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
                  } else {
                    bgColor = "bg-red-100 text-red-700 border-red-200";
                  }
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`
                      w-full aspect-square rounded-lg font-bold text-sm flex items-center justify-center transition-all border
                      ${isCurrent ? 'ring-2 ring-brand-500 ring-offset-2 scale-110 shadow-md' : 'hover:scale-105'}
                      ${bgColor}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div>
                Benar (TWK/TIU)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                Salah (TWK/TIU)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
                Dijawab (TKP)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200"></div>
                Kosong
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
