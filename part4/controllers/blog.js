const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const NotFoundError = require('../utils/error')
const jwt = require('jsonwebtoken')
const { API_SECRET } = require('../utils/config')

blogsRouter.get('/', async (_req, res) => {
  const blogs = await Blog
    .find({})
    .populate('userId')
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const decodedToken = req.token && jwt.verify(req.token, API_SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({ userId: user._id, ...req.body })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async ({ params: { id } }, res, next) => {
  const returnedBlog = await Blog.findById(id)
  returnedBlog ? res.json(returnedBlog) : next(new NotFoundError('id not found'))
})

blogsRouter.put('/:id', async ({ params: { id }, body }, res, next) => {
  delete body.id
  const returnedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
  returnedBlog ? res.json(returnedBlog) : next(new NotFoundError('id not found'))
})

blogsRouter.delete('/:id', async({ params: { id }, token }, res) => {
  const decodedToken = token && jwt.verify(token, API_SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const returnedBlog = await Blog.findById(id)
  if (!returnedBlog || (returnedBlog.userId.toString() !== decodedToken.id)) {
    res.status(404).send({ error: 'id not found' })
  }
  else {
    await returnedBlog.remove() && res.status(204).end()
  }
})

module.exports = blogsRouter
