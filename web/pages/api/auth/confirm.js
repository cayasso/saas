import { λ, createError } from 'server/lib/utils'
import createApi from 'server/api'

const api = createApi()

const confirm = async ({ query }) => {
  await api.auth.confirm(query)
  return { ok: true }
}

export default λ(async (req, res) => {
  if (req.method !== 'GET') {
    throw createError('Not found', 404)
  }

  return confirm(req, res)
})
