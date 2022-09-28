export const getExtension = (name, delimiter = '.') => {
  const ext = name.slice(((name.lastIndexOf(delimiter) - 1) >>> 0) + 2)
  return ext.toLowerCase()
}

export const getFileName = (url = '') => {
  return url.split('/').pop().split('#')[0].split('?')[0]
}

export const getName = (url) => {
  return getFileName(url).replace(/\.[^/.]+$/, '')
}

export const getPrefix = (name, delimiter = '_') => {
  const parts = name.split(delimiter)
  return parts[0]
}

export const getKey = (name) => {
  return name.replace(/\.[^/.]+$/, '')
}
