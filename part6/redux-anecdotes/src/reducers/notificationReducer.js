  const notificationReducer = (state = '', action) => {
    console.log('state now: ', state)
    console.log('action', action)
  
    switch(action.type) {
      case 'SET_NOTIFICATION':
        return action.notification
      default:
        return state
    }
  }
  
  const clearNotification = () => {
    return {
      type: 'SET_NOTIFICATION',
      notification: ''
    }
  }

  export const setNotification = (notification, sec = 5) => {
    return async dispatch => {
      dispatch({
        type: 'SET_NOTIFICATION',
        notification
      })
      setTimeout(() => {
        dispatch(clearNotification())
      }, sec * 1000)
    }
  }
  
  export default notificationReducer