import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import CtaButton from "@/components/home/CtaButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        
        {/* Call To Action Section */}
        <section className="py-24 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-1/2 -left-1/4 w-[500px] h-[500px] bg-brand-500/30 rounded-full blur-[100px] animate-[spin_20s_linear_infinite]" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Siap Mewujudkan Mimpi Anda Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300">ASN Tahun Ini?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
              Bergabunglah sekarang. Ribuan pejuang NIP telah membuktikan keampuhan metode belajar di Taktik Ujian. Waktu Anda adalah sekarang.
            </p>
            <CtaButton />
            <p className="mt-6 text-sm text-slate-400 font-bold uppercase tracking-widest">Akses Langsung ke Dashboard • 100% Gratis Pendaftaran</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
