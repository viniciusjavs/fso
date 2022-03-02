import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import Select from 'react-select'

const UpdateAuthor = (props) => {
  const [born, setBorn] = useState('')
  const { loading, data } = useQuery(ALL_AUTHORS)
  const [selectedOption, setSelectedOption] = useState(null)

  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  if (!props.token) {
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

    if (selectedOption !== null) {
      editAuthor({
        variables: {name: selectedOption.label, setBornTo: Number(born)}
      })
    }

    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={editBorn}>
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
  )
}

export default UpdateAuthor
