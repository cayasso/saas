import basicAuth from 'basic-auth'
import { createError, getSubdomains, getCompany } from 'server/lib/utils'
import * as cookies from 'shared/lib/cookies'

export const getRequestToken = request => {
  let { token } = request.cookies

  if (!token) {
    const { name, password } = basicAuth(request) || {}

    if (name && password) {
      return { name, token: password }
    }

    const bearer = request.headers.authorization
    if (bearer) token = bearer.replace(/bearer /i, '')
  }

  return { token }
}

export const getRequestCompany = request => {
  const { scope } = request.cookies
  return { scope }
}

export const getRequestAudience = req => {
  const subdomains = getSubdomains(req)
  const [audience] = subdomains.reverse()
  return audience === 'manager' || audience === 'candidate' ? audience : null
}

export const createAuth = ({ api }) => fn => async (req, res) => {
  req.auth = false

  try {
    const { token } = getRequestToken(req)

    if (!token) {
      throw createError('Not authorized', 401)
    }

    const creds = await api.auth.verifyToken(token)
    const user = await api.users.fetch({ id: creds._id })

    req.user = { ...creds, ...user, scope }
    req.token = token
    req.auth = true
  } catch (error) {
    console.log(error)
    throw createError('Not authorized', 401)
  }

  return fn(req, res)
}
