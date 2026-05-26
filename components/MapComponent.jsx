'use client'

// Komponen peta interaktif menggunakan Leaflet via CDN
// Leaflet tidak di-install via npm karena tidak kompatibel dengan SSR Next.js
// CDN dimuat secara dinamis di useEffect setelah komponen ter-mount di client
import { useEffect, useRef } from 'react'

export default function MapComponent({ lat, lng, name }) {
  const mapRef = useRef(null)       // Referensi ke instance L.map()
  const mapDivRef = useRef(null)    // Referensi ke elemen DOM div#map

  useEffect(() => {
    // Cegah inisialisasi ganda saat React strict mode / hot reload
    if (mapRef.current) return

    // Muat Leaflet CSS dari CDN secara dinamis
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Muat Leaflet JS dari CDN secara dinamis
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js'
    script.type = 'module'

    script.onload = () => {
      // Pastikan L (Leaflet) tersedia setelah script dimuat
      // Untuk CDN non-module, L tersedia di window.L
    }

    // Alternatif: gunakan leaflet versi UMD yang expose ke window.L
    const scriptUmd = document.createElement('script')
    scriptUmd.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    scriptUmd.onload = () => {
      const L = window.L
      if (!L || !mapDivRef.current || mapRef.current) return

      // Inisialisasi peta dengan koordinat destinasi
      const map = L.map(mapDivRef.current).setView([lat, lng], 13)

      // Layer tile OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Tambah marker di lokasi destinasi
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<strong>${name}</strong>`)
        .openPopup()

      mapRef.current = map
    }

    document.head.appendChild(link)
    document.body.appendChild(scriptUmd)

    // Cleanup: hapus map saat komponen di-unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, name])

  return (
    <div
      ref={mapDivRef}
      id="map"
      style={{ height: '400px', width: '100%', zIndex: 0 }}
      className="rounded-sm"
    />
  )
}
