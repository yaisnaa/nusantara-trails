/**
 * Component components/DestinationCard.js
 * Card untuk menampilkan ringkasan destinasi di halaman list atau home.
 */

import Link from 'next/link';

export default function DestinationCard({ destination }) {
  return (
    <Link href={`/destinations/${destination.slug}`} className="group block overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
        {/* Gambar Destinasi dengan efek zoom saat hover */}
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Label Region di pojok kiri atas */}
        <div className="absolute top-4 left-4 bg-terracotta text-cream text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
          {destination.region}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-serif font-bold text-deep-green group-hover:text-terracotta transition-colors decoration-terracotta decoration-2 underline-offset-4 group-hover:underline">
          {destination.name}
        </h3>
        <p className="mt-2 text-sm text-dark-text/70 line-clamp-2">
          {destination.shortDescription}
        </p>
        
        <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-terracotta group-hover:translate-x-2 transition-transform">
          Lihat Cerita →
        </span>
      </div>
    </Link>
  );
}
