const { Blog } = require('../models')

const blogFinder = async (req, _res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const errorHandler = (error, _req, res, next) => {
    console.error(error)

    if (error.name === 'SequelizeDatabaseError' || error.name === 'SequelizeValidationError') {
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

module.exports = { blogFinder, errorHandler }