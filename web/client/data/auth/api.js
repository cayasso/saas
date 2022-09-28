import { get, post, del } from 'client/lib/api'

export const verify = data => get('/auth/verify', data)
export const signin = data => post('/auth/signin', data)
export const signout = data => del('/auth/signout', data)
