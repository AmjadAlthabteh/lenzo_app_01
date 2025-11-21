import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTOTPSecret, generateBackupCodes, hashBackupCodes } from '@/lib/twoFactor'
import { encryptJSON } from '@/lib/encryption'
import { logActivity } from '@/lib/activity'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Check if 2FA is already enabled
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (user?.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      )
    }

    // Generate TOTP secret
    const { secret, encryptedSecret, qrCode, uri } = await generateTOTPSecret(
      session.user.email || ''
    )

    // Generate backup codes
    const backupCodes = generateBackupCodes()
    const hashedBackupCodes = await hashBackupCodes(backupCodes)

    // Store encrypted secret temporarily (user needs to verify before enabling)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: encryptedSecret,
        backupCodes: encryptJSON(hashedBackupCodes),
      },
    })

    await logActivity({
      userId,
      action: '2fa.setup.initiated',
    })

    return NextResponse.json({
      success: true,
      qrCode,
      secret, // Show once for manual entry
      backupCodes, // Show once - user must save these
    })
  } catch (error: any) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup 2FA', details: error.message },
      { status: 500 }
    )
  }
}
