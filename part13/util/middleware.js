const { Blog, User } = require('../models')

const objFinder = (modelName) => 
    async (req, _res, next) => {
        req.foundObj = await modelName.findByPk(req.params.id)
        next()
    }

const blogFinder = objFinder(Blog)
const userFinder = objFinder(User)

const errorHandler = (error, _req, res, next) => {
    console.error(error)

    if (error.name === 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ error: error.errors.map(i => i.message) })
    } else if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

module.exports = { blogFinder, userFinder, errorHandler }