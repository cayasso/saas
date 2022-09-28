import render from 'lodash.template'
import locales from './templates'

export default async (locale = 'es') => {
  const templates = locales[locale]
  return Object.keys(templates).reduce((template, key) => {
    template[key] = render(templates[key].toString())
    return template
  }, {})
}
