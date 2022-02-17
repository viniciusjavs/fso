import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => (token = `Bearer ${newToken}`)

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getComments = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}/comments`)
  return res.data
}

const comment = async (comment) => {
  const res = await axios.post(`${baseUrl}/${comment.blogId}/comments`, comment)
  return res.data
}

const create = async (blog) => {
  const response = await axios.post(baseUrl, blog, {
    headers: { Authorization: token },
  })
  return response.data
}

const update = async (newBlog) => {
  const response = await axios.put(`${baseUrl}/${newBlog.id}`, newBlog)
  return response.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })
}

const blogService = { setToken, getAll, getComments, comment, create, update, remove }
export default blogService
