// API endpoint approve/reject user oleh admin
// PATCH /api/admin/users/[id]
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  // Verifikasi sesi dan role SUPERADMIN
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPERADMIN') {
    return Response.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { action } = body

  if (!['approve', 'reject'].includes(action)) {
    return Response.json({ error: 'Action tidak valid' }, { status: 400 })
  }

  // Update status user berdasarkan action
  const newStatus = action === 'approve' ? 'ACTIVE' : 'REJECTED'

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, status: true },
  })

  return Response.json(updatedUser)
}
