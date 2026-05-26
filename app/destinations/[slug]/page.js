/**
 * Halaman detail destinasi — diupdate dengan peta, cuaca, dan paket wisata
 * Tetap sebagai Server Component; MapComponent dan WeatherCard diimport terpisah
 */

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WeatherCard from '@/components/WeatherCard'
import { getDestinationBySlug } from '@/lib/api'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Import MapComponent dengan dynamic import agar tidak di-render di server (SSR: false)
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-[#1C3A2B]/10 flex items-center justify-center text-sm text-[#1C3A2B]/50">
      Memuat peta...
    </div>
  ),
})

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

export default async function DestinationDetail({ params }) {
  const { slug } = await params

  // Data statis dari data/destinations.js
  const destination = getDestinationBySlug(slug)
  if (!destination) notFound()

  // Ambil sesi user untuk cek apakah tombol booking ditampilkan
  const session = await getServerSession(authOptions)
  const isTurisActive =
    session?.user?.role === 'TURIS' && session?.user?.status === 'ACTIVE'

  // Ambil paket wisata untuk destinasi ini dari database
  let packages = []
  try {
    // Cari destinasi di DB berdasarkan slug untuk mendapatkan ID
    const dbDestination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        packages: {
          include: {
            provider: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    if (dbDestination) {
      packages = dbDestination.packages
    }
  } catch {
    // Jika DB belum tersedia, lanjutkan tanpa paket
  }

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        {/* HERO DETAIL */}
        <header className="relative h-[60vh] md:h-[70vh] bg-deep-green overflow-hidden">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-custom text-center">
              <span className="text-terracotta font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
                {destination.region}
              </span>
              <h1 className="text-4xl md:text-7xl font-serif font-bold text-cream italic leading-tight">
                {destination.name}
              </h1>
            </div>
          </div>
        </header>

        {/* CONTENT SECTION */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

              {/* SIDEBAR: INFO TEKNIS + CUACA + PETA */}
              <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
                {/* Info Perjalanan */}
                <div className="bg-white p-8 shadow-sm border-t-4 border-terracotta">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-terracotta mb-6">
                    Info Perjalanan
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-deep-green uppercase tracking-tighter mb-2">
                        Koordinat
                      </h4>
                      <p className="text-sm text-dark-text/70 font-mono">
                        {destination.coordinates.lat}, {destination.coordinates.lng}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-deep-green uppercase tracking-tighter mb-2">
                        Cara Menuju Ke Sana
                      </h4>
                      <p className="text-sm text-dark-text/70 leading-relaxed">
                        {destination.howToGetThere}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cuaca Real-time */}
                <WeatherCard slug={slug} />

                {/* Cultural Notes */}
                <div className="bg-deep-green p-8 text-cream">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-terracotta mb-6">
                    Cultural Notes
                  </h3>
                  <ul className="space-y-4">
                    {destination.culturalNotes.map((note, index) => (
                      <li key={index} className="text-sm flex gap-4">
                        <span className="text-terracotta font-bold">0{index + 1}.</span>
                        <span className="text-cream/80">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* MAIN STORY + PETA + PAKET WISATA */}
              <article className="lg:col-span-8 order-1 lg:order-2 space-y-12">
                {/* Narasi utama */}
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-green italic mb-8">
                    Warisan di Balik Cakrawala
                  </h2>
                  {destination.fullStory.split('\n\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg text-dark-text/80 leading-relaxed mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-terracotta first-letter:mr-3 first-letter:float-left"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Decorative image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={destination.image}
                    alt="Detail view"
                    className="w-full h-full object-cover saturate-0 hover:saturate-100 transition-all duration-1000"
                  />
                </div>

                {/* Peta Interaktif */}
                <div>
                  <h2 className="text-2xl font-serif font-bold text-deep-green mb-4">
                    Lokasi di Peta
                  </h2>
                  <MapComponent
                    lat={destination.coordinates.lat}
                    lng={destination.coordinates.lng}
                    name={destination.name}
                  />
                </div>

                {/* Paket Wisata Tersedia */}
                <div>
                  <h2 className="text-2xl font-serif font-bold text-deep-green mb-6">
                    Paket Wisata Tersedia
                  </h2>

                  {packages.length === 0 ? (
                    <p className="text-dark-text/50 text-sm py-4">
                      Belum ada paket wisata untuk destinasi ini.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="bg-white shadow-sm p-6 flex flex-col sm:flex-row gap-4"
                        >
                          {pkg.imagePath && (
                            <img
                              src={pkg.imagePath}
                              alt={pkg.title}
                              className="w-full sm:w-32 h-32 object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-serif font-bold text-deep-green text-lg">
                              {pkg.title}
                            </h3>
                            <p className="text-sm text-dark-text/60 mt-1">
                              ⏱ {pkg.duration} · oleh {pkg.provider.name}
                            </p>
                            <p className="text-sm text-dark-text/70 mt-2 line-clamp-2">
                              {pkg.description}
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-terracotta font-bold text-lg">
                                {formatRupiah(pkg.price)}
                              </span>

                              {/* Tombol booking hanya muncul untuk turis yang aktif */}
                              {isTurisActive ? (
                                <Link
                                  href="/dashboard/turis"
                                  className="bg-deep-green text-cream px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-colors"
                                >
                                  Booking
                                </Link>
                              ) : !session ? (
                                <Link
                                  href="/login"
                                  className="border border-deep-green text-deep-green px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-deep-green hover:text-cream transition-colors"
                                >
                                  Login untuk Booking
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
