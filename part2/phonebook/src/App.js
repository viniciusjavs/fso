import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = ()  => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(({ name }) => name === newName)) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
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
