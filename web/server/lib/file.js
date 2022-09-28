import stream from 'stream'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

export default options => {
  const { accessKey, secretKey, bucket, region } = options.aws

  const client = new S3Client({
    Bucket: bucket,
    signatureVersion: 'v4',
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  })

  const uploadStream = ({ key }) => {
    const pass = new stream.PassThrough()

    const upload = new Upload({
      client,
      params: {
        Key: key,
        Body: pass,
        Bucket: bucket,
      },
    })

    return { stream: pass, promise: upload.done() }
  }

  return {
    uploadStream,
  }
}
