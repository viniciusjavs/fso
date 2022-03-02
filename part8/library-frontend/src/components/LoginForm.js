import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, { data }] = useMutation(LOGIN)

  useEffect(() => {
    const token = data && data.login
    if (token) {
      localStorage.setItem('library-user-token', token.value)
      setToken(token.value)
      setPage('authors')
    }
  }, [data, setToken, setPage])

  if (!show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()

    login({variables: { username, password }})

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={submit}>
      <div>
        username
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    )
}

export default LoginForm