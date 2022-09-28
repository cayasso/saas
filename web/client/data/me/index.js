import * as api from 'client/data/me/api'

export const fetch = data => {
  return api.fetch(data)
}

export const update = data => {
  return api.update(data)
}
