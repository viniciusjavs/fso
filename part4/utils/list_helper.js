const totalLikes  = blogs => blogs
                                .reduce((acc, { likes }) => acc + likes, 0)

module.exports = {
    totalLikes
}