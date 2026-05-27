'use client'

// Tombol logout — Client Component karena signOut perlu interaktivitas browser
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-deep-green hover:text-terracotta transition-colors uppercase tracking-widest text-sm font-medium"
    >
      Logout
    </button>
  )
}
