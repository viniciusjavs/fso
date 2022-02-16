import userService from '../services/users'

const userReducer = (state = [], action) => {
  if (action.type === 'INIT_USERS') {
    return action.users
  }
  return state
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      users,
    })
  }
}

export default userReducer
