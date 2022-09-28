import { useRef, useState, useEffect, useContext, createElement } from 'react'
import * as api from 'client/data'
import { AuthContext } from 'client/context'
import * as storage from 'client/lib/storage'
import { isEmail } from 'shared/lib/utils'
import i18n from 'shared/lib/i18n'
import { useSharedState } from 'client/hooks/state'

const initialState = {
  user: null,
}

export const AuthProvider = ({ children, session }) => {
  const value = useAuth(session)
  return createElement(AuthContext.Provider, { value }, children)
}

export const useAuth = (session = initialState) => {
  const context = useContext(AuthContext)
  const [state, update] = useSharedState('auth', session)

  const setState = (data = {}) => {
    update(state => ({ ...state, ...data }))
  }

  const [loading, setLoading] = useState(true)
  const timer = useRef(null)

  useEffect(() => {
    if (!context) restore()
  }, [context])

  const restore = async () => {
    try {
      if (session.user) {
        const user = await api.me.fetch()
        setState({ user })
      }

      storage.set('csrf', session.csrf)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const startVerification = data => {
    timer.current = setInterval(verify, 3000, data)
  }

  const setSession = (session = {}) => {
    setState({ user: session.user })
    cancel()
    return session
  }

  const verify = async ({ expires, ...data }) => {
    try {
      if (Date.now() > expires) {
        setState({ expired: true })
        return cancel()
      }

      const session = await api.auth.verify(data)
      return setSession(session)
    } catch (error) {
      console.log('ERROR', error)
    }
  }

  const signin = async ({ email }) => {
    if (!isEmail(email)) {
      throw new Error(i18n`Invalid email`)
    }

    try {
      setState({ expired: false })
      const session = await api.auth.signin({ email })
      setState({ ...session, verifying: true })
      startVerification(session)
    } catch (error) {
      cancel()
      throw error
    }
  }

  const cancel = () => {
    clearInterval(timer.current)
    setState({ verifying: false, code: null })
  }

  const signout = () => {
    api.auth.signout()
  }

  return context
    ? context
    : { ...state, signin, signout, verify, cancel, loading }
}

export const useSession = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider')
  }

  const { user } = useAuth()
  return { user }
}
