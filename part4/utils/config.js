require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_PASS = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_PASS
  : process.env.MONGODB_PASS
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const API_SECRET = process.env.NODE_ENV === 'test'
  ? process.env.TEST_API_SECRET
  : process.env.API_SECRET

module.exports = {
  PORT,
  MONGODB_PASS,
  MONGODB_URI,
  API_SECRET
}