import React from 'react'

const Login = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => (
  <>
  <h2>log in to application</h2>
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="username">username </label>
      <input
        type="text"
        value={username}
        name="Username"
        id="username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      <label htmlFor="passowrd">password </label>
      <input
        type="password"
        value={password}
        name="Password"
        id="password"
        onChange={handlePasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form>
  </>
)

export default Login