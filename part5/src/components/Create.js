import React, {useState} from 'react'
import PropTypes from 'prop-types'

const Create = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const clearCreateForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const addBlog = (event) => {
    event.preventDefault()
    handleCreate({
        title, author, url
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
)}

Create.protoTypes = {
  handleCreate: PropTypes.func.isRequired
}

export default Create