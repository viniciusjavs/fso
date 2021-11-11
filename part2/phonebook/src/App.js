import React, { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = ()  => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(({ name }) => name === newName)) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat([{
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }]))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = ( {target: {value}} ) => setNewName(value)
  const handleNumberChange = ( {target: {value}} ) => setNewNumber(value)
  const handleSearchChange = ( {target: {value}} ) => setSearchName(value)

  const personsToShow = searchName === ''
    ? persons
    : persons.filter(({name}) => name.toLowerCase().startsWith(searchName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={searchName} handleChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} name={newName} handleNameChange={handleNameChange} 
        number={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App;
