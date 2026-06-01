import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const metadata = {
  title: "Hubungi Kami | Taktik Ujian",
  description: "Kontak dukungan teknis dan layanan pelanggan platform Taktik Ujian.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Hubungi Tim Taktik Ujian</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Punya pertanyaan seputar platform, kendala teknis, atau penawaran kerja sama? Jangan ragu untuk menghubungi kami melalui kanal di bawah ini.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-start gap-6 hover:border-brand-300 hover:shadow-md transition-all">
                <div className="bg-brand-50 text-brand-600 p-4 rounded-2xl shrink-0">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Email Dukungan</h3>
                  <p className="text-slate-500 mb-2">Untuk bantuan teknis, pembayaran, atau pertanyaan umum terkait akun.</p>
                  <a href="mailto:support@TaktikUjian.com" className="font-bold text-brand-600 hover:text-brand-700">support@TaktikUjian.com</a>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-start gap-6 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl shrink-0">
                  <Phone size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">WhatsApp Admin</h3>
                  <p className="text-slate-500 mb-2">Pesan teks saja (Senin - Jumat, 08:00 - 17:00 WIB).</p>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="font-bold text-emerald-600 hover:text-emerald-700">+62 812 3456 7890</a>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-start gap-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl shrink-0">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Kantor Kami</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Jl. Jendral Sudirman No. 123,<br/>
                    Gedung Inovasi Lantai 4,<br/>
                    Jakarta Pusat, 10220, Indonesia.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Kirim Pesan Langsung</h3>
              <form className="space-y-6" action="#" method="POST">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Aktif</label>
                    <input 
                      type="email" 
                      placeholder="Masukkan email"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subjek Pesan</label>
                  <input 
                    type="text" 
                    placeholder="Apa yang bisa kami bantu?"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Isi Pesan</label>
                  <textarea 
                    rows={5}
                    placeholder="Ceritakan detail pertanyaan atau masalah Anda..."
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-500 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="button" 
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Kirim Pesan Sekarang
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
