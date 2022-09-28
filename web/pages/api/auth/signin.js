import { λ, createError } from 'server/lib/utils'
import createApi from 'server/api'

const api = createApi()

const signin = async req => {
  const { email } = req.body
  const exist = await api.users.fetchByEmail(email)

  if (!exist) {
    await api.users.create({ email })
  }

  const creds = await api.auth.create(email)

  await api.email.send({
    email,
    code: creds.code,
    token: creds.tokens[1],
    template: exist ? 'welcome' : 'confirm',
  })

  return { code: creds.code, token: creds.tokens[0] }
}

export default λ(async (req, res) => {
  if (req.method !== 'POST') {
    throw createError('Not found', 404)
  }
  ;``

  return signin(req, res)
})
