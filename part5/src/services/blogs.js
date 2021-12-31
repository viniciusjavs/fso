import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => token = `Bearer ${newToken}`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blog => {
  const response = await axios.post(baseUrl, blog, {headers: {"Authorization": token}})
  return response.data
}

const blogService = { setToken, getAll, create }
export default blogService