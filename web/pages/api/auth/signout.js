import { λ, createError } from 'server/lib/utils'
import { createAuth } from 'server/lib/auth'
import * as tokens from 'shared/lib/tokens'
import * as cookies from 'shared/lib/cookies'
import createApi from 'server/api'

const api = createApi()
const auth = createAuth({ api })

export default λ(
  auth((req, res) => {
    if (req.method !== 'POST') {
      throw createError('Not found', 404)
    }

    tokens.del({ req, res })
    cookies.del('scope', { req, res })
    return { ok: true }
  })
)
