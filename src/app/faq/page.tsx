import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";

export const metadata = {
  title: "Pusat Bantuan (FAQ) | Taktik Ujian",
  description: "Pertanyaan yang sering diajukan mengenai platform Taktik Ujian.",
};

const faqs = [
  {
    q: "Apa itu Taktik Ujian?",
    a: "Taktik Ujian adalah platform tryout online terpercaya yang dirancang khusus untuk membantu pejuang CPNS dan Sekolah Kedinasan dalam mempersiapkan diri menghadapi ujian berbasis Computer Assisted Test (CAT)."
  },
  {
    q: "Bagaimana cara mendaftar akun?",
    a: "Anda bisa mendaftar dengan menekan tombol 'Mulai Sekarang' di halaman utama, kemudian isi nama, email, nomor handphone, dan password."
  },
  {
    q: "Apakah soal tryout selalu di-update?",
    a: "Tentu saja! Kami bekerja sama dengan para ahli dan secara berkala memperbarui bank soal kami sesuai dengan kisi-kisi dan FR (Field Report) tes CPNS dan Kedinasan terbaru."
  },
  {
    q: "Bagaimana sistem penilaian tryout di Taktik Ujian?",
    a: "Sistem penilaian kami persis meniru standar BKN terbaru. TWK bernilai 0 jika salah, 5 jika benar. TIU bernilai 0 jika salah, 5 jika benar. Dan TKP bernilai 1 hingga 5 tergantung kedekatan jawaban."
  },
  {
    q: "Apakah saya bisa melihat pembahasan setelah tryout selesai?",
    a: "Ya, setelah Anda menyelesaikan tryout, Anda akan langsung mendapatkan skor (lulus/tidak lulus), rapor, dan tombol untuk melihat pembahasan detail dari setiap soal."
  }
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-full mb-4 text-brand-600">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Pertanyaan Seputar Taktik Ujian</h1>
            <p className="text-slate-500 text-lg">Temukan jawaban untuk pertanyaan yang paling sering ditanyakan oleh peserta lain.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 hover:text-brand-600 transition-colors">
                  {faq.q}
                  <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
