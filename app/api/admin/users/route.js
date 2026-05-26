// API endpoint untuk admin: ambil list user PENDING
// GET /api/admin/users
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  // Verifikasi sesi dan role SUPERADMIN
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPERADMIN') {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  // Ambil semua user PENDING (kecuali SUPERADMIN)
  const pendingUsers = await prisma.user.findMany({
    where: {
      status: 'PENDING',
      role: { not: 'SUPERADMIN' },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(pendingUsers)
}
