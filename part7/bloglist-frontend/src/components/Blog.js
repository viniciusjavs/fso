import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, delBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const success = (message) => {
    dispatch(setNotification(message))
  }

  const error = (message) => {
    dispatch(setNotification(message, false))
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLike = () => {
    dispatch(
      likeBlog({
        ...blog,
        likes: blog.likes + 1,
        userId: typeof blog.userId === 'object' ? blog.userId.id : blog.userId,
      })
    )
      .then(() => {
        success(`blog ${blog.title} updated with success`)
      })
      .catch((exception) => {
        error(`Blog update failed: ${exception.response.data.error}`)
      })
  }

  const remove = () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      dispatch(delBlog(blog.id)).catch((exception) => {
        error(`Blog remove failed: ${exception.response.data.error}`)
      })
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="basic-blog">
        <div>
          {' '}
          {blog.title} <button onClick={toggleVisibility}>view</button>{' '}
        </div>
        <div> {blog.author} </div>
      </div>
      <div style={showWhenVisible} className="full-blog">
        <div>
          {' '}
          {blog.title} <button onClick={toggleVisibility}>hide</button>{' '}
        </div>
        <div> {blog.url} </div>
        <div>
          {' '}
          {blog.likes} <button onClick={addLike}>like</button>{' '}
        </div>
        <div> {blog.author} </div>
        <button onClick={remove}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
