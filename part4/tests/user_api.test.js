const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'root' })
  await user.save()
})

describe('when there is initially one user in db', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    const totalUsers = await helper.usersInDB()

    expect(response.body).toHaveLength(totalUsers.length)
  })
})

describe('add a new user is successful', () => {
  test('with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'ada',
      name: 'Ada Lovelace',
      password: 'adaPass'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('when name is not required', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'ada',
      password: 'adaPass'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('add a new user fails', () => {
  test('if username is already taken', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'tux'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('if username is less then 3 characters', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'ro',
      password: 'tux'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` (`ro`) is shorter than the minimum allowed')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('if password is missing', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid password')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('if password is not a string', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      password: 123
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid password')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('if password is less then 3 characters', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      password: 'tu'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('minlength is 3')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})