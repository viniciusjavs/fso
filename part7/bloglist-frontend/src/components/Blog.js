import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, delBlog } from '../reducers/blogReducer'
import { success, error } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router'
import blogService from '../services/blogs'
import { Typography, Link, Button, Grid, TextField, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'

const Blog = () => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getComments(id)
      .then((comments) => {
        setComments(comments)
      })
  }, [])

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

  const postComment = (event) => {
    event.preventDefault()
    blogService.comment({
      content: comment,
      blogId: blog.id,
    })
      .then((comment) => {
        setComments(comments.concat(comment))
      })
    setComment('')
  }

  return (
    <>
      <Typography variant="h2">{blog.title}</Typography>
      <Link href={blog.url}>{blog.url}</Link>
      <Grid container>
        <Typography>{blog.likes} {blog.likes > 1 ? 'likes' : 'like'}</Typography>
        <Button onClick={addLike}>like</Button>
      </Grid>
      {blog.author === undefined
        ? <></>
        : <Typography>added by {blog.author}</Typography>
      }
      <Button onClick={remove}>remove</Button>
      <Typography variant="h3">Comments</Typography>
      <TextField value={comment} onChange={({ target }) => { setComment(target.value) }} />
      <Button onClick={postComment}>add comment</Button>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemIcon />
            <ListItemText>{comment.content}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Blog
