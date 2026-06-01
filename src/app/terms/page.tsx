import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan | Taktik Ujian",
  description: "Syarat dan Ketentuan layanan platform Taktik Ujian.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="p-3 bg-brand-100 text-brand-600 rounded-xl">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Syarat & Ketentuan</h1>
              <p className="text-slate-500 mt-1">Terakhir diperbarui: 31 Mei 2026</p>
            </div>
          </div>

          <div className="prose prose-slate prose-brand max-w-none prose-headings:font-black prose-h2:text-2xl prose-p:text-slate-600 prose-li:text-slate-600">
            <h2>1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses dan menggunakan platform <strong>Taktik Ujian</strong>, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan, maka Anda tidak diizinkan untuk mengakses layanan kami.
            </p>

            <h2>2. Pendaftaran Akun</h2>
            <ul>
              <li>Anda harus memberikan informasi yang akurat, lengkap, dan terkini saat mendaftar.</li>
              <li>Satu pengguna hanya diperbolehkan memiliki satu akun. Pembuatan banyak akun untuk manipulasi akan berakibat pada penangguhan permanen.</li>
              <li>Anda bertanggung jawab menjaga kerahasiaan kata sandi Anda.</li>
            </ul>

            <h2>3. Penggunaan Platform</h2>
            <p>
              Konten soal, pembahasan, dan seluruh metrik algoritma di dalam platform Taktik Ujian dilindungi oleh Hak Kekayaan Intelektual. Anda dilarang keras untuk:
            </p>
            <ul>
              <li>Menyalin, mendistribusikan, atau membagikan soal-soal kepada pihak ketiga baik secara gratis maupun berbayar.</li>
              <li>Melakukan <em>scraping</em>, eksploitasi, atau peretasan ke server kami.</li>
              <li>Berbagi akun premium dengan pengguna lain.</li>
            </ul>

            <h2>4. Pengembalian Dana</h2>
            <p>
              Pembelian paket premium (jika ada) bersifat final. Kami tidak melayani pengembalian dana kecuali terbukti ada kesalahan teknis dari sisi server kami yang mengakibatkan layanan sama sekali tidak bisa diakses selama 3x24 jam berturut-turut.
            </p>

            <h2>5. Perubahan Layanan</h2>
            <p>
              Taktik Ujian berhak setiap saat untuk memodifikasi atau menghentikan (sementara atau permanen) Layanan (atau bagian mana pun darinya) dengan atau tanpa pemberitahuan.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
