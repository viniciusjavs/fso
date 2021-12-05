const totalLikes = blogs => blogs
  .reduce((acc, { likes }) => acc + likes, 0)

const favoriteBlog = blogs => blogs
  .map(({ title, author, likes }) => ({ title, author, likes }))
  .reduce((acc, blog) => blog.likes < acc.likes ? acc : blog, {})

const mostBlogs = blogs => {
  let max = {}
  blogs
    .map(({ author }) => author)
    .reduce((map, author) => map.set(author, (map.get(author) || 0) + 1), new Map())
    .forEach((blogs, author) => {
      if (!max.blogs || (max.blogs < blogs))
        max = { author, blogs }
    })
  return max
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
}