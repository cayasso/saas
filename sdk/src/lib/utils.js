import { ObjectId } from 'mongodb'

const EMAIL_RE = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

export const isEmail = email => {
  if (!email) return false
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

export const generateId = () => {
  return String(new ObjectId())
}

export const createError = (message, code = 400) => {
  const error = new Error(message)
  error.code = code
  return error
}
