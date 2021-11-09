import React, {useState} from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = () => good + neutral + bad

  const average = () => {
    const t = total()
    return t === 0 ? 0 : (good - bad) / t
  }

  const positive = () => {
    const t = total()
    const result = (t === 0 ? 0 : 100 * good / t)
    return result
  }

  const percent = (number) => number + '%'

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={()=> setGood(good + 1)} text='good'/>
        <Button handleClick={()=> setNeutral(neutral + 1)} text='neutral'/>
        <Button handleClick={()=> setBad(bad + 1)} text='bad'/>
      </div>
      <h1>statistics</h1>
      <div>
        <Stats category='good' value={good} />
        <Stats category='neutral' value={neutral} />
        <Stats category='bad' value={bad} />
      </div>
      <div>
        <Stats category='all' value={total()} />
        <Stats category='average' value={average()} />
        <Stats category='positive' value={percent(positive())} />
      </div>
    </div>
  );
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Stats = ({ category, value }) => <p>{category} {value}</p>

export default App;
