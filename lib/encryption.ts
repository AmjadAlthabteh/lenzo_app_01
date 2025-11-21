import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'default-secret-key-change-in-production'

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function encryptJSON(data: any): string {
  return encrypt(JSON.stringify(data))
}

export function decryptJSON<T = any>(ciphertext: string): T {
  return JSON.parse(decrypt(ciphertext))
}

export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString()
}
