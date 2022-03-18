const authorsRouter = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

authorsRouter.get('/', async (_req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: 'author',
        order: sequelize.literal('likes DESC')
    })
    res.json(authors)
})

module.exports = authorsRouter
