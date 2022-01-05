import React, {useState} from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleUpdate, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const hideWhenVisible = {display: visible ? 'none' : ''}
  const showWhenVisible = {display: visible ? '' : 'none'}

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    handleUpdate({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      userId: typeof blog.userId === 'object' ? blog.userId.id : blog.userId,
      id: blog.id
    })
  }

  const remove = () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      handleRemove(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <div> {blog.title} <button onClick={toggleVisibility}>view</button> </div>
        <div> {blog.author} </div>
      </div>
      <div style={showWhenVisible}>
        <div> {blog.title} <button onClick={toggleVisibility}>hide</button> </div>
        <div> {blog.url} </div>
        <div> {blog.likes} <button onClick={addLike}>like</button> </div>
        <div> {blog.author} </div>
        <button onClick={remove}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog