import React from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

const User = () => {
  const id = useParams().id
  const user = useSelector((state) => state.users.find((u) => u.id === id))
  if (user === undefined) {
    return null
  }
  return (
    <div>
      <h2>{user.name || user.username}</h2>
      <b>added blogs</b>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User