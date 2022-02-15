import blogService from '../services/blogs'

const sortPred = (a, b) => b.likes - a.likes

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.blogs
    case 'NEW_BLOG':
      return state.concat(action.blog).sort(sortPred)
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

export default blogReducer
