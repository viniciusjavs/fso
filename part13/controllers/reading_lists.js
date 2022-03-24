const readingListsRouter = require('express').Router()
const { ReadingLists } = require('../models')

readingListsRouter.post('/', async (req, res) => {
    const listEntry = await ReadingLists.create(req.body)
    res.json(listEntry)
})

module.exports = readingListsRouter