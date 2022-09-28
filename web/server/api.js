import createSDK from '@saas/sdk'
import createEmail from 'server/lib/email'
import config from 'server/config'

export default (options = {}) => {
  const api = { ...config, ...options }
  const sdk = createSDK({ ...config, ...options })

  if (!api.email) {
    api.email = createEmail(api)
  }

  return { ...api, ...sdk }
}
