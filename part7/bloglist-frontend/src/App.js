import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
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
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const success = message => {
    dispatch(setNotification(message))
  }

  const error = message => {
    dispatch(setNotification(message, false))
  }

  const sortPred = (a, b) => b.likes - a.likes

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort(sortPred))
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
          .sort(sortPred)
      )
      success(`blog ${returnedBlog.title} updated with success`)
    }
    catch (exception) {
      error(`Blog update failed: ${exception.response.data.error}`)
    }
  }

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(
        blogs
          .filter(b => b.id !== id)
      )
    } catch (exception) {
      error(`Blog remove failed: ${exception.response.data.error}`)
    }
  }

  const handleCreate = async blogObj => {
    blogObj.userId = user && user.id
    try {
      const returnedBlog = await blogService.create(blogObj)
      setBlogs(
        blogs
          .concat(returnedBlog)
          .sort(sortPred)
      )
      blogFormRef.current.toggleVisibility()
      success(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      error(`Blog creating failed: ${exception.response.data.error}`)
    }
  }

  return (
    <div>
      <Notification />
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
          <BlogList blogs={blogs} handleUpdate={handleUpdate} handleRemove={handleRemove} />
        </div>
        : <Togglable buttonLabel="log in">
          <Login handleLogin={handleLogin} />
        </Togglable>
      }
    </div>
  )
}

export default App