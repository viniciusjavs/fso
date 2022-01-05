import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, handleUpdate, handleRemove }) => (
  <div>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleUpdate={handleUpdate} handleRemove={handleRemove} />)}
  </div>
)

export default BlogList