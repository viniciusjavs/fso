import React from 'react'
import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, handleUpdate, handleRemove }) => (
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

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
}

export default BlogList
