/**
 * Component components/Navbar.js
 * Navigasi utama yang muncul di bagian atas setiap halaman.
 * Server Component: mengecek sesi via getServerSession untuk render kondisional.
 */

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LogoutButton from './LogoutButton';

// Mapping role ke URL dashboard masing-masing
function getDashboardUrl(role) {
  if (role === 'SUPERADMIN') return '/admin';
  if (role === 'PENYEDIA') return '/dashboard/penyedia';
  return '/dashboard/turis';
}

export default async function Navbar() {
  // Ambil sesi user saat ini (null kalau belum login)
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full bg-cream border-b border-deep-green/10 sticky top-0 z-50">
      <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo / Judul Project */}
        <Link href="/" className="text-2xl font-serif font-bold text-terracotta tracking-tight">
          NUSANTARA TRAILS
        </Link>

        {/* Menu Navigasi */}
        <div className="flex flex-wrap gap-6 md:gap-8 items-center text-sm font-medium uppercase tracking-widest text-deep-green">
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

          {/* Separator visual antara menu utama dan menu auth */}
          <span className="hidden md:inline text-deep-green/30">|</span>

          {/* Render kondisional berdasarkan status login */}
          {session ? (
            <>
              <Link
                href={getDashboardUrl(session.user.role)}
                className="hover:text-terracotta transition-colors"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-terracotta transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-terracotta text-cream px-5 py-2 hover:bg-deep-green transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
