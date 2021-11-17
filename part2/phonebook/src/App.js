import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = ()  => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  },[])

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
