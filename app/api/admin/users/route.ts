import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Check admin permission
    const canAccess = await hasPermission(userId, 'admin:access')

    if (!canAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        locked: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    )
  }
}
