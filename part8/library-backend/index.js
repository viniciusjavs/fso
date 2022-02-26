const mongoose = require('mongoose')
const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const config = require('./utils/config')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const Token = require('./models/token')
const jwt = require('jsonwebtoken')

console.log('Connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI.replace('MONGODB_PASS', config.MONGODB_PASS))
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    allBooks(
      author: String
      genre: String
    ): [Book!]!
    allAuthors: [Author!]!
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
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
    },
    me: async (_root, _args, { user } ) => {
      if (!user) {
        throw new AuthenticationError()
      }
      return User.findOne(user)
    }
  },
  Mutation: {
    addBook: async (_root, args, { user }) => {
      if (!user) {
        throw new AuthenticationError()
      }
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
    editAuthor: async (_root, { name, setBornTo }, { user }) => {
      if(!user) {
        throw new AuthenticationError()
      }
      return Author.findOneAndUpdate({ name }, { born: setBornTo }, {
        returnOriginal: false
      })
    },
    login: async (_root, { username, password }) => {
      const user = await User.findOne({ username })
      if (!user || password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }
      const token = {
        value: jwt.sign(
          {
            username: user.username,
            id: user._id
          },
          config.JWT_SECRET
        )
      }
      await Token.create({ token: token.value, userId: user._id })
      return token
    },
    createUser: async (_root, args) => User.create({ ...args })
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req && req.headers.authorization
    const token = auth
      && auth.toLowerCase().startsWith('bearer ')
      && auth.substring(7)
    if (token) {
      const decodedToken = jwt.verify(token, config.JWT_SECRET)
      const isTokenValid = await Token.exists({ token })
      const user = await User.findById(decodedToken.id)
      return isTokenValid && { user }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
