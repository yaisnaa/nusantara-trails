'use client'

// Halaman registrasi user baru
// Menggunakan fetch ke POST /api/auth/register
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TURIS',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan')
      } else {
        setSuccess(data.message)
        setFormData({ name: '', email: '', password: '', role: 'TURIS' })
      }
    } catch {
      setError('Gagal menghubungi server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-serif font-bold text-[#1C3A2B] italic">
            Nusantara Trails
          </Link>
          <h1 className="mt-4 text-3xl font-serif font-bold text-[#1C3A2B]">
            Buat Akun
          </h1>
          <p className="mt-2 text-sm text-[#1C3A2B]/60">
            Daftarkan diri Anda untuk mulai menjelajah
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm border-t-4 border-[#C4622D] p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded">
              <strong>✓ {success}</strong>
              <p className="mt-1 text-green-700">Silakan tunggu konfirmasi dari admin sebelum login.</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm text-[#1C3A2B] focus:outline-none focus:border-[#C4622D] transition-colors"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm text-[#1C3A2B] focus:outline-none focus:border-[#C4622D] transition-colors"
                  placeholder="email@contoh.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm text-[#1C3A2B] focus:outline-none focus:border-[#C4622D] transition-colors"
                  placeholder="Minimal 8 karakter"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#1C3A2B] mb-2">
                  Daftar Sebagai
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm text-[#1C3A2B] focus:outline-none focus:border-[#C4622D] transition-colors bg-white"
                >
                  <option value="TURIS">Turis — Cari & booking paket wisata</option>
                  <option value="PENYEDIA">Penyedia Jasa — Upload & kelola paket</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C3A2B] text-[#F5F0E8] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#C4622D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            </form>
          )}

          {success && (
            <div className="text-center mt-4">
              <Link
                href="/login"
                className="text-sm text-[#C4622D] underline underline-offset-2 hover:text-[#1C3A2B]"
              >
                Kembali ke halaman login
              </Link>
            </div>
          )}
        </div>

        {!success && (
          <p className="text-center mt-4 text-sm text-[#1C3A2B]/60">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#C4622D] font-semibold hover:underline">
              Login di sini
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
