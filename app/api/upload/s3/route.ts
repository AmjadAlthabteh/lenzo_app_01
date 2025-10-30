export const runtime = 'nodejs'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getBucket, getS3 } from '@/lib/s3'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json()
    if (!filename || !contentType) return new Response('Bad request', { status: 400 })
    const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${filename.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const Bucket = getBucket()
    const s3 = getS3()
    const cmd = new PutObjectCommand({ Bucket, Key: key, ContentType: contentType })
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 })
    const publicUrl = `https://${Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
    return Response.json({ url, key, publicUrl })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Failed to get presigned URL' }), { status: 500 })
  }
}

