// API admin: ambil semua booking
// GET /api/admin/bookings
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPERADMIN') {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const bookings = await prisma.booking.findMany({
    include: {
      turis: { select: { name: true, email: true } },
      package: {
        include: {
          destination: { select: { name: true } },
          provider: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(bookings)
}
