import { TOTP, Secret } from 'otpauth'
import QRCode from 'qrcode'
import { encrypt, decrypt } from './encryption'

export async function generateTOTPSecret(userEmail: string) {
  const secret = new Secret({ size: 20 })
  const totp = new TOTP({
    issuer: 'Lenso',
    label: userEmail,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  })

  const uri = totp.toString()
  const qrCode = await QRCode.toDataURL(uri)

  return {
    secret: secret.base32,
    encryptedSecret: encrypt(secret.base32),
    qrCode,
    uri,
  }
}

export function verifyTOTPToken(encryptedSecret: string, token: string): boolean {
  try {
    const secretBase32 = decrypt(encryptedSecret)
    const secret = Secret.fromBase32(secretBase32)

    const totp = new TOTP({
      secret,
      digits: 6,
      period: 30,
    })

    const delta = totp.validate({ token, window: 1 })
    return delta !== null
  } catch (error) {
    console.error('TOTP verification error:', error)
    return false
  }
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  const bcrypt = require('bcryptjs')
  const hashedCodes = await Promise.all(codes.map(code => bcrypt.hash(code, 10)))
  return hashedCodes
}

export async function verifyBackupCode(
  code: string,
  hashedCodes: string[]
): Promise<{ valid: boolean; remainingCodes: string[] }> {
  const bcrypt = require('bcryptjs')

  for (let i = 0; i < hashedCodes.length; i++) {
    const isValid = await bcrypt.compare(code, hashedCodes[i])
    if (isValid) {
      const remainingCodes = hashedCodes.filter((_, index) => index !== i)
      return { valid: true, remainingCodes }
    }
  }

  return { valid: false, remainingCodes: hashedCodes }
}
