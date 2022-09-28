import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { createError } from './utils.js'

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  // coerceTypes: true,
  allowUnionTypes: true,
  removeAdditional: true
})

addFormats(ajv)

const sanitize = data => (data ? `${data.replace('.', '')}.` : '')

const getLastSegment = path => {
  const segments = path.split('/')
  return segments.pop()
}

const parseValidation = error => {
  switch (error.keyword) {
    case 'type': {
      const prop = getLastSegment(error.instancePath)
      const type = error.params.type
      return `Invalid property '${prop}' type, must be ${type}`
    }
    case 'additionalProperties': {
      const prop = error.params.additionalProperty
      return `Invalid extra property found: ${prop}`
    }
    case 'required': {
      const prop =
        sanitize(error.dataPath) + error.params.missingProperty.replace('.', '')
      return `Missing required property: ${prop}`
    }

    case 'enum': {
      const prop = getLastSegment(error.instancePath)
      return `'${prop}' ${error.message}: ${error.params.allowedValues.join(
        ', '
      )}`
    }

    case 'format': {
      const prop = getLastSegment(error.instancePath)
      const format = error.params.format
      return `Property '${prop}' must match ${format}`
    }

    case 'anyOf':
      return 'At least one property is required'
    case 'minItems':
    case 'maxItems':
    case 'minLength':
    case 'maxLength':
    case 'pattern':
      return `Property ${
        error.dataPath
          ? error.dataPath
          : error.instancePath
          ? getLastSegment(error.instancePath)
          : 'undefined'
      } ${error.message}`
    default:
      return 'Unknown error'
  }
}

const formatErrors = errors =>
  errors.map(error => ({ ...error, message: parseValidation(error) }))

export const validate = (schema, data) => {
  try {
    const valid = ajv.validate(schema, data)

    if (!valid) {
      throw formatErrors(ajv.errors)[0]
    }

    return valid
  } catch (error) {
    throw createError(error.message)
  }
}
