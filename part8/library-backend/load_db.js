const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const config = require('./utils/config')

const authors = [
  {
    name: 'Robert Martin',
    born: 1952
  },
  {
    name: 'Martin Fowler',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821
  },
  {
    name: 'Joshua Kerievsky' // birthyear not known
  },
  {
    name: 'Sandi Metz' // birthyear not known
  }
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  }
]

const loadAuthors = async () => {
  const nAuthors = await Author.collection.countDocuments()
  if (nAuthors === 0 && config.LOAD_DB) {
      console.log('Loading Authors')
      await Author.insertMany(authors)
      console.log('Loading Authors completed')
    }
}

const loadBooks = async () => {
  const nBooks = await Book.collection.countDocuments()
  if (nBooks === 0 && config.LOAD_DB) {
    console.log('Loading Books')
    await Book.insertMany(
      books.map(({ title, published, genres }) => { return { title, published, genres }})
    )
    console.log('Loading Books completed')
  }
}

const linkBooksToAuthors = async () => {
  if (config.LOAD_DB) {
  console.log('Linking Authors to Books')
  books.forEach(async (b) => {
    const author = await Author.findOne({ name: b.author })
    const book = await Book.findOne({ title: b.title })
    book.author = author._id
    await book.save()
  })
  console.log('Linking Authors to Books completed')
  }
}

const loadDB = async () => {
  console.log('Loading initial data to MongoDB')
  await loadAuthors()
  await loadBooks()
  await linkBooksToAuthors()
}

console.log('Connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI.replace('MONGODB_PASS', config.MONGODB_PASS))
  .then(() => {
    console.log('Connected to MongoDB')
    if (config.LOAD_DB) {
      loadDB()
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })
