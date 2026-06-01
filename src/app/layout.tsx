import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Taktik Ujian | Platform Tryout SKD CPNS & Kedinasan Terbaik",
  description: "Persiapkan diri Anda menghadapi tes SKD CPNS dan Sekolah Kedinasan dengan tryout berbasis CAT yang akurat, lengkap dengan pembahasan komprehensif dan ranking nasional. Raih mimpimu menjadi ASN bersama Taktik Ujian!",
  keywords: ["tryout cpns", "tryout skd", "tryout kedinasan", "cat bkn", "simulasi cat", "cpns 2026", "soal cpns", "pendaftaran cpns", "pendaftaran kedinasan", "lulus cpns", "Taktik Ujian tryout"],
  authors: [{ name: "Taktik Ujian Team" }],
  creator: "Taktik Ujian",
  publisher: "Taktik Ujian Edukasi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Taktik Ujian | Platform Tryout SKD CPNS & Kedinasan Terbaik",
    description: "Persiapkan diri Anda menghadapi tes SKD CPNS dan Sekolah Kedinasan dengan tryout berbasis CAT yang akurat. Raih mimpimu bersama Taktik Ujian!",
    url: "https://TaktikUjian.com",
    siteName: "Taktik Ujian Tryout",
    images: [
      {
        url: "https://TaktikUjian.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taktik Ujian Tryout Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taktik Ujian | Platform Tryout SKD CPNS & Kedinasan Terbaik",
    description: "Persiapkan diri Anda menghadapi tes SKD CPNS dan Sekolah Kedinasan dengan tryout berbasis CAT yang akurat.",
    images: ["https://TaktikUjian.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col selection:bg-brand-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
