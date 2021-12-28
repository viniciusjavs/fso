const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const NotFoundError = require('../utils/error')

blogsRouter.get('/', async (_req, res) => {
  const blogs = await Blog
    .find({})
    .populate('userId')
  res.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
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

blogsRouter.delete('/:id', async({ params: { id } }, res, next) => {
  const returnedBlog = await Blog.findByIdAndRemove(id)
  returnedBlog ? res.status(204).end() : next(new NotFoundError('id not found'))
})

module.exports = blogsRouter
