const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const sinon = require('sinon')

const api = supertest(app)

let apiTestKey, testUserId

beforeAll(async () => {
  await User.deleteMany({})
  helper.initialUsers[0].passwordHash = await helper.genHash('rootPass')
  await User.insertMany(helper.initialUsers)

  const user = await User.findOne({ username: 'root' })

  testUserId = user._id.toString()

  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'rootPass' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(result.body.username).toBe('root')
  expect(typeof result.body.token).toBe('string')

  apiTestKey = result.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const users = await helper.usersInDB()
  users.forEach((elem, idx) => helper.initialBlogs[idx].userId = elem.id)
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    expect(titles).toContain('React patterns')
  })
})

describe('viewing a specific blog', () => {
  test('ensure unique identifier is named id', async () => {
    const { body } = await api.get('/api/blogs')
    expect(body[0].id).toBeDefined()
  })

  test('success with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDB()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    blogToView.userId = blogToView.userId.toString()
    expect(resultBlog.body).toEqual(blogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    await api
      .get(`/api/blogs/${helper.randomId()}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async() => {
    const invalidId = '1234567890'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      userId: new mongoose.Types.ObjectId(testUserId)
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${apiTestKey}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const blogs = blogsAtEnd.map(b => delete b.id && b)
    expect(blogs).toContainEqual(newBlog)
  })

  test('missing likes property defaults to zero', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      userId: new mongoose.Types.ObjectId(testUserId)
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${apiTestKey}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const blogs = blogsAtEnd.map(b => delete b.id && b)
    expect(blogs).toContainEqual({ likes: 0, ...newBlog })
  })

  test('fails with statuscode 400 if title is missing', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      userId: testUserId
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${apiTestKey}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with statuscode 400 if url is missing', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      userId: testUserId
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${apiTestKey}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with statuscode 401 if Auth is not set', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      userId: testUserId
    }

    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('token missing or invalid')
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with statuscode 401 if token is invalid', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      userId: testUserId
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer 123')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('invalid token')
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  const clock = sinon.useFakeTimers()
  test('fails with statuscode 401 if token is expired', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      userId: testUserId
    }

    clock.tick(3601000)

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${apiTestKey}`)
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('token expired')
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    clock.restore()
  })
})

describe('updating a blog', () => {
  test('succeeds if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()

    const blogToUpdate = {
      likes: blogsAtStart[0].likes + 1,
      ...blogsAtStart[0]
    }

    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(JSON.parse(JSON.stringify(blogToUpdate))).toEqual(resultBlog.body)
    expect(blogsAtEnd).toContainEqual(blogToUpdate)
  })
})

describe('deleting a blog', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
    const blogIds = blogsAtEnd.map(b => b.id)
    expect(blogIds).not.toContain(blogToDelete.id)
  })
})

afterAll(() => {
  mongoose.disconnect()
})