import { S3Client } from '@aws-sdk/client-s3'

export function getS3() {
  const region = process.env.AWS_REGION || 'us-east-1'
  return new S3Client({ region })
}

export function getBucket() {
  const bucket = process.env.S3_BUCKET
  if (!bucket) throw new Error('Missing S3_BUCKET')
  return bucket
}

