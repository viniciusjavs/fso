const notificationReducer = (state = null, action) => {
  if (action.type === 'SET_NOTIFICATION') {
    return action.notification
  }
  return state
}

const clearNotification = () => {
  return {
    type: 'SET_NOTIFICATION',
    notification: null,
  }
}

let notificationId

const notificationTimeout = (dispatch) => {
  return (time = 5000) => {
    clearTimeout(notificationId)
    notificationId = setTimeout(() => {
      dispatch(clearNotification())
    }, time)
  }
}

const newNotification = (message, success) => {
  return {
    type: 'SET_NOTIFICATION',
    notification: { message, success },
  }
}

const setNotification = (message, success = true) => {
  return (dispatch) => {
    dispatch(newNotification(message, success))
    notificationTimeout(dispatch)()
  }
}

export const success = (message) => setNotification(message)

export const error = (message) => setNotification(message, false)

export default notificationReducer
