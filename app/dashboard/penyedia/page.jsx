// Halaman dashboard penyedia jasa wisata
// Server Component: proteksi akses hanya untuk PENYEDIA ACTIVE
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PenyediaClient from './PenyediaClient'

export default async function DashboardPenyediaPage() {
  const session = await getServerSession(authOptions)

  // Redirect ke login jika tidak terautentikasi
  if (!session) {
    redirect('/login')
  }

  // Penyedia dengan status PENDING atau REJECTED tidak boleh akses
  if (session.user.role !== 'PENYEDIA') {
    redirect('/login')
  }

  if (session.user.status !== 'ACTIVE') {
    redirect('/login?error=Akun%20Anda%20belum%20disetujui%20admin')
  }

  return (
    <PenyediaClient
      providerId={session.user.id}
      providerName={session.user.name}
    />
  )
}
