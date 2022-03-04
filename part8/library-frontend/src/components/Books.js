import { useQuery, useLazyQuery } from '@apollo/client'
import { useState } from "react"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const allBooksQuery = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [booksByGenreQuery, booksByGenre] = useLazyQuery(ALL_BOOKS, {
    variables: { genre }
  })

  if (!props.show) {
    return null
  }

  if (allBooksQuery.loading || (booksByGenre.called && booksByGenre.loading)) {
    return <div>loading...</div>
  }

  const { allBooks } = allBooksQuery.data

  const genres = new Set()
  allBooks.forEach(b => {
    b.genres.length && genres.add(...b.genres)
  })

  const books = showAll
    ? allBooks
    : booksByGenre.data.allBooks

  const showBooksByGenre = (genre) => {
    setShowAll(false)
    setGenre(genre)
    !booksByGenre.called && booksByGenreQuery()
  }

  return (
    <div>
      <h2>books</h2>
      {!showAll && <div>in genre <strong>{genre}</strong></div>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
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
            onClick={() => showBooksByGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setShowAll(true)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
