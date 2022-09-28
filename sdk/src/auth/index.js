import { isString } from 'lodash-es'
import { createError, isEmail } from '../lib/utils.js'
import { createToken, createTokenData, verifyToken } from '../lib/auth.js'

export default ({ db, secret, otpTTL, tokenTTL }) => {
  const createIndex = async () => {
    try {
      const tokens = await db.get('tokens', { castIds: false })
      tokens.createIndex({ ttl: 1 }, { expireAfterSeconds: 1 })
      tokens.createIndex({ cid: 1, uid: 1 })
    } catch (error) {}
  }

  /**
   * Create otp.
   *
   * @param {String} to
   * @param {String} ttl
   * @return {Promise}
   * @api public
   */

  const create = async (to, ttl = otpTTL) => {
    const users = await db.get('users')
    const tokens = await db.get('tokens', { castIds: false })

    const query = isEmail(to) ? { email: to.toLowerCase() } : { phone: to }
    const user = await users.findOne(query)

    if (!user) {
      throw createError('Not found', 404)
    }

    const data = await createTokenData({ to, ttl })

    const token = await tokens.insertOne({
      ...data,
      audience: 'admin',
      ttl: new Date(data.ttl)
    })

    return {
      code: token.code,
      tokens: [String(token._id), String(token.cid)]
    }
  }

  /**
   * Confirm confirmation token.
   *
   * @param {String} to
   * @param {String} token
   * @return {Promise}
   * @public
   */

  const confirm = async (to, token) => {
    const tokens = await db.get('tokens', { castIds: false })

    if (!token || !isString(token)) {
      throw createError('Invalid confirmation token')
    } else if (!isEmail(to)) {
      throw createError('Invalid credentials')
    }

    const doc = await tokens.findOne({ cid: token, uid: to.toLowerCase() })

    if (!doc) throw createError('Invalid confirmation token', 401)
    else if (doc.confirmed) throw createError('Invalid token', 401)

    await tokens.updateById(doc._id, { confirmed: true })

    return doc
  }

  /**
   * Verify verification token.
   *
   * @param {String} to
   * @param {String} token
   * @return {Promise}
   * @api public
   */

  const verify = async (to, token) => {
    const users = await db.get('users')
    const tokens = await db.get('tokens', { castIds: false })

    if (!token || !isString(token)) {
      throw createError('Invalid verification token', 401)
    } else if (!isEmail(to)) {
      throw createError('Invalid credentials', 401)
    }

    const doc = await tokens.findOne({
      _id: db.id(token),
      uid: to.toLowerCase()
    })

    if (!doc) {
      throw createError('Invalid verification token', 401)
    } else if (!doc.confirmed) {
      throw createError('Incomplete verification', 403)
    }

    const query = isEmail(to) ? { email: to.toLowerCase() } : { phone: to }

    let user = await users.findOne(query)

    if (!user) throw createError('Invalid user')

    await tokens.deleteById(doc._id)

    token = await createToken(
      { to },
      { secret, ttl: tokenTTL, audience: doc.audience }
    )

    user = await users.updateById(user._id, {
      $set: { updated: Date.now() },
      $inc: { loginCount: 1 }
    })

    return { user, token }
  }

  /**
   * Verify access token.
   *
   * @param {String} token
   * @param {Object} options
   * @return {Promise}
   * @api public
   */

  const validate = (token, options = {}) => {
    return verifyToken(token, secret, { ...options, audience })
  }

  createIndex().catch(console.log)

  return { create, verify, confirm, validate }
}
