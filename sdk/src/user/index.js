import { pick, isEmpty } from 'lodash-es'
import { createError, isPhone } from '../lib/utils.js'
import { validate } from '../lib/validate.js'
import schema from './schema.js'

export default ({ db }) => {
  /**
   * Create collection indexes.
   *
   * @return {Promise}
   * @api private
   */

  const createIndex = async () => {
    try {
      const users = await db.get('users')
      await users.createIndex({ email: 1 }, { unique: 1 })
    } catch (error) {}
  }

  /**
   * Normalize account data.
   *
   * @param {Object} data
   * @return {Object}
   * @api private
   */

  const normalize = data => {
    return {
      ...data,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  }

  /**
   * Check if user exist.
   *
   * @param {String} email
   * @return {Promise}
   * @api private
   */

  const isExisting = async email => {
    return Boolean(await fetchByEmail(email))
  }

  /**
   * Fetch user by email.
   *
   * @param {String} email
   * @return {Promise}
   * @api public
   */

  const fetchByEmail = async email => {
    const users = await db.get('users')
    return users.findOne({ email })
  }

  /**
   * Fetch users.
   *
   * @param {Object} data
   * @return {Promise}
   * @api public
   */

  const fetch = async ({
    user,
    id,
    email,
    sort = '-_id',
    limit = 1000,
    page = 0,
    ...query
  } = {}) => {
    const users = await db.get('users')

    let res

    if (email) {
      res = await users.findOne({ email })
    } else {
      res = id
        ? await users.findById(id)
        : await users.findMany(query, { limit, sort, page })
    }

    if (!res) {
      throw createError('Not found', 404)
    }

    return res
  }

  /**
   * Create user.
   *
   * @param {Object} data
   * @return {Promise}
   * @api public
   */

  const create = async ({ user, ...data }) => {
    const users = await db.get('users')

    if ('phone' in data && !isPhone(data.phone)) {
      throw createError('Invalid mobile number')
    }

    if (await isExisting(data.email)) {
      throw createError('Already exist')
    }

    data = normalize(data)
    validate(schema, data)
    return users.insertOne(data)
  }

  /**
   * Update user.
   *
   * @param {Object} data
   * @return {Promise}
   * @api public
   */

  const update = async ({ user, id, ...data }) => {
    const users = await db.get('users')

    if (!id) {
      throw createError('Invalid id')
    }

    const doc = await users.findById(id)

    if (!doc) {
      throw createError('Not found', 404)
    }

    if (data.phone && !isPhone(data.phone)) {
      throw createError('Invalid mobile number')
    }

    data = pick(data, ['name', 'phone'])

    if (isEmpty(data)) {
      return doc
    }

    data.updated = new Date().toISOString()
    validate(schema, { ...doc, ...data })
    return users.updateById(id, data)
  }

  /**
   * Delete user.
   *
   * @param {Object} data
   * @return {Promise}
   * @api public
   */

  const destroy = async ({ user, id, ...data }) => {
    const users = await db.get('users')
    return users.deleteById(id, data)
  }

  createIndex().catch(console.error)

  return { fetch, fetchByEmail, create, update, destroy }
}
