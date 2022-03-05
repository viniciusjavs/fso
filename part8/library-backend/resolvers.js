const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const config = require('./utils/config')
const Token = require('./models/token')
const jwt = require('jsonwebtoken')

const resolvers = {
    Author: {
      bookCount: async (root) => Book.countDocuments({ author: root.id })
    },
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
      allAuthors: async () => await Author.find({}),
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

        try {
          const book = await Book.create({ ...args, author: author._id })
          await book.populate('author')
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
        }
        catch(error) {
          throw new UserInputError(error.message, {
            invalidArgs: { ...args, author: author._id }
          })
        }
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
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      }
    }
  }

  module.exports = resolvers
  