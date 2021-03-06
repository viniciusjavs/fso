require('dotenv').config()

const MONGODB_PASS = process.env.NODE_ENV === 'dev'
  ? process.env.DEV_MONGODB_PASS
  : ''

const MONGODB_URI = process.env.NODE_ENV === 'dev'
  ? process.env.DEV_MONGODB_URI
  : ''

const LOAD_DB = process.env.LOAD_DB === 'true'

const JWT_SECRET = process.env.JWT_SECRET

const PORT = 4000

module.exports = {
  MONGODB_PASS,
  MONGODB_URI,
  LOAD_DB,
  JWT_SECRET,
  PORT
}
