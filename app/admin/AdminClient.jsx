'use client'

// Komponen client untuk halaman admin
// Mengelola state dan interaksi approve/reject user & booking
import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'

// Format angka menjadi format Rupiah
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

// Badge warna untuk status
function StatusBadge({ status }) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    APPROVED: 'bg-green-100 text-green-800',
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export default function AdminClient({ adminName }) {
  const [activeTab, setActiveTab] = useState('users')
  const [pendingUsers, setPendingUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  // Fetch data sesuai tab aktif
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users')
        setPendingUsers(await res.json())
      } else if (activeTab === 'bookings') {
        const res = await fetch('/api/admin/bookings')
        setBookings(await res.json())
      } else if (activeTab === 'packages') {
        const res = await fetch('/api/admin/packages')
        setPackages(await res.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Approve atau reject user
  async function handleUserAction(userId, action) {
    setActionLoading(`user-${userId}-${action}`)
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      // Hapus user dari list setelah action
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    } finally {
      setActionLoading(null)
    }
  }

  const tabs = [
    { key: 'users', label: 'User Pending' },
    { key: 'bookings', label: 'Semua Booking' },
    { key: 'packages', label: 'Semua Paket' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Topbar */}
      <nav className="bg-[#1C3A2B] text-white px-6 py-4 flex justify-between items-center">
        <span className="font-serif font-bold italic text-lg">Nusantara Trails — Admin</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">{adminName}</span>
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
          Dashboard Superadmin
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

        {loading ? (
          <p className="text-center text-[#1C3A2B]/50 py-12">Memuat data...</p>
        ) : (
          <>
            {/* Section: User Pending */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg font-bold text-[#1C3A2B] mb-4">
                  User Menunggu Persetujuan ({pendingUsers.length})
                </h2>
                {pendingUsers.length === 0 ? (
                  <p className="text-[#1C3A2B]/50 py-8 text-center">Tidak ada user yang menunggu persetujuan</p>
                ) : (
                  <div className="bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#1C3A2B] text-white">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Nama</th>
                          <th className="text-left px-4 py-3 font-medium">Email</th>
                          <th className="text-left px-4 py-3 font-medium">Role</th>
                          <th className="text-left px-4 py-3 font-medium">Tanggal Daftar</th>
                          <th className="text-left px-4 py-3 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-[#1C3A2B]">{user.name}</td>
                            <td className="px-4 py-3 text-[#1C3A2B]/70">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#1C3A2B]/60">
                              {new Date(user.createdAt).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUserAction(user.id, 'approve')}
                                  disabled={actionLoading !== null}
                                  className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'reject')}
                                  disabled={actionLoading !== null}
                                  className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Section: Semua Booking */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-lg font-bold text-[#1C3A2B] mb-4">
                  Semua Booking ({bookings.length})
                </h2>
                {bookings.length === 0 ? (
                  <p className="text-[#1C3A2B]/50 py-8 text-center">Belum ada booking</p>
                ) : (
                  <div className="bg-white shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#1C3A2B] text-white">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Turis</th>
                          <th className="text-left px-4 py-3 font-medium">Paket</th>
                          <th className="text-left px-4 py-3 font-medium">Penyedia</th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                          <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-[#1C3A2B]">{b.turis.name}</p>
                              <p className="text-xs text-[#1C3A2B]/50">{b.turis.email}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-[#1C3A2B]">{b.package.title}</p>
                              <p className="text-xs text-[#1C3A2B]/50">{b.package.destination.name}</p>
                            </td>
                            <td className="px-4 py-3 text-[#1C3A2B]/70">{b.package.provider.name}</td>
                            <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                            <td className="px-4 py-3 text-[#1C3A2B]/60">
                              {new Date(b.createdAt).toLocaleDateString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Section: Semua Paket */}
            {activeTab === 'packages' && (
              <div>
                <h2 className="text-lg font-bold text-[#1C3A2B] mb-4">
                  Semua Paket Wisata ({packages.length})
                </h2>
                {packages.length === 0 ? (
                  <p className="text-[#1C3A2B]/50 py-8 text-center">Belum ada paket wisata</p>
                ) : (
                  <div className="bg-white shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[#1C3A2B] text-white">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Judul</th>
                          <th className="text-left px-4 py-3 font-medium">Destinasi</th>
                          <th className="text-left px-4 py-3 font-medium">Penyedia</th>
                          <th className="text-left px-4 py-3 font-medium">Harga</th>
                          <th className="text-left px-4 py-3 font-medium">Durasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {packages.map((pkg) => (
                          <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-[#1C3A2B]">{pkg.title}</td>
                            <td className="px-4 py-3">
                              <p className="text-[#1C3A2B]">{pkg.destination.name}</p>
                              <p className="text-xs text-[#1C3A2B]/50">{pkg.destination.region}</p>
                            </td>
                            <td className="px-4 py-3 text-[#1C3A2B]/70">{pkg.provider.name}</td>
                            <td className="px-4 py-3 text-[#C4622D] font-bold">{formatRupiah(pkg.price)}</td>
                            <td className="px-4 py-3 text-[#1C3A2B]/70">{pkg.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
