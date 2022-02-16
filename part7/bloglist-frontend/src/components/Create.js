import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { success, error } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

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
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title </label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author </label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url </label>
          <input
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </>
  )
}

export default Create
