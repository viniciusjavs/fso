const logoutRouter = require('express').Router()

const { Session } = require('../models')
const { tokenExtractor, sessionFinder } = require('../util/middleware')

logoutRouter.delete('/', tokenExtractor, async (req, res) => {
    await Session.destroy({
        where: {
            userId: req.decodedToken.id
        }
    })
    res.status(204).end()
})

logoutRouter.delete('/:id', tokenExtractor, sessionFinder, async (req, res) => {
    const session = req.foundObj
    if (session && session.userId === req.decodedToken.id) {
        await session.destroy()
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

module.exports = logoutRouter