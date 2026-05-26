// Halaman dashboard turis
// Server Component: proteksi akses hanya TURIS ACTIVE
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TurisClient from './TurisClient'

export default async function DashboardTurisPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'TURIS') {
    redirect('/login')
  }

  if (session.user.status !== 'ACTIVE') {
    redirect('/login?error=Akun%20Anda%20belum%20disetujui%20admin')
  }

  return (
    <TurisClient
      turisId={session.user.id}
      turisName={session.user.name}
    />
  )
}
