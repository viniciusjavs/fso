const totalLikes = blogs => blogs
  .reduce((acc, { likes }) => acc + likes, 0)

const favoriteBlog = blogs => blogs
  .map(({ title, author, likes }) => ({ title, author, likes }))
  .reduce((acc, blog) => blog.likes < acc.likes ? acc : blog, {})

module.exports = {
  totalLikes,
  favoriteBlog
}