import * as cookies from './cookies'

export const set = (token, ctx, { ttl = '30d', ...options } = {}) => {
  const params = {
    ttl,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    ...options,
  }

  return cookies.set('token', token, ctx, params)
}

export const get = ctx => {
  return cookies.get('token', ctx)
}

export const del = (ctx, options = {}) => {
  const params = { path: '/', ...options }
  return cookies.del('token', ctx, params)
}
