import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, name }) => (
  <div>
    <h2>Blogs</h2>
    <p>{name} logged in</p>
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />)}
    </div>
  </div>
)

export default BlogList