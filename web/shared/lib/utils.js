const EMAIL_RE = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

export const isEmail = email => {
  if (!email || typeof email !== 'string') return false
  const parts = email.split('@')
  if (parts.length !== 2) return false
  const [account, address] = parts
  if (account.length > 64) return false
  else if (address.length > 255) return false
  const domainParts = address.split('.')
  if (domainParts.some(part => part.length > 63)) return false
  if (!EMAIL_RE.test(email)) return false
  return true
}

export const createError = (message, code = 400) => {
  const error = new Error(message)
  error.statusCode = code
  return error
}

export const getHost = ctx => {
  if (ctx) {
    const { req } = ctx
    const protocol = req.protocol ? req.protocol : `http`
    return `${protocol}://${req.headers.host}`
  }

  const r = window.location.href.match(/^(https?:)?\/\/[^/]+/i)
  return r ? r[0] : ''
}
