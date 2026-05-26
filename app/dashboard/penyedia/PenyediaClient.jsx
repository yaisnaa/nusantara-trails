'use client'

// Komponen client untuk dashboard penyedia
// Mengelola upload paket wisata, list paket, dan approve/reject booking
import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

function StatusBadge({ status }) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export default function PenyediaClient({ providerId, providerName }) {
  const [activeTab, setActiveTab] = useState('upload')
  const [destinations, setDestinations] = useState([])
  const [myPackages, setMyPackages] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  // State form upload paket
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    destinationId: '',
    image: null,
  })
  const [formMsg, setFormMsg] = useState({ type: '', text: '' })
  const [uploading, setUploading] = useState(false)

  // Ambil daftar destinasi untuk dropdown
  useEffect(() => {
    fetch('/api/destinations')
      .then((r) => r.json())
      .then(setDestinations)
      .catch(console.error)
  }, [])

  const fetchPackages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/packages')
      const all = await res.json()
      // Filter hanya paket milik penyedia ini
      setMyPackages(all.filter((p) => p.provider.id === providerId))
    } finally {
      setLoading(false)
    }
  }, [providerId])

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
    if (activeTab === 'booking') fetchBookings()
  }, [activeTab, fetchPackages, fetchBookings])

  function handleFormChange(e) {
    if (e.target.name === 'image') {
      setForm((prev) => ({ ...prev, image: e.target.files[0] }))
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    setFormMsg({ type: '', text: '' })
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('price', form.price)
      fd.append('duration', form.duration)
      fd.append('destinationId', form.destinationId)
      if (form.image) fd.append('image', form.image)

      const res = await fetch('/api/packages', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setFormMsg({ type: 'error', text: data.error || 'Gagal mengupload paket' })
      } else {
        setFormMsg({ type: 'success', text: 'Paket wisata berhasil diupload!' })
        setForm({ title: '', description: '', price: '', duration: '', destinationId: '', image: null })
        // Reset file input
        document.getElementById('image-input').value = ''
      }
    } catch {
      setFormMsg({ type: 'error', text: 'Gagal menghubungi server' })
    } finally {
      setUploading(false)
    }
  }

  async function handleBookingAction(bookingId, action) {
    setActionLoading(`${bookingId}-${action}`)
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      // Update status di local state tanpa refetch
      setMyBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
            : b
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const tabs = [
    { key: 'upload', label: 'Upload Paket' },
    { key: 'paket', label: 'Paket Saya' },
    { key: 'booking', label: 'Kelola Booking' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Topbar */}
      <nav className="bg-[#1C3A2B] text-white px-6 py-4 flex justify-between items-center">
        <span className="font-serif font-bold italic text-lg">Nusantara Trails — Penyedia</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">{providerName}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-[#C4622D] hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif font-bold text-[#1C3A2B] mb-6">
          Dashboard Penyedia Jasa
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

        {/* Tab: Upload Paket */}
        {activeTab === 'upload' && (
          <div className="bg-white shadow-sm border-t-4 border-[#C4622D] p-8 max-w-2xl">
            <h2 className="text-lg font-bold text-[#1C3A2B] mb-6">Upload Paket Wisata Baru</h2>

            {formMsg.text && (
              <div className={`mb-4 p-3 rounded text-sm ${
                formMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Judul Paket
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C4622D]"
                  placeholder="Contoh: Paket Kawah Putih 2 Hari"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C4622D]"
                  placeholder="Jelaskan detail paket wisata..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                    Harga (Rupiah)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    min={0}
                    className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C4622D]"
                    placeholder="350000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                    Durasi
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C4622D]"
                    placeholder="2 hari 1 malam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Destinasi
                </label>
                <select
                  name="destinationId"
                  value={form.destinationId}
                  onChange={handleFormChange}
                  required
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm focus:outline-none focus:border-[#C4622D] bg-white"
                >
                  <option value="">-- Pilih Destinasi --</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Foto Paket (opsional, max 5MB)
                </label>
                <input
                  id="image-input"
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFormChange}
                  className="w-full text-sm text-[#1C3A2B] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#1C3A2B] file:text-white hover:file:bg-[#C4622D]"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#1C3A2B] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#C4622D] transition-colors disabled:opacity-50"
              >
                {uploading ? 'Mengupload...' : 'Upload Paket'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Paket Saya */}
        {activeTab === 'paket' && (
          <div>
            <h2 className="text-lg font-bold text-[#1C3A2B] mb-4">
              Paket Wisata Saya ({myPackages.length})
            </h2>
            {loading ? (
              <p className="text-center text-[#1C3A2B]/50 py-8">Memuat...</p>
            ) : myPackages.length === 0 ? (
              <p className="text-[#1C3A2B]/50 py-8 text-center">Belum ada paket. Upload paket pertama Anda!</p>
            ) : (
              <div className="grid gap-4">
                {myPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white shadow-sm p-6 flex gap-4">
                    {pkg.imagePath && (
                      <img
                        src={pkg.imagePath}
                        alt={pkg.title}
                        className="w-24 h-24 object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1C3A2B]">{pkg.title}</h3>
                      <p className="text-sm text-[#1C3A2B]/60 mt-1">
                        {pkg.destination.name} · {pkg.duration}
                      </p>
                      <p className="text-[#C4622D] font-bold mt-1">{formatRupiah(pkg.price)}</p>
                      <p className="text-sm text-[#1C3A2B]/70 mt-2 line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Kelola Booking */}
        {activeTab === 'booking' && (
          <div>
            <h2 className="text-lg font-bold text-[#1C3A2B] mb-4">
              Booking Masuk ({myBookings.length})
            </h2>
            {loading ? (
              <p className="text-center text-[#1C3A2B]/50 py-8">Memuat...</p>
            ) : myBookings.length === 0 ? (
              <p className="text-[#1C3A2B]/50 py-8 text-center">Belum ada booking masuk</p>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => (
                  <div key={b.id} className="bg-white shadow-sm p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#1C3A2B]">{b.turis.name}</p>
                        <p className="text-sm text-[#1C3A2B]/60">{b.turis.email}</p>
                        <p className="text-sm text-[#1C3A2B] mt-1">
                          Paket: <span className="font-medium">{b.package.title}</span>
                        </p>
                        {b.message && (
                          <p className="text-sm text-[#1C3A2B]/70 mt-1 italic">"{b.message}"</p>
                        )}
                        <p className="text-xs text-[#1C3A2B]/40 mt-2">
                          {new Date(b.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={b.status} />
                        {b.status === 'PENDING' && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleBookingAction(b.id, 'approve')}
                              disabled={actionLoading !== null}
                              className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleBookingAction(b.id, 'reject')}
                              disabled={actionLoading !== null}
                              className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
