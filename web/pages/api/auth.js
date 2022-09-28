import createAuth from '@saas/sdk'

const sdk = createAuth({})

export default async (req, res) => {
  const to = 'jb@lekinox.com'
  const creds = await sdk.auth.create(to)
  const [verificationToken, confirmationToken] = creds.tokens
  const conf = await sdk.auth.confirm(to, confirmationToken)
  console.log('conf', conf)
  const doc = await sdk.auth.verify(to, verificationToken)
  res.status(200).json(doc)
}
