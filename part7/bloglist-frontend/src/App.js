import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { recoverLogin, logout } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'
import Login from './components/Login'
import Notification from './components/Notification'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BlogList from './components/BlogList'
import Create from './components/Create'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

const Menu = (props) => {

  const padding = {
    padding: 5
  }

  return (
    <div style={{ background: 'lightgrey' }}>
      <Link style={padding} to="/">home</Link>
      <Link style={padding} to="/blogs">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      {props.children}
    </div>
  )
}

const App = () => {
  const createBlogRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs()).catch((e) => {
      console.log(e.response.data)
    })
    dispatch(recoverLogin())
    dispatch(initializeUsers()).catch((e) => {
      console.log(e.response.data)
    })
  }, [])

  const user = useSelector((state) => state.login)

  return (
    <div>
      <Notification />
      {user ? (
        <div>
          <h2>Blogs</h2>
          <Router>
            <Menu>
              <>
                {user.name || user.username} logged in {' '}
                <button type="button" onClick={() => dispatch(logout())}>
                  logout
                </button>
              </>
            </Menu>
            <Routes>
              <Route path="/users/:id" element={<User />} />
              <Route path="/users" element={<Users />} />
              <Route path="/blogs/:id" element={<Blog />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route
                path="/"
                element={
                  <>
                    <Togglable buttonLabel="new blog" ref={createBlogRef}>
                      <Create togglable={createBlogRef} />
                    </Togglable>
                    <BlogList />
                  </>
                }
              />
            </Routes>
          </Router>
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
