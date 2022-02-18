import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'

const Users = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <b>blogs created</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell><Link to={`/users/${user.id}`}>{user.name || user.username}</Link></TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
