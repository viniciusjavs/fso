const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { API_SECRET } = require('../utils/config')

loginRouter.post('/', async ({ body }, res) => {
  const user = await User.findOne({ username: body.username })
  const loginOk = (user !== null) && await bcrypt.compare(body.password, user.passwordHash)

  if (!loginOk) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    API_SECRET,
    { expiresIn: 60*60 }
  )

  res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })
})

module.exports = loginRouter