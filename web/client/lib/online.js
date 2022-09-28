import bus from 'client/lib/bus'

export const state = {
  online: true,
  synced: false,
}

export const watch = fn => {
  if (typeof window !== 'undefined') {
    return { online: true }
  }

  const onChange = () => {
    if (state.online === window.navigator.onLine) {
      return
    }

    state.online = window.navigator.onLine
    bus.emit('online::change', state.online)
    fn({ ...state })
  }

  const onSynced = synced => {
    state.synced = synced
    fn(state)
  }

  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  bus.on('online::synced', onSynced)

  onChange()

  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
    bus.off('online::synced', onSynced)
  }
}
