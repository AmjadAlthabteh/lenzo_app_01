import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { logActivity } from '@/lib/activity'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to disable 2FA' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      )
    }

    // Verify password
    if (user.password) {
      const isValidPassword = await verifyPassword(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        )
      }
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    })

    await logActivity({
      userId,
      action: '2fa.disabled',
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been disabled',
    })
  } catch (error: any) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA', details: error.message },
      { status: 500 }
    )
  }
}
