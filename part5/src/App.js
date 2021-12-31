import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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

  return (
    <div>
      <Notification notification={notification} />
      {user
        ? <BlogList blogs={blogs} name={user.name || user.username} handleLogout={handleLogout} />
        : <Login handleLogin={handleLogin}
            username={username} password={password}
            handleUsernameChange = {({ target }) => setUsername(target.value)} 
            handlePasswordChange = {({ target }) => setPassword(target.value)} />}
    </div>
  )
}

export default App