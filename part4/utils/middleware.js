const logger = require('./logger')

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _req, res, next) => {
  logger.error(error)

  if (error.name === 'CastError' || error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  else if (error.name === 'NotFoundError') {
    return res.status(404).send({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'invalid token' })
  }
  else if (error.name === 'TokenExpiredError') {
    return res.status(401).send({ error: 'token expired' })
  }
  next(error)
}

module.exports = {
  unknownEndpoint, errorHandler
}