const mongoose = require('mongoose')
const express = require('express')
const http = require('http')
const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')

const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const User = require('./models/user')

const config = require('./utils/config')

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

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe
    },
    {
      server: httpServer,
      path: ''
    }
  )

  const server = new ApolloServer({
    schema,
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
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            }
          }
        }
      }
    ]
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/'
  })

  httpServer.listen(config.PORT, () =>
    console.log(`Server is now running on http://localhost/${config.PORT}`)
  )
}

start()