import React from 'react'

const Create = ({ handleCreate, title, author, url, setTitle, setAuthor, setUrl }) => (
  <>
  <h2>Create new</h2>
  <form onSubmit={handleCreate}>
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

export default Create