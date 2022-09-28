import req from 'client/lib/req'

export const get = (path, query, options = {}) => {
  return req({ path, query, method: 'GET', ...options })
}

export const post = (path, body, options = {}) => {
  return req({ path, method: 'POST', body, ...options })
}

export const put = (path, body, options = {}) => {
  return req({ path, method: 'PUT', body, ...options })
}

export const patch = (path, body, options = {}) => {
  return req({ path, method: 'PATCH', body, ...options })
}

export const del = (path, body, options = {}) => {
  return req({ path, method: 'DELETE', body, ...options })
}
