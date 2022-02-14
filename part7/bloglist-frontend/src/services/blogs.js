import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => token = `Bearer ${newToken}`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blog => {
  const response = await axios.post(baseUrl, blog, { headers: { 'Authorization': token } })
  return response.data
}

const update = async (id, newBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, newBlog)
  return response.data
}

const remove = async id => {
  await axios.delete(`${baseUrl}/${id}`, { headers: { 'Authorization': token } })
}

const blogService = { setToken, getAll, create, update, remove }
export default blogService