import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state)
  if (!notification) {
    return null
  }

  let style = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (notification.success) {
    style.color = 'green'
  }

  return (
    <div className="notification" style={style}>
      {notification.message}
    </div>
  )
}

export default Notification