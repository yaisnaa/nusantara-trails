// Komponen WeatherCard: menampilkan cuaca real-time dari Open-Meteo
// Server Component — fetch data di server saat render
export default async function WeatherCard({ slug }) {
  let weather = null
  let error = null

  try {
    // Fetch dari API route internal /api/weather/[slug]
    // Gunakan URL absolut karena ini adalah Server Component
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/weather/${slug}`, {
      next: { revalidate: 3600 }, // Cache cuaca 1 jam
    })

    if (res.ok) {
      weather = await res.json()
    } else {
      error = 'Data cuaca tidak tersedia'
    }
  } catch {
    error = 'Gagal memuat data cuaca'
  }

  if (error || !weather) {
    return (
      <div className="bg-white/50 border border-[#1C3A2B]/10 p-4 text-sm text-[#1C3A2B]/50 rounded-sm">
        {error || 'Data cuaca tidak tersedia saat ini'}
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm border-t-4 border-[#1C3A2B] p-6">
      <h3 className="text-xs uppercase tracking-widest font-bold text-[#C4622D] mb-4">
        Cuaca Saat Ini
      </h3>

      <div className="flex items-center gap-4">
        {/* Temperatur besar */}
        <div className="text-4xl font-serif font-bold text-[#1C3A2B]">
          {weather.temperature}°C
        </div>

        <div className="flex-1">
          {/* Kondisi cuaca */}
          <p className="text-lg font-medium text-[#1C3A2B]">{weather.condition}</p>
          {/* Kecepatan angin */}
          <p className="text-sm text-[#1C3A2B]/60 mt-1">
            💨 Angin {weather.windspeed} km/j
          </p>
        </div>
      </div>

      <p className="text-xs text-[#1C3A2B]/40 mt-4">
        Data real-time dari Open-Meteo · Diperbarui setiap jam
      </p>
    </div>
  )
}
