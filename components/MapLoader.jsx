'use client'

// Wrapper Client Component untuk MapComponent
// next/dynamic dengan ssr:false HARUS berada di Client Component (Next.js 16)
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-[#1C3A2B]/10 flex items-center justify-center text-sm text-[#1C3A2B]/50">
      Memuat peta...
    </div>
  ),
})

export default function MapLoader({ lat, lng, name }) {
  return <MapComponent lat={lat} lng={lng} name={name} />
}
