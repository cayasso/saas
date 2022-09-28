const mitt = () => {
  let all = Object.create(null)

  const on = (type, fn) => {
    ;(all[type] || (all[type] = [])).push(fn)
  }

  const off = (type, fn) => {
    if (all[type]) {
      all[type].splice(all[type].indexOf(fn) >>> 0, 1)
    }

    if (!type) {
      all = Object.create(null)
    }
  }

  const emit = (type, a, b, c) => {
    ;(all[type] || []).slice().map(fn => fn(a, b, c))
    ;(all['*'] || []).slice().map(fn => fn(type, a, b, c))
  }

  return { on, off, emit }
}

export default mitt()
