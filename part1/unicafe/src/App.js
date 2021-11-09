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

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={()=> setGood(good + 1)} text='good'/>
        <Button handleClick={()=> setNeutral(neutral + 1)} text='neutral'/>
        <Button handleClick={()=> setBad(bad + 1)} text='bad'/>
      </div>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive} />
    </div>
  );
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const percent = (number) => number + '%'

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (good || neutral || bad)
    return (
      <table>
        <tbody>
          <StatisticLine category='good' value={good} />
          <StatisticLine category='neutral' value={neutral} />
          <StatisticLine category='bad' value={bad} />
          <StatisticLine category='all' value={total()} />
          <StatisticLine category='average' value={average()} />
          <StatisticLine category='positive' value={percent(positive())} />
        </tbody>
      </table>
    )
  return (
    <p>No feedback given</p>
  )
}

const StatisticLine = ({ category, value }) => <tr><td>{category}</td><td>{value}</td></tr>

export default App;
