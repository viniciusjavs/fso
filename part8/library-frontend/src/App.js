import { useCallback, useEffect, useState } from 'react'
import Authors from './components/Authors'
import UpdateAuthor from './components/UpdateAuthor'
import Books from './components/Books'
import Recommend from './components/Recommend'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const setTokenCb = useCallback((token) => {
    setToken(token)
  }, [])

  const setPageCb = useCallback((page) => {
    setPage(page)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    setToken(token)
  }, [])

  const logout = () => {
    localStorage.clear()
    setToken(null)
  }

  return (
    <div>
      {token
      ?
        <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>
      :
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>}
      <Authors show={page === 'authors'}>
        <UpdateAuthor token={token} />
      </Authors>
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <LoginForm
        show={page === 'login'}
        setToken={setTokenCb}
        setPage={setPageCb}
      />
      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App
