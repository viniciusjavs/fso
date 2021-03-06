const { Blog, User, Session } = require('../models')
const jwt = require('jsonwebtoken')

const { SECRET }= require('./config')

const objFinder = (modelName) => 
    async (req, _res, next) => {
        req.foundObj = await modelName.findByPk(req.params.id)
        next()
    }

const blogFinder = objFinder(Blog)
const userFinder = objFinder(User)
const sessionFinder = objFinder(Session)

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorization.substring(7)
            req.decodedToken = jwt.verify(token, SECRET)
            const user = await User.findOne({
                attributes: ['id', 'active'],
                where: {
                    id: req.decodedToken.id,
                    active: true
                },
                include: {
                    model: Session,
                    attributes: ['id'],
                    where: {
                        token
                    }
                }
            })
            if (!user) {
                throw new Error('Unauthorized')
            }
        } catch {
            return res.status(401).json({ error: 'invalid token' })
        }
    } else {
        return res.status(401).json({ error: 'token is missing' })
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

module.exports = { blogFinder, userFinder, tokenExtractor, errorHandler, sessionFinder }