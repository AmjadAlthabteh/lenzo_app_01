import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUserId = (session.user as any).id

    // Check permission
    const canManageRoles = await hasPermission(adminUserId, 'user:manage:roles')

    if (!canManageRoles) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { role } = await req.json()
    const validRoles = ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const targetUserId = params.userId

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    await logActivity({
      userId: adminUserId,
      action: 'user.role.updated',
      entityType: 'user',
      entityId: targetUserId,
      metadata: { newRole: role, targetUser: updatedUser.email },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error: any) {
    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}
