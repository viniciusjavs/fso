import React from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Typography, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'

const User = () => {
  const id = useParams().id
  const user = useSelector((state) => state.users.find((u) => u.id === id))
  if (user === undefined) {
    return null
  }
  return (
    <div>
      <Typography variant="h2">{user.name || user.username}</Typography>
      <Typography><b>Added blogs</b></Typography>
      <List>
        {user.blogs.map((b) => (
          <ListItem key={b.id}>
            <ListItemIcon />
            <ListItemText primary={b.title}/>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User