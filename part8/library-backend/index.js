const mongoose = require('mongoose')
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const config = require('./utils/config')
const Book = require('./models/book')
const Author = require('./models/author')

console.log('Connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI.replace('MONGODB_PASS', config.MONGODB_PASS))
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_root, { author, genre }) => {
      const query = {}
      if (author) {
        const author_id = await Author.find({name: author}, 'id')
        query.author = author_id
      }
      if (genre) {
        query.genres = genre
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(async (a) => {
        a.bookCount = await Book.countDocuments({ author: a._id })
        return a
      })
    }
  },
  Mutation: {
    addBook: async (_root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = await Author.create({ name: args.author })
        }
        catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.author
          })
        }
      }
      return Book.create({ ...args, author: author._id })
        .then((book) => book.populate('author'))
        .catch((error) => {
          throw new UserInputError(error.message, {
            invalidArgs: { ...args, author: author._id }
          })
        })
    },
    editAuthor: async (_root, { name, setBornTo }) =>
      Author.findOneAndUpdate({ name }, { born: setBornTo }, {
        returnOriginal: false
      })
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
