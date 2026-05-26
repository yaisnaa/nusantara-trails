/**
 * Page app/about/page.js
 * Halaman informasi tentang platform dan tugas kuliah.
 */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      
      <main className="bg-cream">
        <section className="section-padding">
          <div className="container-custom max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-deep-green italic mb-12">Tentang Kami</h1>
            
            <div className="space-y-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-serif font-bold text-terracotta">Misi Nusantara Trails</h2>
                <p className="text-dark-text/80 leading-relaxed">
                  Nusantara Trails lahir dari keinginan untuk mendokumentasikan keindahan Indonesia yang melampaui sekadar estetika visual. Kami percaya bahwa setiap destinasi, sekecil apapun, memiliki narasi budaya yang patut didengar. Fokus kami adalah "Hidden Gems" — tempat-tempat yang jarang dikunjungi namun memiliki nilai sejarah dan tradisi yang mendalam.
                </p>
                <p className="text-dark-text/80 leading-relaxed">
                  Melalui platform ini, kami berharap dapat mendorong pertukaran budaya yang sehat antara wisatawan dan masyarakat lokal, serta mempromosikan pariwisata berkelanjutan yang menghormati adat istiadat setempat.
                </p>
              </div>

              <div className="bg-white p-8 md:p-12 shadow-sm border-l-8 border-deep-green">
                <h2 className="text-2xl font-serif font-bold text-deep-green mb-6">Informasi Tugas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-terracotta mb-2 text-xs">Project</h3>
                    <p className="text-lg">Nusantara Trails Web Application</p>
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-terracotta mb-2 text-xs">Matakuliah</h3>
                    <p className="text-lg">Pemrograman Web</p>
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-terracotta mb-2 text-xs">Teknologi</h3>
                    <ul className="list-disc list-inside mt-2 text-dark-text/70">
                      <li>Next.js 14 (App Router)</li>
                      <li>Tailwind CSS</li>
                      <li>JavaScript (Vanilla)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-terracotta mb-2 text-xs">Status</h3>
                    <p className="text-lg text-deep-green font-bold">Tugas 1: Frontend Development</p>
                    <p className="text-xs text-dark-text/50 mt-1">*Tugas 2 akan mencakup Backend & Database</p>
                  </div>
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
