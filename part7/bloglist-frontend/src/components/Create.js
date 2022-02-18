import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { success, error } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { TextField, Button, Typography }  from '@material-ui/core'

const Create = ({ togglable }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const clearCreateForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const user = useSelector((state) => state.login)

  const addBlog = (event) => {
    event.preventDefault()
    const blogObj = { title, author, url }
    blogObj.userId = user && user.id
    dispatch(createBlog(blogObj))
      .then(() => {
        togglable.current.toggleVisibility()
        dispatch(success(`a new blog ${blogObj.title} by ${blogObj.author} added`))
      })
      .catch((exception) => {
        dispatch(error(`Blog creating failed: ${exception.response.data}`))
      })
    clearCreateForm()
  }

  return (
    <>
      <Typography variant="h3">Create new</Typography>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="Title"
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="Author"
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="URL"
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            required
          />
        </div>
        <Button type="submit">save</Button>
      </form>
    </>
  )
}

export default Create
