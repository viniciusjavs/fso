import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const { loading, data } = useQuery(ALL_AUTHORS)

  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  const authors = data.allAuthors

  const editBorn = (event) => {
    event.preventDefault()

    console.log('updating author birthyear...')

    editAuthor({
      variables: {name, setBornTo: Number(born)}
    })

    setName('')
    setBorn('')

  }

  return (
    <div>
      <h2>authors</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <form onSubmit={editBorn}>
          <h3>Set birthyear</h3>
          <div>
            <label htmlFor="name">name</label>
            <input
              id="name"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div>
            <label htmlFor="born">born</label>
            <input
              id="born" value={born}
              onChange={({ target }) => setBorn(target.value)}
              type="number"
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
