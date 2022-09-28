import { λ, createError } from 'server/lib/utils'
import { createAuth } from 'server/lib/auth'
import createApi from 'server/api'

const api = createApi()
const auth = createAuth({ api })

const fetch = async ({ user }) => {
  return user
}

const update = ({ user, body }) => {
  return api.users.update({ ...body, user, id: user._id })
}

export default λ(
  auth((req, res) => {
    switch (req.method) {
      case 'GET':
        return fetch(req, res)
      case 'PUT':
      case 'PATCH':
        return update(req, res)
      default:
    }

    throw createError('Not found', 404)
  })
)
