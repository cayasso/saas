import { get, patch } from 'client/lib/api'

export const fetch = (data = {}) => get(`/me`, data)
export const update = (data = {}) => patch('/me', data)
