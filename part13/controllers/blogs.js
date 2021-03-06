const blogsRouter = require('express').Router()
const { blogFinder, tokenExtractor } = require('../util/middleware')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

blogsRouter.get('/', async (req, res) => {
    let where = {}
    if (req.query.search) {
        const search = { [Op.iLike]: `%${req.query.search}%` }
        where = {
            [Op.or]: [{ title: search }, { author: search }]
        }
    }
    const blogs = await Blog.findAll({
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [
            ['likes', 'DESC']
        ]
    })
    res.json(blogs)
})

blogsRouter.get('/:id', blogFinder, async (req, res) => {
    const blog = req.foundObj
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.post('/', tokenExtractor, async(req, res) => {
    const blog = await Blog.create({ ...req.body, userId: req.decodedToken.id })
    res.json(blog)
})

blogsRouter.put('/:id', blogFinder, async (req, res) => {
    const blog = req.foundObj
    if (blog) {
        delete req.body.id
        for (const [key, value] of Object.entries(req.body)) {
            if (blog[key] !== undefined) {
                blog[key] = value
            }
        }
        await blog.save()
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

blogsRouter.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    const blog = req.foundObj
    if (blog && blog.userId === req.decodedToken.id) {
        await blog.destroy()
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

module.exports = blogsRouter