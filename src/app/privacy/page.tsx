import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi | Taktik Ujian",
  description: "Kebijakan privasi dan perlindungan data platform Taktik Ujian.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kebijakan Privasi</h1>
              <p className="text-slate-500 mt-1">Terakhir diperbarui: 31 Mei 2026</p>
            </div>
          </div>

          <div className="prose prose-slate prose-brand max-w-none prose-headings:font-black prose-h2:text-2xl prose-p:text-slate-600 prose-li:text-slate-600">
            <p>
              Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana <strong>Taktik Ujian</strong> ("kami", "milik kami") mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami.
            </p>

            <h2>1. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan beberapa jenis informasi untuk memberikan layanan terbaik:</p>
            <ul>
              <li><strong>Informasi Identifikasi Pribadi:</strong> Nama, alamat email, dan nomor handphone saat registrasi.</li>
              <li><strong>Data Penggunaan:</strong> Skor tryout, waktu pengerjaan, histori ulasan, dan metrik analitik kemampuan Anda.</li>
              <li><strong>Informasi Perangkat:</strong> Jenis browser, alamat IP, dan waktu akses untuk keperluan keamanan.</li>
            </ul>

            <h2>2. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
              <li>Membuat, mengelola, dan mempersonalisasi akun Anda.</li>
              <li>Menganalisis perkembangan skor dan memberikan rekomendasi belajar.</li>
              <li>Menghubungi Anda terkait pembaruan layanan, informasi pembayaran, atau pemberitahuan penting (seperti pembukaan seleksi CPNS).</li>
              <li>Menampilkan peringkat (Leaderboard) secara nasional (nama akan disamarkan jika diatur demikian dalam pengaturan).</li>
            </ul>

            <h2>3. Keamanan Data</h2>
            <p>
              Kami menerapkan standar keamanan industri yang ketat, termasuk enkripsi (seperti _bcrypt_ untuk kata sandi) dan perlindungan _database_ agar data Anda tidak diakses oleh pihak yang tidak berwenang. Kami <strong>tidak pernah menjual</strong> data Anda kepada pihak ketiga manapun (seperti _marketing agency_ atau platform lain).
            </p>

            <h2>4. Penghapusan Data</h2>
            <p>
              Anda memiliki hak untuk meminta penghapusan akun beserta seluruh riwayat data tryout Anda dengan menghubungi dukungan teknis kami di support@TaktikUjian.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
