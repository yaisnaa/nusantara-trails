// Route handler NextAuth.js untuk App Router
// Menangani semua request ke /api/auth/* (login, logout, session, dll)
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
