// API endpoint untuk paket wisata
// GET /api/packages — public, return semua paket
// POST /api/packages — protected PENYEDIA ACTIVE, upload paket baru
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  // Ambil semua paket beserta relasi destinasi dan nama penyedia
  const packages = await prisma.travelPackage.findMany({
    include: {
      destination: {
        select: { id: true, name: true, slug: true, region: true },
      },
      provider: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(packages)
}

export async function POST(request) {
  // Verifikasi sesi: hanya PENYEDIA dengan status ACTIVE
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'PENYEDIA' || session.user.status !== 'ACTIVE') {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  try {
    const formData = await request.formData()

    const title = formData.get('title')
    const description = formData.get('description')
    const price = formData.get('price')
    const duration = formData.get('duration')
    const destinationId = formData.get('destinationId')
    const imageFile = formData.get('image')

    // Validasi field wajib
    if (!title || !description || !price || !duration || !destinationId) {
      return Response.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    let imagePath = null

    // Proses upload file jika ada
    if (imageFile && imageFile.size > 0) {
      // Validasi tipe file: hanya JPEG, PNG, WebP
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(imageFile.type)) {
        return Response.json(
          { error: 'Format file tidak valid. Hanya JPEG, PNG, dan WebP diizinkan' },
          { status: 400 }
        )
      }

      // Validasi ukuran file: max 5MB
      if (imageFile.size > 5 * 1024 * 1024) {
        return Response.json(
          { error: 'Ukuran file maksimal 5MB' },
          { status: 400 }
        )
      }

      // Simpan file ke direktori upload dengan nama unik
      const uploadDir = process.env.UPLOAD_DIR || '/www/uploads'
      const ext = imageFile.name.split('.').pop()
      const fileName = `package-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = path.join(uploadDir, fileName)

      const bytes = await imageFile.arrayBuffer()
      await writeFile(filePath, Buffer.from(bytes))

      imagePath = `/uploads/${fileName}`
    }

    // Simpan paket wisata ke database
    const newPackage = await prisma.travelPackage.create({
      data: {
        title,
        description,
        price: parseInt(price),
        duration,
        imagePath,
        providerId: session.user.id,
        destinationId: parseInt(destinationId),
      },
      include: {
        destination: { select: { name: true, slug: true } },
      },
    })

    return Response.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('Upload package error:', error)
    return Response.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
