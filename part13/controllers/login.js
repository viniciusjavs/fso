const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')
const User = require('../models/user')
const { Session } = require('../models')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    const user = await User.scope('login').findOne({
        where: {
            username,
            active: true
        }
    })
    const error = 'invalid username or password'
    if (!user) {
        return res.status(401).json({ error })
    }
    const correctPass = await bcrypt.compare(password, user.passwordHash)
    if (!correctPass) {
        return res.status(401).json({ error })
    }
    const userForToken = {
        username: user.username,
        id: user.id
    }
    const token = jwt.sign(userForToken, SECRET)
    await Session.create({ token, userId: user.id })
    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter