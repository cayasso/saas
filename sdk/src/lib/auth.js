'use strict'

import ms from 'ms'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { createError, generateId, isEmail } from './utils.js'

const ts = time => {
  return Date.now() + ms(time)
}

export const generateToken = (len = 12) => {
  return crypto.randomBytes(len).toString('hex')
}

export const generateCode = (len = 6) => {
  return Math.random()
    .toString()
    .substr(2, len)
}

export const createTokenData = ({ to, ttl }) => {
  return {
    _id: generateId(),
    cid: generateToken(),
    uid: isEmail(to) ? (to || '').toLowerCase() : to,
    ttl: ts(ttl),
    code: generateCode(),
    confirmed: false
  }
}

export const createToken = async (data, { secret, ttl } = {}) => {
  return new Promise((resolve, reject) => {
    jwt.sign(data, secret, { expiresIn: ts(ttl) }, (error, token) => {
      if (error) reject(error)
      else resolve(token)
    })
  })
}

export const verifyToken = (token, secret, options = {}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (error, object) => {
      if (error) reject(createError('Invalid access token', 401))
      else resolve(object)
    })
  })
}
