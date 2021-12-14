const mongoose = require('mongoose')
const config = require('./utils/config')
const cors = require('cors')
const express = require('express')
require('express-async-errors')
const blogsRouter = require('./controllers/blog')
const logger = require('./utils/logger')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')

const app = express()

logger.info(`Connecting to ${config.MONGODB_URI}`)
mongoose
  .connect(config.MONGODB_URI.replace('MONGODB_PASS', config.MONGODB_PASS))
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error(`Error connecting to MongoDB: ${error.message}`)
  })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
