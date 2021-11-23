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
        <label htmlFor="country">find countries</label> &nbsp;
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
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>population {population}</p>
      <h3>Spoken languages</h3>
      <ul>
        {languages.map(({ name, iso639_2 }) => <li key={iso639_2}>{name}</li>)}
      </ul>
      <img src={flags.png} alt={"flag of " + name}/>
      <Weather city={capital} />
    </div>
  )
}

const Weather = ({ city }) => {
  const [weather, setWeather] = useState({
                                          temperature: null,
                                          weather_icons: [],
                                          weather_descriptions: [],
                                          wind_speed: null,
                                          wind_dir: null
                                          })

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
        setWeather(response.data.current)
      })
  }, [city])

  const {temperature, weather_icons, weather_descriptions, wind_speed, wind_dir} = weather

  return (
    <>
      <h3>Weather in {city}</h3>
      <p><strong>temperature:</strong> {`${temperature} Celsius`}</p>
      {weather_icons.map((icon, i) => <img key={icon} src={icon} alt={`weather condition: ${weather_descriptions[i]}`}/>)}
      <p><strong>wind:</strong> {`${toMph(wind_speed)} mph direction ${wind_dir}`}</p>
    </>
  )
}

export default App