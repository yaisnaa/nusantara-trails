// API endpoint approve/reject booking
// PATCH /api/bookings/[id]
// Bisa diakses PENYEDIA (hanya paket miliknya) atau SUPERADMIN
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)

  if (!session || !['PENYEDIA', 'SUPERADMIN'].includes(session.user.role)) {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { action } = body

  if (!['approve', 'reject'].includes(action)) {
    return Response.json({ error: 'Action tidak valid' }, { status: 400 })
  }

  // Ambil booking beserta relasi paket untuk verifikasi kepemilikan
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
    include: { package: { select: { providerId: true } } },
  })

  if (!booking) {
    return Response.json({ error: 'Booking tidak ditemukan' }, { status: 404 })
  }

  // Penyedia hanya boleh update booking untuk paket miliknya
  if (
    session.user.role === 'PENYEDIA' &&
    booking.package.providerId !== session.user.id
  ) {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'

  const updatedBooking = await prisma.booking.update({
    where: { id: parseInt(id) },
    data: { status: newStatus },
    select: { id: true, status: true },
  })

  return Response.json(updatedBooking)
}
