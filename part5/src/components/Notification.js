import React from 'react'
const Notification = ({ notification }) => {
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
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification