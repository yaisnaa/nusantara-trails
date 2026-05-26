// API admin: ambil semua paket wisata
// GET /api/admin/packages
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPERADMIN') {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const packages = await prisma.travelPackage.findMany({
    include: {
      destination: { select: { name: true, region: true } },
      provider: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(packages)
}
