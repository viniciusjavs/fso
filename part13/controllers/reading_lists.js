const readingListsRouter = require('express').Router()
const { ReadingLists } = require('../models')
const { tokenExtractor } = require('../util/middleware')

readingListsRouter.post('/', async (req, res) => {
    const listEntry = await ReadingLists.create(req.body)
    res.json(listEntry)
})

readingListsRouter.put('/:id', tokenExtractor, async (req, res) => {
    const listEntry = await ReadingLists.findOne({
        where: {
            id: req.params.id,
            userId: req.decodedToken.id
        }
    })
    if (listEntry) {
        if (req.body.state) {
            listEntry.state = req.body.state
        }
        await listEntry.save()
        res.json(listEntry)
    } else {
        res.status(404).end()
    }
})

module.exports = readingListsRouter