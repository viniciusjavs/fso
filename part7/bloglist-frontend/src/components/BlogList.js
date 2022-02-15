import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ handleUpdate, handleRemove }) => {
  const blogs = useSelector((state) => state.blogs)
  return (
    <div id="bloglist">
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleUpdate={handleUpdate}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  )
}

BlogList.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
}

export default BlogList
