import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Create from './components/Create'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const notificationTimeout = (time = 5000) => {
    setTimeout(() => {
      setNotification(null)
    }, time);
  }

  const success = (message) => {
    setNotification({message, success: true})
    notificationTimeout()
  }

  const error = (message) => {
    setNotification({message, success: false})
    notificationTimeout()
  }

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const clearLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      clearLoginForm()
    } catch (exception) {
      error(`Wrong credentials: ${exception.response.data.error}`)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const clearCreateForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({
          title, author, url, userId: user.id
      })
      setBlogs(blogs.concat(returnedBlog))
      clearCreateForm()
      success(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      error(`Blog creating failed: ${exception.response.data.error}`)
    }
  }

  return (
    <div>
      <Notification notification={notification} />
      {user
        ? <div>
            <h2>Blogs</h2>
            <p>
              {user.name || user.username} logged in
              <button type="button" onClick={handleLogout}>logout</button>
            </p>
            <Create handleCreate={handleCreate} title={title} author={author} url={url}
              setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} />
            <BlogList blogs={blogs} />
          </div>
        : <Login handleLogin={handleLogin}
            username={username} password={password}
            handleUsernameChange = {({ target }) => setUsername(target.value)} 
            handlePasswordChange = {({ target }) => setPassword(target.value)} />}
    </div>
  )
}

export default App