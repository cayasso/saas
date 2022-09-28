import * as AWS from '@aws-sdk/client-ses'
import { isString } from 'lodash-es'
import { htmlToText } from 'nodemailer-html-to-text'
import { createTransport } from 'nodemailer'
import { createI18n } from 'shared/lib/i18n'
import { createError } from 'server/lib/utils'
import readTemplates from 'server/lib/template'

const templates = { es: null, en: null }

const getMetadata = (
  { template, locale, ...data } = {},
  { from, replyTo } = {}
) => {
  from = data.from || from
  const i18n = createI18n(locale)

  const templates = {
    pass: {
      title: i18n`BillCR`,
      from: i18n`BillCR <${from}>`,
      replyTo: i18n`BillCR <${replyTo}>`,
      subject: i18n`BillCR: QR ${data.arrivalDate}`,
    },
    'pass-resend': {
      title: i18n`BillCR`,
      from: i18n`BillCR <${from}>`,
      replyTo: i18n`BillCR <${replyTo}>`,
      subject: i18n`BillCR: QR ${data.arrivalDate}`,
    },
    confirm: {
      title: i18n`Confirmación`,
      from: i18n`BillCR <${from}>`,
      replyTo: i18n`BillCR <${replyTo}>`,
      subject: i18n`BillCR: Confirmación de acceso (código: "${data.code}")`,
    },
    welcome: {
      title: i18n`Welcome`,
      from: i18n`BillCR <${from}>`,
      replyTo: i18n`BillCR <${replyTo}>`,
      subject: i18n`BillCR: Confirmación de acceso (código: "${data.code}")`,
    },
    message: {
      title: i18n`Mensaje BillCR`,
      from: i18n`BillCR <${from}>`,
      replyTo: i18n`BillCR <${replyTo}>`,
      subject: i18n`Tienes un mensaje directo (${Date.now()})`,
    },
    contact: {
      title: i18n`Mensaje de contacto`,
      from: i18n`${data.name} <${from}>`,
      replyTo: i18n`${data.name} <${from}>`,
      subject: i18n`BillCR: Nuevo contacto ${data.name}`,
    },
  }

  return templates[template] || {}
}

export default (options = {}) => {
  const { accessKey, secretKey, region } = options.aws

  const ses = new AWS.SES({
    region,
    apiVersion: '2010-12-01',
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  })

  const client = createTransport({ SES: { ses, aws: AWS }, sendingRate: 1 })

  client.use('compile', htmlToText())

  const send = async data => {
    if (options.env === 'test') {
      return {}
    }

    let { to, cc, locale = 'es', attachments = [] } = data
    const host = data.host || options.host

    if (!templates[locale]) {
      templates[locale] = await readTemplates(locale)
    }

    to = to || data.email

    if (!isString(data.template)) {
      throw createError('Invalid template.')
    }

    const template = templates[locale][data.template]

    if (!template) {
      throw createError('Template not found.')
    }

    const { layout } = templates[locale]

    if (!layout) {
      throw createError('Invalid template layout.')
    }

    const metadata = getMetadata(data, options)

    if (!metadata) {
      throw createError('Invalid template metadata')
    }

    const year = new Date().getFullYear()
    const { from, title, replyTo, subject } = metadata
    const content = template({ ...data, host })
    const html = layout({ title, content, host, year })
    console.log('DATA', from, to, subject)

    return client.sendMail({
      html,
      from,
      to,
      cc,
      replyTo,
      subject,
      attachments,
    })
  }

  return { send }
}
