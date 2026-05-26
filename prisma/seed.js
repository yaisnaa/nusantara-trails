// Script seed database Nusantara Trails
// Menginisialisasi: 1 superadmin, 1 penyedia demo, 8 destinasi, dan 2 paket wisata sample
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

// Prisma 7: URL koneksi diteruskan ke constructor
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  console.log('🌱 Mulai proses seeding...')

  // Hapus data lama untuk menghindari duplikat (urutan penting karena foreign key)
  await prisma.booking.deleteMany()
  await prisma.travelPackage.deleteMany()
  await prisma.destination.deleteMany()
  await prisma.user.deleteMany()

  // ----- INSERT SUPERADMIN -----
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const superadmin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@nusantaratrails.com',
      password: adminPassword,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
  })
  console.log('✓ Superadmin dibuat:', superadmin.email)

  // ----- INSERT PENYEDIA DEMO -----
  const penyediaPassword = await bcrypt.hash('Penyedia123!', 12)
  const penyedia = await prisma.user.create({
    data: {
      name: 'Jelajah Jabar Tour',
      email: 'penyedia@nusantaratrails.com',
      password: penyediaPassword,
      role: 'PENYEDIA',
      status: 'ACTIVE',
    },
  })
  console.log('✓ Penyedia demo dibuat:', penyedia.email)

  // ----- INSERT DESTINASI JAWA BARAT -----
  const destinasiData = [
    {
      slug: 'lembang',
      name: 'Lembang',
      region: 'Bandung Barat',
      description: 'Kawasan wisata dataran tinggi dengan udara sejuk, kebun stroberi, dan berbagai objek wisata alam.',
      lat: -6.8120,
      lng: 107.6176,
    },
    {
      slug: 'kawah-putih',
      name: 'Kawah Putih Ciwidey',
      region: 'Bandung Selatan',
      description: 'Danau kawah vulkanik berwarna putih kehijauan di ketinggian 2.194 mdpl dengan pemandangan dramatis.',
      lat: -7.1665,
      lng: 107.4020,
    },
    {
      slug: 'kampung-naga',
      name: 'Kampung Naga',
      region: 'Tasikmalaya',
      description: 'Desa adat Sunda yang mempertahankan kehidupan tradisional tanpa listrik dan teknologi modern.',
      lat: -7.3891,
      lng: 108.1161,
    },
    {
      slug: 'kampung-pulo',
      name: 'Kampung Pulo',
      region: 'Garut',
      description: 'Kampung adat di tengah Situ Cangkuang dengan rumah-rumah tradisional Sunda yang unik.',
      lat: -7.0833,
      lng: 107.7167,
    },
    {
      slug: 'gunung-padang',
      name: 'Situs Gunung Padang',
      region: 'Cianjur',
      description: 'Situs megalitik terbesar di Asia Tenggara dengan susunan batu andesit yang misterius dan berusia ribuan tahun.',
      lat: -6.9954,
      lng: 107.0567,
    },
    {
      slug: 'curug-cikaso',
      name: 'Curug Cikaso',
      region: 'Sukabumi',
      description: 'Air terjun bertingkat tiga dengan debit air deras, dikelilingi hutan tropis yang asri.',
      lat: -7.0028,
      lng: 106.5639,
    },
    {
      slug: 'saung-angklung-udjo',
      name: 'Saung Angklung Udjo',
      region: 'Bandung',
      description: 'Pusat kebudayaan Sunda dengan pertunjukan angklung, wayang golek, dan berbagai kesenian tradisional.',
      lat: -6.9028,
      lng: 107.6458,
    },
    {
      slug: 'pantai-sawarna',
      name: 'Pantai Sawarna',
      region: 'Lebak',
      description: 'Pantai tersembunyi dengan ombak besar untuk surfing, gua karst, dan keindahan alam yang masih alami.',
      lat: -6.9951,
      lng: 106.2642,
    },
  ]

  const destinasi = await prisma.destination.createMany({ data: destinasiData })
  console.log(`✓ ${destinasi.count} destinasi dibuat`)

  // Ambil ID destinasi kawah-putih dan kampung-naga untuk paket sample
  const kawahPutih = await prisma.destination.findUnique({ where: { slug: 'kawah-putih' } })
  const kampungNaga = await prisma.destination.findUnique({ where: { slug: 'kampung-naga' } })

  // ----- INSERT PAKET WISATA SAMPLE -----
  const paket1 = await prisma.travelPackage.create({
    data: {
      title: 'Paket Kawah Putih 1 Hari',
      description: 'Nikmati keajaiban danau vulkanik Kawah Putih Ciwidey dalam satu hari penuh. Termasuk transportasi PP dari Bandung, tiket masuk, pemandu wisata berpengalaman, dan makan siang. Cocok untuk keluarga dan pasangan.',
      price: 350000,
      duration: '1 hari',
      providerId: penyedia.id,
      destinationId: kawahPutih.id,
    },
  })
  console.log('✓ Paket 1 dibuat:', paket1.title)

  const paket2 = await prisma.travelPackage.create({
    data: {
      title: 'Paket Kampung Naga Heritage',
      description: 'Jelajahi desa adat Kampung Naga dan rasakan kehidupan masyarakat Sunda tradisional. Paket 2 hari 1 malam termasuk menginap di rumah penduduk, workshop kerajinan tradisional, dan tur budaya bersama tetua desa.',
      price: 750000,
      duration: '2 hari 1 malam',
      providerId: penyedia.id,
      destinationId: kampungNaga.id,
    },
  })
  console.log('✓ Paket 2 dibuat:', paket2.title)

  console.log('\n✅ Seeding selesai!')
  console.log('\n📋 Akun yang dibuat:')
  console.log('   Superadmin : admin@nusantaratrails.com / Admin123!')
  console.log('   Penyedia   : penyedia@nusantaratrails.com / Penyedia123!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
