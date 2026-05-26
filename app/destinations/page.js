/**
 * Page app/destinations/page.js
 * Katalog lengkap destinasi. Mendukung filter berdasarkan wilayah.
 */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { getDestinationsByRegion } from '@/lib/api';
import Link from 'next/link';

export default async function Destinations({ searchParams }) {
  // Mengambil filter region dari URL (contoh: /destinations?region=Sumatera)
  const selectedRegion = (await searchParams).region || 'All';
  
  // Mengambil data berdasarkan region yang dipilih
  const filteredDestinations = getDestinationsByRegion(selectedRegion);

  // Daftar region untuk tombol filter
  const regions = ['All', 'Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua', 'Nusa Tenggara'];

  return (
    <>
      <Navbar />
      
      <main className="bg-cream min-h-screen">
        {/* HEADER CATALOG */}
        <section className="bg-deep-green py-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream italic mb-6">Katalog Destinasi</h1>
            <p className="text-cream/70 max-w-2xl mx-auto">
              Telusuri permata tersembunyi dari Sabang sampai Merauke. Gunakan filter untuk mencari berdasarkan wilayah kepulauan.
            </p>
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="border-b border-deep-green/10 sticky top-[80px] md:top-[88px] bg-cream z-40">
          <div className="container-custom py-4 overflow-x-auto">
            <div className="flex gap-4 md:justify-center whitespace-nowrap">
              {regions.map((region) => (
                <Link
                  key={region}
                  href={region === 'All' ? '/destinations' : `/destinations?region=${region}`}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    selectedRegion === region 
                      ? 'bg-terracotta text-cream' 
                      : 'text-deep-green hover:bg-deep-green/5'
                  }`}
                >
                  {region}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* DESTINATION GRID */}
        <section className="section-padding">
          <div className="container-custom">
            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {filteredDestinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl font-serif italic text-deep-green/50">Belum ada destinasi untuk wilayah ini.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
