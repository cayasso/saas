import { useState, useEffect } from 'react'
import { watch, state as initialState } from 'client/lib/online'

export const useOnline = () => {
  const [state, setState] = useState(initialState)
  useEffect(() => watch(setState), [])
  return state
}
