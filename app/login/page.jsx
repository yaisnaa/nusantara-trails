'use client'

// Halaman login menggunakan NextAuth signIn
// Redirect berdasarkan role setelah login berhasil
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // Ambil session untuk mengetahui role dan redirect yang tepat
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()

        const role = session?.user?.role

        if (role === 'SUPERADMIN') {
          router.push('/admin')
        } else if (role === 'PENYEDIA') {
          router.push('/dashboard/penyedia')
        } else {
          router.push('/dashboard/turis')
        }

        router.refresh()
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
            Masuk
          </h1>
          <p className="mt-2 text-sm text-[#1C3A2B]/60">
            Lanjutkan perjalanan Anda
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-sm border-t-4 border-[#C4622D] p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full border border-[#1C3A2B]/20 px-4 py-3 text-sm text-[#1C3A2B] focus:outline-none focus:border-[#C4622D] transition-colors"
                placeholder="Password Anda"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C3A2B] text-[#F5F0E8] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#C4622D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Masuk...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-sm text-[#1C3A2B]/60">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#C4622D] font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
