/**
 * Component components/Navbar.js
 * Navigasi utama yang muncul di bagian atas setiap halaman.
 */

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-cream border-b border-deep-green/10 sticky top-0 z-50">
      <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo / Judul Project */}
        <Link href="/" className="text-2xl font-serif font-bold text-terracotta tracking-tight">
          NUSANTARA TRAILS
        </Link>
        
        {/* Menu Navigasi */}
        <div className="flex gap-8 items-center text-sm font-medium uppercase tracking-widest text-deep-green">
          <Link href="/" className="hover:text-terracotta transition-colors">
            Beranda
          </Link>
          <Link href="/destinations" className="hover:text-terracotta transition-colors">
            Destinasi
          </Link>
          <Link href="/stories" className="hover:text-terracotta transition-colors">
            Cerita Budaya
          </Link>
          <Link href="/about" className="hover:text-terracotta transition-colors">
            Tentang
          </Link>
        </div>
      </div>
    </nav>
  );
}
