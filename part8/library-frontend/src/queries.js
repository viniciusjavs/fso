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