import test from 'ava'
import { makeSdk } from '../utils/index.js'

let sdk = null

test.before(async () => {
  sdk = await makeSdk()
})

test('should create user verification code', async t => {
  const user = await sdk.makeUser({})
  const res = await sdk.auth.create({ to: user.email })

  t.truthy(res.code)
  t.truthy(res.hash)
})

test('should validate user verification code returning an access token', async t => {
  const user = await sdk.makeUser({})
  const { code, hash } = await sdk.auth.create({ to: user.email })
  const res = await sdk.auth.verify({ to: user.email, code, hash })

  t.truthy(res.token)
  t.truthy(res.user)
  t.is(String(res.user._id), String(user._id))
})

const accounts = [
  {
    _id: 'abc',
    name: 'abc',
    units: [{ _id: 'abc', name: 'abc' }]
  }
]
