// Halaman dashboard admin (SUPERADMIN only)
// Server Component: redirect jika bukan superadmin
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Redirect ke login jika tidak ada sesi atau bukan SUPERADMIN
  if (!session || session.user.role !== 'SUPERADMIN') {
    redirect('/login')
  }

  return <AdminClient adminName={session.user.name} />
}
