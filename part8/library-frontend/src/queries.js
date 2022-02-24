import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
query {
    allBooks {
      id
      title
      author
      published
    }
  }
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      id
      author
      published
      title
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    id
    born
  }
}
`
