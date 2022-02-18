import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { success, error } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { TextField, Button, Typography }  from '@material-ui/core'
import useField from '../hooks'

const Create = ({ togglable }) => {
  const title = useField('Title')
  const author = useField('Author')
  const url = useField('URL')

  const dispatch = useDispatch()

  const clearCreateForm = () => {
    title.reset()
    author.reset()
    url.reset()
  }

  const user = useSelector((state) => state.login)

  const addBlog = (event) => {
    event.preventDefault()
    const blogObj = { title: title.props.value, author: author.props.value, url: url.props.value }
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
            {...title.props}
            required
          />
        </div>
        <div>
          <TextField
            {...author.props}
            required
          />
        </div>
        <div>
          <TextField
            {...url.props}
            required
          />
        </div>
        <Button type="submit">save</Button>
      </form>
    </>
  )
}

export default Create
