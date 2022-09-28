import auth from './auth/index.js'
import user from './user/index.js'
import createDB from './lib/db.js'
import config from './config.js'

export default (options = {}) => {
  const sdk = { ...config, ...options }

  if (!sdk.db) {
    sdk.db = createDB(sdk)
  }

  sdk.auth = auth(sdk)
  sdk.users = user(sdk)

  return sdk
}
