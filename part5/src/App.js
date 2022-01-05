import React, { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Create from './components/Create'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

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

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
    } catch (exception) {
      error(`Wrong credentials: ${exception.response.data.error}`)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleUpdate = async (blog) => {
    try {
      const returnedBlog = await blogService.update(blog.id, blog)
      setBlogs(
        blogs
          .filter(b => b.id !== blog.id)
          .concat(blog)
      )
      success(`blog ${returnedBlog.title} updated with success`)
    }
    catch (exception) {
      error(`Blog update failed: ${exception.response.data.error}`)
    }
  }

  const handleCreate = async blogObj => {
    blogObj.userId = user && user.id
    try {
      const returnedBlog = await blogService.create(blogObj)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
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
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <Create handleCreate={handleCreate} />
            </Togglable>
            <BlogList blogs={blogs} handleUpdate={handleUpdate} />
          </div>
        : <Togglable buttonLabel="log in">
            <Login handleLogin={handleLogin} />
          </Togglable>
        }
    </div>
  )
}

export default App