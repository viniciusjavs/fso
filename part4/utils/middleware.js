const logger = require('./logger')

const errorHandler = (error, _req, res, next) => {
  logger.error(error)

  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  else if (error.name === 'NotFoundError') {
    return res.status(404).send({ error: error.message })
  }
  next(error)
}

module.exports = errorHandler