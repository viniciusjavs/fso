import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { recoverLogin, logout } from './reducers/userReducer'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Create from './components/Create'
import Login from './components/Login'
import Togglable from './components/Togglable'

const App = () => {
  const createBlogRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs()).catch((e) => {
      console.log(e.response.data)
    })
    dispatch(recoverLogin())
  }, [])

  const user = useSelector((state) => state.user)

  return (
    <div>
      <Notification />
      {user ? (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name || user.username} logged in
            <button type="button" onClick={() => dispatch(logout())}>
              logout
            </button>
          </p>
          <Togglable buttonLabel="new blog" ref={createBlogRef}>
            <Create togglable={createBlogRef} />
          </Togglable>
          <BlogList />
        </div>
      ) : (
        <Togglable buttonLabel="log in">
          <Login />
        </Togglable>
      )}
    </div>
  )
}

export default App
