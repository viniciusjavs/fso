import { useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const { loading, data } = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  const books = data.allBooks
  const genres = new Set()
  books.forEach(b => {
    b.genres.length && genres.add(...b.genres)
  })
  genres.add('all genres')

  const setFilter = (genre) => {
    genre === 'all genres'
      ? setGenre('')
      : setGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre <strong>{genre}</strong></div>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((b) => !genre || b.genres.includes(genre))
            .map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {[...genres].map((genre, idx) => (
          <button
            key={idx}
            onClick={() => setFilter(genre)}
          >{genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
