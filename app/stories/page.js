/**
 * Page app/stories/page.js
 * Daftar artikel/cerita budaya non-destinasi.
 */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoryCard from '@/components/StoryCard';
import { getAllStories } from '@/lib/api';

export default function Stories() {
  const stories = getAllStories();

  return (
    <>
      <Navbar />
      
      <main className="bg-cream min-h-screen">
        {/* HEADER STORIES */}
        <section className="bg-terracotta py-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream italic mb-6">Cerita Budaya</h1>
            <p className="text-cream/90 max-w-2xl mx-auto">
              Mendalami esensi tradisi, kuliner, dan festival yang menjadi benang merah identitas bangsa Indonesia.
            </p>
          </div>
        </section>

        {/* STORIES LIST */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto space-y-20">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER / CTA */}
        <section className="py-24 bg-deep-green text-cream text-center">
          <div className="container-custom">
            <h2 className="text-3xl font-serif italic mb-6">Punya Cerita Budaya dari Daerahmu?</h2>
            <p className="text-cream/70 mb-10 max-w-lg mx-auto">
              Kami terbuka untuk kontributor yang ingin berbagi narasi tentang tradisi lokal di Indonesia.
            </p>
            <button className="bg-terracotta text-cream px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-terracotta/90 transition-all">
              Hubungi Redaksi
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
