import * as cons from './constants.js'

export default {
  title: 'User',
  type: 'object',
  required: ['email', 'created'],

  properties: {
    _id: {
      type: 'object'
    },

    locale: {
      type: 'string',
      enum: [...cons.LOCALES],
      default: 'en'
    },

    name: {
      type: 'string'
    },

    email: {
      type: 'string',
      format: 'email'
    },

    phone: {
      type: 'string'
    },

    loginCount: {
      type: 'number',
      default: 0
    },

    active: {
      type: 'boolean',
      default: true
    },

    created: {
      type: 'string',
      format: 'date-time'
    },

    updated: {
      type: 'string',
      format: 'date-time'
    }
  },
  additionalProperties: false
}
