import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import Select from 'react-select'

const Authors = (props) => {
  const [born, setBorn] = useState('')
  const { loading, data } = useQuery(ALL_AUTHORS)
  const [selectedOption, setSelectedOption] = useState(null)

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      console.error(error)
    }
  })

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  const authors = data.allAuthors

  const options = authors.map(a => {
    return {
      value: a.id,
      label: a.name
    }
  })

  const editBorn = (event) => {
    event.preventDefault()

    console.log('updating author birthyear...')

    if (selectedOption !== null) {
      editAuthor({
        variables: {name: selectedOption.label, setBornTo: Number(born)}
      })
    }

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
            <Select
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
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
