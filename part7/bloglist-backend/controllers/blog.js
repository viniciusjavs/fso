const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const NotFoundError = require('../utils/error')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (_req, res) => {
  const blogs = await Blog
    .find({})
    .populate('userId')
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = await User.findById(req.userId)

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

blogsRouter.delete('/:id', userExtractor, async({ params: { id }, userId }, res) => {
  const returnedBlog = await Blog.findById(id)
  if (!returnedBlog || (returnedBlog.userId.toString() !== userId)) {
    res.status(404).send({ error: 'id not found' })
  }
  else {
    await returnedBlog.remove()
    const user = await User.findById(userId)
    user.blogs = user.blogs.filter(bId => bId.toString() !== id)
    await user.save()
    res.status(204).end()
  }
})

blogsRouter.get('/:id/comments', async ({ params: { id } }, res, next) => {
  const blogFound = await Blog.exists({_id: id})
  const Comments = await Comment.find({ blogId: id}, 'content')
  blogFound && Comments ? res.json(Comments) : next(new NotFoundError('id not found'))
})

module.exports = blogsRouter
