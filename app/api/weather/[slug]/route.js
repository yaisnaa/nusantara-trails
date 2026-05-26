// API endpoint cuaca real-time dari Open-Meteo
// GET /api/weather/[slug]
import { prisma } from '@/lib/prisma'

// Mapping weathercode Open-Meteo ke deskripsi bahasa Indonesia
function getWeatherCondition(code) {
  if (code === 0) return 'Cerah ☀️'
  if ([1, 2, 3].includes(code)) return 'Berawan ⛅'
  if ([45, 48].includes(code)) return 'Berkabut 🌫️'
  if ([51, 53, 55].includes(code)) return 'Gerimis 🌦️'
  if ([61, 63, 65].includes(code)) return 'Hujan 🌧️'
  if ([80, 81, 82].includes(code)) return 'Hujan Lebat 🌧️'
  if ([95, 96, 99].includes(code)) return 'Badai ⛈️'
  return 'Tidak Diketahui'
}

export async function GET(request, { params }) {
  const { slug } = await params

  // Ambil koordinat destinasi dari database
  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: { lat: true, lng: true, name: true },
  })

  if (!destination) {
    return Response.json({ error: 'Destinasi tidak ditemukan' }, { status: 404 })
  }

  try {
    // Fetch data cuaca dari Open-Meteo (gratis, tanpa API key)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${destination.lat}&longitude=${destination.lng}&current=temperature_2m,weathercode,windspeed_10m&timezone=Asia/Jakarta`

    const weatherRes = await fetch(weatherUrl, { next: { revalidate: 3600 } })

    if (!weatherRes.ok) {
      throw new Error('Gagal mengambil data cuaca')
    }

    const weatherData = await weatherRes.json()
    const current = weatherData.current

    return Response.json({
      temperature: current.temperature_2m,
      condition: getWeatherCondition(current.weathercode),
      windspeed: current.windspeed_10m,
      destinationName: destination.name,
    })
  } catch (error) {
    console.error('Weather fetch error:', error)
    return Response.json({ error: 'Gagal mengambil data cuaca' }, { status: 500 })
  }
}
