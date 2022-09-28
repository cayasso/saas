import * as qs from 'client/lib/qs'
import { getHost } from 'shared/lib/utils'

const send = async ({
  path,
  body,
  query,
  headers = {},
  method = 'GET',
  csv = false,
}) => {
  headers = csv
    ? {}
    : {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      }

  try {
    body = body && !csv ? JSON.stringify(body) : body
  } catch (error) {
    console.error(error)
  }

  let url = /https?/.test(path) ? path : `${getHost()}/api${path}`

  if (query && Object.keys(query).length > 0) {
    url += (url.includes('?') ? '&' : '?') + qs.format(query)
  }

  try {
    const response = await fetch(url, { body, method, headers })
    const type = headers['Content-Type'] || ''

    if (response.status >= 200 && response.status < 300) {
      return type.includes('text') ? response.text() : response.json()
    }

    if (response.status === 401) {
      throw new Error('Unauthorized')
    }

    const error = await response.json()
    throw new Error(error.message || response.statusText)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default send
