import { λ, createError } from 'server/lib/utils'
import * as tokens from 'shared/lib/tokens'
import createApi from 'server/api'

const api = createApi()

const verify = async (req, res) => {
  const { user, token } = await api.auth.verify(req.query)
  tokens.set(token, { req, res })
  return { user, token }
}

export default λ(async (req, res) => {
  if (req.method !== 'GET') {
    throw createError('Not found', 404)
  }

  return verify(req, res)
})
