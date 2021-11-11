import React, { useState } from 'react'

const App = ()  => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas' }
  ])
  const [ newName, setNewName ] = useState('')

  const addName = (event) => {
    event.preventDefault()
    setPersons(persons.concat([{
      name: newName
    }]))
    setNewName('')
  }

  const handleNameChange = ( {target: {value}} ) => setNewName(value)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(({name}) => <div key={name}>{name}</div>)}
      </div>
    </div>
  )
}

export default App;
