import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (!notification) {
    return null
  }

  let severity = 'error'

  if (notification.success) {
    severity = 'success'
  }

  return (
    <Alert className="notification" severity={severity}>
      {notification.message}
    </Alert>
  )
}

export default Notification
