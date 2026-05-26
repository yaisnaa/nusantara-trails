// Konfigurasi Prisma 7 — URL database dari environment variable
// Menggunakan process.env agar tidak throw saat DATABASE_URL belum diset (misal saat generate)
const { defineConfig } = require('prisma/config')

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
