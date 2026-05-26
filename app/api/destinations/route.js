// API endpoint: ambil semua destinasi untuk dropdown form
// GET /api/destinations
import { prisma } from '@/lib/prisma'

export async function GET() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true, slug: true, region: true },
    orderBy: { name: 'asc' },
  })

  return Response.json(destinations)
}
