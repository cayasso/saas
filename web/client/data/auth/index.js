import ms from 'ms'
import * as api from 'client/data/auth/api'
import * as cons from 'client/data/auth/constants'
import * as tokens from 'shared/lib/tokens'

export const signin = async (data = {}) => {
  const { email } = data
  const { token, code } = await api.signin({ email })
  const expires = Date.now() + ms(cons.VERIFICATION_TOKEN_TTL)
  return { email, token, code, expires }
}

export const verify = data => {
  return api.verify(data)
}

export const signout = data => {
  return api.signout(data)
}

export const isAuth = ctx => {
  const token = tokens.get(ctx)
  return Boolean(token)
}
