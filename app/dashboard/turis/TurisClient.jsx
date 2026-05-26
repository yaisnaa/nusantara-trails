'use client'

// Komponen client untuk dashboard turis
// Menampilkan semua paket wisata, form booking, dan riwayat booking
import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

// Badge status booking dengan warna berbeda
function BookingStatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    APPROVED: 'bg-green-100 text-green-800 border border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border border-red-300',
  }
  const labels = {
    PENDING: '⏳ Menunggu Konfirmasi',
    APPROVED: '✓ Disetujui',
    REJECTED: '✗ Ditolak',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
      {labels[status] || status}
    </span>
  )
}

export default function TurisClient({ turisId, turisName }) {
  const [activeTab, setActiveTab] = useState('paket')
  const [packages, setPackages] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // State untuk modal booking
  const [bookingModal, setBookingModal] = useState(null) // { packageId, packageTitle }
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMsg, setBookingMsg] = useState({ type: '', text: '' })

  const fetchPackages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/packages')
      setPackages(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookings')
      setMyBookings(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'paket') fetchPackages()
    if (activeTab === 'riwayat') fetchBookings()
  }, [activeTab, fetchPackages, fetchBookings])

  function openBookingModal(pkg) {
    setBookingModal({ packageId: pkg.id, packageTitle: pkg.title })
    setBookingMessage('')
    setBookingMsg({ type: '', text: '' })
  }

  function closeModal() {
    setBookingModal(null)
    setBookingMessage('')
    setBookingMsg({ type: '', text: '' })
  }

  async function handleBookingSubmit(e) {
    e.preventDefault()
    setBookingLoading(true)
    setBookingMsg({ type: '', text: '' })

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: bookingModal.packageId,
          message: bookingMessage || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setBookingMsg({ type: 'error', text: data.error || 'Gagal membuat booking' })
      } else {
        setBookingMsg({ type: 'success', text: 'Booking berhasil! Menunggu konfirmasi penyedia.' })
        setTimeout(() => closeModal(), 2000)
      }
    } catch {
      setBookingMsg({ type: 'error', text: 'Gagal menghubungi server' })
    } finally {
      setBookingLoading(false)
    }
  }

  const tabs = [
    { key: 'paket', label: 'Semua Paket' },
    { key: 'riwayat', label: 'Booking Saya' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Topbar */}
      <nav className="bg-[#1C3A2B] text-white px-6 py-4 flex justify-between items-center">
        <span className="font-serif font-bold italic text-lg">Nusantara Trails</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">Halo, {turisName}!</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-[#C4622D] hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif font-bold text-[#1C3A2B] mb-6">
          Temukan Paket Wisata
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-[#1C3A2B]/20">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#C4622D] text-[#C4622D]'
                  : 'text-[#1C3A2B]/50 hover:text-[#1C3A2B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-[#1C3A2B]/50 py-12">Memuat...</p>
        )}

        {/* Tab: Semua Paket */}
        {activeTab === 'paket' && !loading && (
          <div>
            {packages.length === 0 ? (
              <p className="text-[#1C3A2B]/50 py-8 text-center">Belum ada paket wisata tersedia</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white shadow-sm flex flex-col">
                    {pkg.imagePath ? (
                      <img
                        src={pkg.imagePath}
                        alt={pkg.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-[#1C3A2B]/10 flex items-center justify-center">
                        <span className="text-[#1C3A2B]/30 text-sm">Tidak ada foto</span>
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#C4622D] mb-1">
                        {pkg.destination.name}
                      </span>
                      <h3 className="font-serif font-bold text-[#1C3A2B] text-lg leading-tight mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-sm text-[#1C3A2B]/60 line-clamp-2 mb-3 flex-1">
                        {pkg.description}
                      </p>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-[#1C3A2B]/60">⏱ {pkg.duration}</span>
                        <span className="font-bold text-[#C4622D] text-base">{formatRupiah(pkg.price)}</span>
                      </div>

                      <p className="text-xs text-[#1C3A2B]/40 mb-4">
                        oleh {pkg.provider.name}
                      </p>

                      <button
                        onClick={() => openBookingModal(pkg)}
                        className="w-full bg-[#1C3A2B] text-white py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-[#C4622D] transition-colors"
                      >
                        Booking Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Riwayat Booking */}
        {activeTab === 'riwayat' && !loading && (
          <div>
            <h2 className="text-lg font-bold text-[#1C3A2B] mb-4">
              Riwayat Booking ({myBookings.length})
            </h2>
            {myBookings.length === 0 ? (
              <p className="text-[#1C3A2B]/50 py-8 text-center">
                Belum ada booking. Mulai pesan paket wisata!
              </p>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div key={b.id} className="bg-white shadow-sm p-6 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#1C3A2B]">{b.package.title}</h3>
                      <p className="text-sm text-[#1C3A2B]/60 mt-1">
                        {b.package.destination.name} · oleh {b.package.provider.name}
                      </p>
                      <p className="text-[#C4622D] font-bold mt-1">{formatRupiah(b.package.price)}</p>
                      {b.message && (
                        <p className="text-sm text-[#1C3A2B]/60 mt-2 italic">Pesan: "{b.message}"</p>
                      )}
                      <p className="text-xs text-[#1C3A2B]/40 mt-2">
                        {new Date(b.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <BookingStatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Booking */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md p-8 shadow-xl">
            <h2 className="text-xl font-serif font-bold text-[#1C3A2B] mb-2">
              Konfirmasi Booking
            </h2>
            <p className="text-sm text-[#1C3A2B]/60 mb-6">
              Anda akan booking: <strong>{bookingModal.packageTitle}</strong>
            </p>

            {bookingMsg.text && (
              <div className={`mb-4 p-3 rounded text-sm ${
                bookingMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {bookingMsg.text}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Pesan untuk Penyedia (opsional)
                </label>
                <textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C4622D]"
                  placeholder="Jumlah peserta, tanggal preferensi, dll..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 bg-[#1C3A2B] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#C4622D] transition-colors disabled:opacity-50"
                >
                  {bookingLoading ? 'Memproses...' : 'Kirim Booking'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-[#1C3A2B]/20 text-[#1C3A2B] py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
