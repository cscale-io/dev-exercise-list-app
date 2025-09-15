import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.S3_BUCKET_NAME

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error(
    'Missing environments variables: AWS_REGION, AWS_ACCESS_KEY_ID ou AWS_SECRET_ACCESS_KEY',
  )
}

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType: string,
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  })

  try {
    await s3.send(command)
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
