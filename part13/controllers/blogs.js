const blogsRouter = require('express').Router()

const { blogFinder, tokenExtractor } = require('../util/middleware')

const { Blog, User } = require('../models')

blogsRouter.get('/', async (_req, res) => {
    const blogs = await Blog.findAll()
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
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
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

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
    const blog = req.foundObj
    if (blog) {
        await blog.destroy()
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

module.exports = blogsRouter