import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyTOTPToken } from '@/lib/twoFactor'
import { logActivity } from '@/lib/activity'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA setup not initiated. Please setup 2FA first.' },
        { status: 400 }
      )
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      )
    }

    // Verify token
    const isValid = verifyTOTPToken(user.twoFactorSecret, token)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
      },
    })

    await logActivity({
      userId,
      action: '2fa.enabled',
    })

    return NextResponse.json({
      success: true,
      message: '2FA has been successfully enabled',
    })
  } catch (error: any) {
    console.error('2FA enable error:', error)
    return NextResponse.json(
      { error: 'Failed to enable 2FA', details: error.message },
      { status: 500 }
    )
  }
}
