// API endpoint untuk booking
// GET /api/bookings — return booking sesuai role
// POST /api/bookings — TURIS ACTIVE buat booking baru
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, role } = session.user
  let bookings

  if (role === 'SUPERADMIN') {
    // Admin melihat semua booking
    bookings = await prisma.booking.findMany({
      include: {
        turis: { select: { id: true, name: true, email: true } },
        package: {
          include: {
            destination: { select: { name: true, slug: true } },
            provider: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } else if (role === 'PENYEDIA') {
    // Penyedia melihat booking untuk paket miliknya
    bookings = await prisma.booking.findMany({
      where: {
        package: { providerId: id },
      },
      include: {
        turis: { select: { id: true, name: true, email: true } },
        package: {
          include: {
            destination: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } else {
    // Turis hanya melihat booking miliknya sendiri
    bookings = await prisma.booking.findMany({
      where: { turisId: id },
      include: {
        package: {
          include: {
            destination: { select: { name: true, slug: true } },
            provider: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return Response.json(bookings)
}

export async function POST(request) {
  // Hanya TURIS dengan status ACTIVE yang bisa booking
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'TURIS' || session.user.status !== 'ACTIVE') {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { packageId, message } = body

    if (!packageId) {
      return Response.json({ error: 'packageId wajib diisi' }, { status: 400 })
    }

    // Cek apakah turis sudah punya booking aktif untuk paket yang sama
    const existingBooking = await prisma.booking.findFirst({
      where: {
        turisId: session.user.id,
        packageId: parseInt(packageId),
        status: { in: ['PENDING', 'APPROVED'] },
      },
    })

    if (existingBooking) {
      return Response.json(
        { error: 'Anda sudah memiliki booking aktif untuk paket ini' },
        { status: 409 }
      )
    }

    // Buat booking baru dengan status PENDING
    const booking = await prisma.booking.create({
      data: {
        turisId: session.user.id,
        packageId: parseInt(packageId),
        message: message || null,
        status: 'PENDING',
      },
      include: {
        package: {
          include: { destination: { select: { name: true } } },
        },
      },
    })

    return Response.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
