import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { newLogin } from '../reducers/loginReducer'
import { error } from '../reducers/notificationReducer'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const clearLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const login = (event) => {
    event.preventDefault()
    dispatch(
      newLogin({
        username,
        password,
      })
    ).catch((exception) => {
      dispatch(error(`Wrong credentials: ${exception.response.data.error}`))
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
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </>
  )
}

export default Login
