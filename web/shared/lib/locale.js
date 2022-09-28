import * as cookies from 'shared/lib/cookies'
import en from 'shared/translations/en.json'
import es from 'shared/translations/es.json'

export const DEFAULT_LOCALE = 'en'

export const locales = { en, es }

export const get = ctx => {
  return cookies.get('locale', ctx)
}

export const set = (locale, ctx) => {
  cookies.set('locale', locale, ctx)
}

export const getNavigatorLocale = () => {
  const keys = new Set(Object.keys(locales))

  return (
    [
      ...(navigator.languages || []),
      navigator.language,
      navigator.browserLanguage,
      navigator.userLanguage,
      navigator.systemLanguage,
    ]
      .filter(Boolean)
      .map(locale => locale.substr(0, 2))
      .find(locale => keys.has(locale)) || DEFAULT_LOCALE
  )
}

export const getLocale = ctx => {
  if (ctx) return get(ctx)
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return get() || getNavigatorLocale() || DEFAULT_LOCALE
}
