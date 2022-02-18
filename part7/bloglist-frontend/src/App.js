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
import { Container, AppBar, Toolbar, Button, Typography, Grid }  from '@material-ui/core'

const Menu = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login)

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit">
          <Link to="/">home</Link>
        </Button>
        <Button color="inherit">
          <Link to="/blogs">blogs</Link>
        </Button>
        <Button color="inherit">
          <Link to="/users">users</Link>
        </Button>
        {user
          ?
          <>
            <Button color="inherit" onClick={() => dispatch(logout())}>
              logout
            </Button>
            <Grid container justifyContent="flex-end">
              <Typography>
                {user.name || user.username} logged in
              </Typography>
            </Grid>
          </>
          :
          <Button color="inherit">
            <Link to="/login">login</Link>
          </Button>
        }
      </Toolbar>
    </AppBar>
  )
}

const Home = () => {
  const createBlogRef = useRef()
  const user = useSelector((state) => state.login)
  return (
    <>
      <Typography variant="h2">Blog App</Typography>
      {user
        ?
        <Togglable buttonLabel="create new" ref={createBlogRef}>
          <Create togglable={createBlogRef} />
        </Togglable>
        :
        null
      }
      <BlogList />
    </>
  )
}

const Blogs = () => (
  <>
    <Typography variant="h2">Blogs</Typography>
    <BlogList />
  </>
)

const App = () => {
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

  return (
    <Container>
      <Notification />
      <Router>
        <Menu />
        <Routes>
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
