const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (req, res) => {
  const users  = await User
    .find({})
    .populate('blogs')
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (typeof password !== 'string') {
    return res.status(400).send( { error: 'invalid password' } )
  } else if (password.length < 3) {
    return res.status(400).send( { error: 'minlength is 3' } )
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

module.exports = usersRouter