export default {
  tz: process.env.TIMEZONE || 'America/Costa_Rica',
  host: process.env.ADMIN_URL || 'http://localhost:3000',

  from: process.env.FROM_EMAIL || 'team@bill.cr',
  replyTo: process.env.REPLY_TO_EMAIL || 'team@bill.cr',

  api: {
    secret:
      process.env.API_SECRET_KEY || '61e69fc6-1a50-4f25-95cb-88def73ed76f',
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  aws: {
    accessKey: process.env.AWS_ACCESS_TOKEN,
    secretKey: process.env.AWS_SECRET_TOKEN,
    region: process.env.AWS_APP_REGION || 'us-east-1',
    bucket: process.env.AWS_APP_BUCKET || 'bill.cr',
  },
}
