import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Create from './components/Create'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  const success = (message) => {
    dispatch(setNotification(message))
  }

  const error = (message) => {
    dispatch(setNotification(message, false))
  }

  useEffect(() => {
    dispatch(initializeBlogs()).catch((e) => {
      console.log(e.response.data)
    })
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
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
    } catch (exception) {
      error(`Wrong credentials: ${exception.response.data.error}`)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreate = async (blogObj) => {
    blogObj.userId = user && user.id
    dispatch(createBlog(blogObj))
      .then(() => {
        blogFormRef.current.toggleVisibility()
        success(`a new blog ${blogObj.title} by ${blogObj.author} added`)
      })
      .catch((exception) => {
        error(`Blog creating failed: ${exception.response.data}`)
      })
  }

  return (
    <div>
      <Notification />
      {user ? (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name || user.username} logged in
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <Create handleCreate={handleCreate} />
          </Togglable>
          <BlogList />
        </div>
      ) : (
        <Togglable buttonLabel="log in">
          <Login handleLogin={handleLogin} />
        </Togglable>
      )}
    </div>
  )
}

export default App
