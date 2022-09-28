export const buffer = async stream => {
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const createError = (message, code = 400) => {
  const error = new Error(message)
  error.statusCode = code
  return error
}

export const λ = fn => async (req, res) => {
  try {
    const data = await fn(req, res)
    res.statusCode = 200
    res.json(data)
  } catch (error) {
    res.statusCode = error.statusCode || 500

    if (error.statusCode === 401) {
      return res.json({
        error: error.message,
        code: error.statusCode,
      })
    }

    res.json({
      error: true,
      status: res.statusCode,
      message: error.message,
    })

    console.error(error.message)
  }
}
