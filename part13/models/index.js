const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./reading_lists')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingLists, as: 'users' })

module.exports = { Blog, User, ReadingLists }