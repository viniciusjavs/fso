import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, name, handleLogout }) => (
  <div>
    <h2>Blogs</h2>
    <p>{name} logged in <button type="button" onClick={handleLogout}>logout</button></p>
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />)}
    </div>
  </div>
)

export default BlogList