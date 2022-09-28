export const get = (key, defaults) => {
  try {
    const data = localStorage.getItem(key)
    if (!data) return defaults
    else return JSON.parse(data)
  } catch (error) {
    return undefined
  }
}

export const set = (key, data) => {
  try {
    data = JSON.stringify(data)
    localStorage.setItem(key, data)
  } catch (error) {
    console.log(error)
  }
}

export const del = key => {
  localStorage.removeItem(key)
}

export const clear = () => {
  localStorage.clear()
}
