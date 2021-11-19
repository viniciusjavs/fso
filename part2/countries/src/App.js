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
      <h2>Spoken languages</h2>
      <ul>
        {languages.map(({ name, iso639_2 }) => <li key={iso639_2}>{name}</li>)}
      </ul>
      <img src={flags.png} alt={"flag of " + name}/>
      <Weather city={capital} />
    </div>
  )
}

const Weather = ({ city }) => {
  const [temp, setTemp] = useState('')
  const [weather_icons, setWeatherIcons] = useState([])
  const [wind, setWind] = useState('')

  const toMph = (kph) => Math.round(kph / 1.609344)

  useEffect(() => {
    axios
      .get('http://api.weatherstack.com/current', {
        params: {
          access_key: process.env.REACT_APP_API_KEY,
          query: city
        }
      })
      .then(response => {
        const { current: {temperature, weather_icons, wind_speed, wind_dir} } = response.data
        setTemp(`${temperature} Celsius`)
        setWeatherIcons(weather_icons)
        setWind(`${toMph(wind_speed)} mph direction ${wind_dir}`)
      })
  }, [city])

  return (
    <>
      <h2>Weather in {city}</h2>
      <p><b>temperature:</b> {temp}</p>
      {weather_icons.map(icon => <img key={icon} src={icon} alt={`weather icon of ${city}`}/>)}
      <p><b>wind:</b> {wind}</p>
    </>
  )
}

export default App