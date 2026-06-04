"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trophy, Medal, ArrowLeft, Clock, Target, CheckCircle2 } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Toast } from '@/lib/sweetalert';

export default function LeaderboardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tryout, setTryout] = useState<any>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Fetch tryout details
        const tryoutRes = await axios.get(`/api/tryouts/${id}`);
        setTryout(tryoutRes.data);

        // Fetch leaderboard
        const leaderRes = await axios.get(`/api/tryouts/${id}/leaderboard`);
        setLeaderboard(leaderRes.data);
      } catch (err) {
        console.error(err);
        Toast.fire({ icon: 'error', title: 'Gagal memuat leaderboard' });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Menganalisis jutaan data peringkat...</p>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-bold"
          >
            <ArrowLeft size={20} /> Kembali ke Dashboard
          </Link>
        </div>

        {/* Title Banner */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white mb-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <Trophy size={200} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-brand-500/20 text-brand-400 flex items-center justify-center rounded-2xl mb-6 backdrop-blur-sm border border-brand-500/30">
              <Trophy size={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600">
              Peringkat Nasional
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
              Tryout: <span className="text-white font-bold">{tryout?.title}</span>
            </p>
          </div>
        </div>

        {/* Podium Top 3 */}
        {topThree.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-end gap-4 sm:gap-6 mb-16 px-4">
            {/* Rank 2 (Silver) */}
            {topThree[1] && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full sm:w-1/3 flex flex-col items-center order-2 sm:order-1">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-300 bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-700 shadow-lg z-10 relative">
                    {topThree[1].user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-slate-300 rounded-full p-1.5 shadow-md">
                    <Medal className="text-slate-600 fill-slate-300" size={24} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-2 bg-slate-300"></div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{topThree[1].user?.name}</h3>
                  <div className="text-3xl font-black text-slate-800 tracking-tighter mb-4">{topThree[1].total_score}</div>
                  <div className="flex flex-col gap-1 text-xs text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between"><span>TWK:</span><span className="text-slate-700">{topThree[1].score_twk}</span></div>
                    <div className="flex justify-between"><span>TIU:</span><span className="text-slate-700">{topThree[1].score_tiu}</span></div>
                    <div className="flex justify-between"><span>TKP:</span><span className="text-slate-700">{topThree[1].score_tkp}</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rank 1 (Gold) */}
            {topThree[0] && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full sm:w-1/3 flex flex-col items-center order-1 sm:order-2 z-10 sm:-mb-8">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full border-4 border-yellow-400 bg-yellow-50 flex items-center justify-center text-4xl font-black text-yellow-600 shadow-xl shadow-yellow-500/30 z-10 relative">
                    {topThree[0].user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-full p-2 shadow-lg ring-4 ring-white">
                    <Trophy className="text-yellow-900 fill-yellow-500" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-yellow-200 w-full text-center relative overflow-hidden ring-4 ring-yellow-500/10">
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500"></div>
                  <h3 className="font-black text-xl text-slate-900 mb-1 truncate">{topThree[0].user?.name}</h3>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 tracking-tighter mb-4">{topThree[0].total_score}</div>
                  <div className="flex flex-col gap-1.5 text-xs text-yellow-800 font-bold bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <div className="flex justify-between"><span>TWK:</span><span className="text-yellow-900 text-sm">{topThree[0].score_twk}</span></div>
                    <div className="flex justify-between"><span>TIU:</span><span className="text-yellow-900 text-sm">{topThree[0].score_tiu}</span></div>
                    <div className="flex justify-between"><span>TKP:</span><span className="text-yellow-900 text-sm">{topThree[0].score_tkp}</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rank 3 (Bronze) */}
            {topThree[2] && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full sm:w-1/3 flex flex-col items-center order-3">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-amber-600 bg-amber-50 flex items-center justify-center text-2xl font-black text-amber-700 shadow-lg z-10 relative">
                    {topThree[2].user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-amber-600 rounded-full p-1.5 shadow-md">
                    <Medal className="text-white fill-amber-500" size={24} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-2 bg-amber-600"></div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{topThree[2].user?.name}</h3>
                  <div className="text-3xl font-black text-slate-800 tracking-tighter mb-4">{topThree[2].total_score}</div>
                  <div className="flex flex-col gap-1 text-xs text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between"><span>TWK:</span><span className="text-slate-700">{topThree[2].score_twk}</span></div>
                    <div className="flex justify-between"><span>TIU:</span><span className="text-slate-700">{topThree[2].score_tiu}</span></div>
                    <div className="flex justify-between"><span>TKP:</span><span className="text-slate-700">{topThree[2].score_tkp}</span></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* The Rest of the Leaderboard Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-5 w-16 text-center">Rank</th>
                  <th className="px-6 py-5">Peserta</th>
                  <th className="px-6 py-5 text-center">TWK</th>
                  <th className="px-6 py-5 text-center">TIU</th>
                  <th className="px-6 py-5 text-center">TKP</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Waktu</th>
                  <th className="px-6 py-5 text-right text-brand-600">Total Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {restOfLeaderboard.map((res, index) => {
                  const rank = index + 4;
                  return (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-center font-bold text-slate-400">
                        #{rank}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {res.user?.name}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600">{res.score_twk}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600">{res.score_tiu}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600">{res.score_tkp}</td>
                      <td className="px-6 py-4 text-center">
                        {res.is_passed ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">
                            LULUS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">
                            GAGAL
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-500 text-sm">
                        {res.time_taken_minutes} mnt
                      </td>
                      <td className="px-6 py-4 text-right font-black text-xl text-slate-900">
                        {res.total_score}
                      </td>
                    </tr>
                  )
                })}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                      Belum ada peserta yang menyelesaikan tryout ini. Jadilah yang pertama!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
