const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeAll(async () => {
  await User.deleteMany({})
  helper.initialUsers[0].passwordHash = await helper.genHash('rootPass')
  helper.initialUsers[1].passwordHash = await helper.genHash('userPass')
  await User.insertMany(helper.initialUsers)
})

describe('attempt to login', () => {
  test('with correct password', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'rootPass' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toBe('root')
    expect(typeof result.body.token).toBe('string')

  })
  test('with wrong password', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'userPass' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid username or password')

  })
  test('with wrong username', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'Root', password: 'rootPass' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid username or password')

  })
})

afterAll(() => {
  mongoose.disconnect()
})