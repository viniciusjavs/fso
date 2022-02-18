import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  return (
    <TableContainer id="bloglist">
      <Table>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id} >
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BlogList