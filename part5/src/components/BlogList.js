import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, handleUpdate }) => (
  <div>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleUpdate={handleUpdate} />)}
  </div>
)

export default BlogList