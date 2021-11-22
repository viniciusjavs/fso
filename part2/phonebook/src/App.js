import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = ()  => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchName, setSearchName ] = useState('')
  const [ notification, setNotification ] = useState({})

  const notify = (message, success = true) => {
    let noteObj = {message, success}
    setNotification(noteObj)
          setTimeout(() => {
            setNotification({})
          }, 5000);
    }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const removeId = id => setPersons(persons.filter(p => p.id !== id))

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
          .catch(error => {
            notify(`Information of ${newPerson.name} has already been removed from server`, false)
            console.error(error.response);
            removeId(person.id)
          })
          notify(`Updated ${newPerson.name}'s number`)
      }
    }
    else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        notify(`Added ${newPerson.name}`)
    }
    setNewName('')
    setNewNumber('')
  }

  const delPerson = (name, id) => {
    if(window.confirm(`Delete ${name} ?`)) {
      personService
        .del(id)
        .then(() => {
          removeId(id)
          notify(`Deleted ${name}`)
        })
        .catch(() => {
            notify(`${name} had already been removed from server`, false)
            removeId(id)
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
      <Notification noteObj={notification} />
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