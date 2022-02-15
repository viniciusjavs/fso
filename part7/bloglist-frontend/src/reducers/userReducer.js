import blogService from '../services/blogs'
import loginService from '../services/login'

const userReducer = (state = null, action) => {
  if (action.type === 'SET_USER') {
    return action.user
  }
  return state
}

export const recoverLogin = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'SET_USER',
        user,
      })
    }
  }
}

export const newLogin = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    blogService.setToken(user.token)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    dispatch({
      type: 'SET_USER',
      user,
    })
  }
}

export const logout = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({
      type: 'SET_USER',
      user: null,
    })
  }
}

export default userReducer
