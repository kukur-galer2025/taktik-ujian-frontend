import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logokotak.png" alt="Taktik Ujian" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Platform Tryout SKD CPNS & Kedinasan nomor 1 di Indonesia. Belajar lebih efektif, efisien, dan tingkatkan peluang kelulusanmu bersama kami.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Menu Utama</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-brand-400 transition-colors">Beranda</Link></li>
              <li><Link href="#features" className="hover:text-brand-400 transition-colors">Fitur Unggulan</Link></li>
              <li><Link href="#pricing" className="hover:text-brand-400 transition-colors">Paket Belajar</Link></li>
              <li><Link href="#testimonials" className="hover:text-brand-400 transition-colors">Testimoni</Link></li>
              <li><Link href="/blog" className="hover:text-brand-400 transition-colors">Blog & Info CPNS</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Bantuan & Dukungan</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/faq" className="hover:text-brand-400 transition-colors">Pusat Bantuan (FAQ)</Link></li>
              <li><Link href="/terms" className="hover:text-brand-400 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-400 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/contact" className="hover:text-brand-400 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-brand-500 font-bold">Email:</span>
                <span>support@TaktikUjian.com</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-500 font-bold">WA:</span>
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-500 font-bold">Jam:</span>
                <span>Senin - Jumat, 08:00 - 17:00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Taktik Ujian. Hak Cipta Dilindungi.</p>
          <p>Dibuat dengan ❤️ untuk calon ASN masa depan.</p>
        </div>
      </div>
    </footer>
  );
}
