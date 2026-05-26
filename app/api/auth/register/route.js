// API endpoint registrasi user baru
// POST /api/auth/register
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validasi field wajib
    if (!name || !email || !password || !role) {
      return Response.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    // Validasi role hanya PENYEDIA atau TURIS
    if (!['PENYEDIA', 'TURIS'].includes(role)) {
      return Response.json(
        { error: 'Role tidak valid' },
        { status: 400 }
      )
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return Response.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      )
    }

    // Hash password dengan bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert user baru dengan status PENDING
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: 'PENDING',
      },
    })

    return Response.json(
      { message: 'Registrasi berhasil. Menunggu persetujuan admin.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return Response.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
