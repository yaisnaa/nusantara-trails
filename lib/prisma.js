// Prisma 7 wajib menggunakan driver adapter — tidak ada lagi datasourceUrl di constructor
// @prisma/adapter-mariadb adalah adapter resmi untuk MariaDB dan MySQL
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

// Parse DATABASE_URL menjadi config object yang dibutuhkan PrismaMariaDb
// Format URL: mysql://USER:PASSWORD@HOST:PORT/DATABASE
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
  const dbConfig = parseDbUrl(process.env.DATABASE_URL)
  const adapter = new PrismaMariaDb(dbConfig)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
