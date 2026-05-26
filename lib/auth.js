// Konfigurasi NextAuth.js v4
// Menggunakan CredentialsProvider dengan JWT strategy
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi')
        }

        // Cari user di database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Email atau password salah')
        }

        // Cek status akun sebelum verifikasi password
        if (user.status === 'PENDING') {
          throw new Error('Akun Anda sedang menunggu persetujuan admin')
        }

        if (user.status === 'REJECTED') {
          throw new Error('Akun Anda telah ditolak. Hubungi admin untuk informasi lebih lanjut')
        }

        // Verifikasi password
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          throw new Error('Email atau password salah')
        }

        // Return data user yang akan disimpan ke JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // Tambahkan data custom ke JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.status = user.status
      }
      return token
    },
    // Ekspos data JWT ke session agar bisa diakses di client
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.status = token.status
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
