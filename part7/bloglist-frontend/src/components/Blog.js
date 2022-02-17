import React from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, delBlog } from '../reducers/blogReducer'
import { success, error } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router'

const Blog = () => {
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const navigate = useNavigate()

  if (blog === undefined) {
    return null
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
        dispatch(success(`blog ${blog.title} updated with success`))
      })
      .catch((exception) => {
        dispatch(error(`Blog update failed: ${exception.response.data.error}`))
      })
  }

  const remove = () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      dispatch(delBlog(blog.id))
        .then(() => {
          navigate('/')
        })
        .catch((exception) => {
          dispatch(error(`Blog remove failed: ${exception.response.data.error}`))
        })
    }
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>{blog.likes} {blog.likes > 1 ? 'likes' : 'like'} <button onClick={addLike}>like</button></div>
      <div>added by {blog.author}</div>
      <button onClick={remove}>remove</button>
    </div>
  )
}

export default Blog
