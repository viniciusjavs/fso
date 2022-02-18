import { TextField, Button, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { newLogin } from '../reducers/loginReducer'
import { error } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

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
    )
      .then(() => {
        navigate('/')
      })
      .catch((exception) => {
        dispatch(error(`Wrong credentials: ${exception.response.data.error}`))
      })
    clearLoginForm()
  }

  return (
    <>
      <Typography variant="h2">Log In</Typography>
      <form onSubmit={login}>
        <div>
          <TextField
            label="Username"
            value={username}
            name="Username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            value={password}
            name="Password"
            id="password"
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </div>
        <Button variant="contained" color="primary" id="login-button" type="submit">
          login
        </Button>
      </form>
    </>
  )
}

export default Login
