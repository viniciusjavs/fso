import { TextField, Button, Typography } from '@material-ui/core'
import React from 'react'
import { useDispatch } from 'react-redux'
import { newLogin } from '../reducers/loginReducer'
import { error } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'
import useField from '../hooks'

const Login = () => {
  const username = useField('Username')
  const password = useField('Password')
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const clearLoginForm = () => {
    username.reset()
    password.reset()
  }

  const login = (event) => {
    event.preventDefault()
    dispatch(
      newLogin({
        username: username.props.value,
        password: password.props.value,
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
            {...username.props}
            required
          />
        </div>
        <div>
          <TextField
            {...password.props}
            type="password"
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
