export default {
  audience: [],
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  mongo: process.env.MONGODB || 'mongodb://localhost/27017/unit',
  secret: process.env.SECRET || 'secret',
  tokenTTL: process.env.TOKEN_TTL || '60d',
  otpTTL: process.env.OTP_TTL || '5min'
}
