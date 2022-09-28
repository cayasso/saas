import { getLocale, locales, set as setLocale } from './locale'

export const createI18n = (locale = 'en', locales = {}) => {
  locale = locale.substring(0, 2)

  const getKey = tpl => {
    const key = (acc, str, i) => `${str}\${${i}}${acc}`
    return tpl
      .slice(0, -1)
      .reduceRight(key, tpl[tpl.length - 1])
      .replace(/\r\n/g, '\n')
  }

  const i18n = (tpl, ...values) => {
    const key = getKey(tpl)
    const db = i18n.db[i18n.locale] || {}
    const str = db[key]

    if (!str) {
      const out = [tpl[0]]
      for (let i = 0, l = values.length; i < l; ++i) {
        out.push(values[i], tpl[i + 1])
      }

      return out.join('')
    }

    return str.replace(/\${(\d)}/g, (_, i) => values[Number(i)])
  }

  i18n.db = {}
  i18n.locales = locales

  i18n.t = key => {
    const db = (i18n.db || {})[i18n.locale] || {}
    return db[key]
  }

  i18n.set = locale => {
    if (!locale) return false
    locale = locale.substring(0, 2)

    if (!i18n.db[locale]) {
      if (!i18n.locales[locale]) return false
      i18n.db[locale] = i18n.locales[locale]
    }

    i18n.locale = locale

    if (typeof window !== 'undefined') {
      setLocale(locale)
    }
  }

  i18n.set(locale)
  return i18n
}

export default createI18n(getLocale(), locales)
