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
    const newPerson = {
      name: newName,
      number: newNumber
    }
    const person = persons.find(({ name }) => name === newPerson.name)
    if (person !== undefined) {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`))
      {
        personService
          .update(person.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map( p => p.id === person.id ? returnedPerson : p))
          })
      }
    }
    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const delPerson = (name, id) => {
    if(window.confirm(`Delete ${name} ?`)) {
      personService
        .del(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id))
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
      <Persons persons={personsToShow} handleDel={delPerson} />
    </div>
  )
}

export default App;
