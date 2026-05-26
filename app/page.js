/**
 * Page app/page.js (Home)
 * Halaman utama aplikasi. Menampilkan Hero section, Destinasi Unggulan, dan Highlight Cerita.
 */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { getFeaturedDestinations, getAllStories } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  // Mengambil data untuk ditampilkan
  const featuredDestinations = getFeaturedDestinations(8);
  const stories = getAllStories();

  return (
    <>
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-deep-green">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=2000" 
              alt="Indonesia Landscape" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container-custom relative z-10 text-center">
            <span className="text-terracotta font-bold uppercase tracking-[0.4em] text-sm mb-4 block">
              Menjelajahi Jantung Indonesia
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-cream leading-tight italic">
              Permata Tersembunyi <br /> Nusantara
            </h1>
            <p className="mt-8 text-cream/80 max-w-2xl mx-auto text-lg md:text-xl font-light">
              Lebih dari sekadar destinasi. Kami membawa Anda menyelami narasi budaya dan kearifan lokal yang membentuk identitas bangsa.
            </p>
            <div className="mt-12">
              <Link 
                href="/destinations" 
                className="bg-terracotta text-cream px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-terracotta/90 transition-all inline-block"
              >
                Mulai Penjelajahan
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED DESTINATIONS */}
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-green italic">
                  Destinasi Pilihan
                </h2>
                <div className="w-24 h-1 bg-terracotta mt-4"></div>
              </div>
              <Link href="/destinations" className="text-sm font-bold uppercase tracking-widest text-terracotta border-b border-terracotta pb-1">
                Lihat Semua Destinasi
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featuredDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        </section>

        {/* CULTURAL STORIES HIGHLIGHT */}
        <section className="section-padding bg-deep-green text-cream overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={stories[1].image} 
                    alt="Cultural Highlight" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Decorative Element */}
                <div className="absolute -bottom-8 -right-8 w-48 h-48 border-4 border-terracotta z-[-1] hidden md:block"></div>
              </div>
              
              <div>
                <span className="text-terracotta font-bold uppercase tracking-widest text-xs">Cultural Stories</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mt-4 leading-tight">
                  Narasi yang <br /> Menghidupkan Tradisi
                </h2>
                <p className="mt-8 text-cream/70 text-lg leading-relaxed">
                  Setiap tempat memiliki jiwa. Melalui catatan budaya, kami mendokumentasikan ritual, kuliner, dan seni yang mulai terlupakan agar tetap lestari di hati generasi mendatang.
                </p>
                <div className="mt-10 space-y-6">
                  {stories.slice(0, 2).map((story) => (
                    <Link key={story.id} href="/stories" className="group flex items-center justify-between border-b border-cream/10 pb-4">
                      <span className="text-xl font-serif italic group-hover:text-terracotta transition-colors">{story.title}</span>
                      <span className="text-terracotta">→</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-12">
                  <Link href="/stories" className="text-sm font-bold uppercase tracking-widest border border-cream px-8 py-3 hover:bg-cream hover:text-deep-green transition-all">
                    Jelajahi Semua Cerita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
