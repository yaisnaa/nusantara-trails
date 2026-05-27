// Prisma 7 wajib menggunakan driver adapter — tidak ada lagi datasourceUrl di constructor
// @prisma/adapter-mariadb adalah adapter resmi untuk MariaDB dan MySQL
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

// Parse DATABASE_URL menjadi config object yang dibutuhkan PrismaMariaDb
function parseDbUrl(url) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
  }
}

const globalForPrisma = globalThis

function createPrismaClient() {
  const adapter = new PrismaMariaDb(parseDbUrl(process.env.DATABASE_URL))
  return new PrismaClient({ adapter })
}

// Lazy initialization via Proxy — PrismaClient baru dibuat saat property pertama diakses
// Ini menghindari error saat `next build` (DATABASE_URL belum tersedia saat module dievaluasi)
function getPrisma() {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createPrismaClient()
  }
  return globalForPrisma.__prisma
}

export const prisma = new Proxy({}, {
  get(_target, prop) {
    return getPrisma()[prop]
  },
})
