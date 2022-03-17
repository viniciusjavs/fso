const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')

const { SECRET }= require('./config')

const objFinder = (modelName) => 
    async (req, _res, next) => {
        req.foundObj = await modelName.findByPk(req.params.id)
        next()
    }

const blogFinder = objFinder(Blog)
const userFinder = objFinder(User)

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
            const user = await User.findByPk(req.decodedToken.id)
            if (user.id !== req.decodedToken.id) {
                throw new Error('User not found')
            }
        } catch {
            res.status(401).json({ error: 'invalid token' })
        }
    } else {
        res.status(401).json({ error: 'token is missing' })
    }
    next()
}

const errorHandler = (error, _req, res, next) => {
    console.error(error)

    if (error.name === 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: error.errors.map(i => i.message) })
    } else if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

module.exports = { blogFinder, userFinder, tokenExtractor, errorHandler }