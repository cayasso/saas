import slugify from 'slugify'

export const isSlug = text => {
  return text ? /^[a-z\d]+(?:-[a-z\d]+)*$/.test(text) : false
}

export default (text = '') =>
  slugify(text, {
    replacement: '-',
    remove: null,
    lower: true
  })
