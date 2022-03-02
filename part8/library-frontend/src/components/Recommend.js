import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ME } from "../queries"

const Recommend = (props) => {
  const allBooks = useQuery(ALL_BOOKS)
  const me = useQuery(ME)

  if (!props.show) {
    return null
  }

  if (allBooks.loading || me.loading) {
    return <div>loading...</div>
  }

  const books = allBooks.data.allBooks
  const { favoriteGenre } = me.data.me

  const favoriteExists = books
    .flatMap(b => b.genres)
    .find(g => g === favoriteGenre)

  return (
    <div>
      <h2>recommendations</h2>
      {
        favoriteExists
        ?
          <div>
            <div>books in your favorite genre <strong>{favoriteGenre}</strong></div>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>author</th>
                  <th>published</th>
                </tr>
                {books
                  .filter((b) => b.genres.includes(favoriteGenre))
                  .map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>{b.author.name}</td>
                    <td>{b.published}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        :
        <div>there are no recommendations for now :(</div>
      }
    </div>
  )
}

export default Recommend
