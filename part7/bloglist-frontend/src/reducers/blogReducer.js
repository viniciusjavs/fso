import blogService from '../services/blogs'

const sortPred = (a, b) => b.likes - a.likes

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.blogs
    case 'NEW_BLOG':
      return state.concat(action.blog).sort(sortPred)
    case 'LIKE':
      return state
        .filter((b) => b.id !== action.blog.id)
        .concat(action.blog)
        .sort(sortPred)
    case 'DEL':
      return state.filter((b) => b.id !== action.id)
  }
  return state
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      blogs: blogs.sort(sortPred),
    })
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.create(newBlog)
    dispatch({
      type: 'NEW_BLOG',
      blog: returnedBlog,
    })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.update(blog)
    dispatch({
      type: 'LIKE',
      blog: returnedBlog,
    })
  }
}

export const delBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      type: 'DEL',
      id,
    })
  }
}

export default blogReducer
