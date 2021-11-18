import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = ( {target: {value}} ) => setSearchCountry(value)

  const foundCountries = searchCountry === ''
    ? []
    : countries.filter(({ name }) => name.toLowerCase().includes(searchCountry.toLowerCase()))

  return (
    <>
      <div>
        <label htmlFor="country">find countries </label>
        <input id="country" value={searchCountry} onChange={handleSearchChange}/>
      </div>
      <Result countries={foundCountries} handleClick={(name) => setSearchCountry(name)} />
    </>
  )
}

const Result = ({ countries, handleClick }) => {
  const maxList = 10
  if (countries.length === 1)
    return <Country country={countries[0]}/>
  if (countries.length > maxList)
    return (<div>Too many matches, specify another filter</div>)
  return (
    <div>
      {countries.map(({name}) => {
        return (
          <div key={name}>
            {name}
            <button type="button" onClick={() => handleClick(name)}>show</button>
          </div>
        )
      })}
    </div>
  )
}

const Country = ({ country: {name, capital, population, languages, flags} }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>capital {capital}</p>
      <p>population {population}</p>
      <h2>languages</h2>
      <ul>
        {languages.map(({ name, iso639_2 }) => <li key={iso639_2}>{name}</li>)}
      </ul>
      <img src={flags.png} alt={"flag of " + name}/>
    </div>
  )
}

export default App