import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const clearLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const login = (event) => {
    event.preventDefault()
    handleLogin({
      username, password
    })
    clearLoginForm()
  }

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={login}>
        <div>
          <label htmlFor="username">username </label>
          <input
            type="text"
            value={username}
            name="Username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="passowrd">password </label>
          <input
            type="password"
            value={password}
            name="Password"
            id="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default Login