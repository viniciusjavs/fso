const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser'
  },
  {
    username: 'user'
  }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const nonExistingId = () => {
  const id = new mongoose.Types.ObjectId()
  return id.toString()
}

const genHash = async pass => await bcrypt.hash(pass, 1)

module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDB,
  nonExistingId,
  usersInDB,
  genHash
}
