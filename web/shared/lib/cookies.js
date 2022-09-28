import ms from 'ms'
import cookies from 'nookies'

export const get = (key, ctx = null) => {
  const cookie = cookies.get(ctx)
  return key ? cookie[key] : cookie
}

export const set = (key, value, ctx = null, opt = {}) => {
  if (opt && opt.ttl) {
    opt.maxAge = ms(opt.ttl) / 1000
    delete opt.ttl
  }

  return cookies.set(ctx, key, value, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    ...opt,
  })
}

export const del = (key, ctx = null, opt = {}) => {
  return cookies.destroy(ctx, key, { path: '/', ...opt })
}
