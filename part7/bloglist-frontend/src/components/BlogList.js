import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  return (
    <div id="bloglist">
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList
