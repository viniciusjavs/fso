import React, {useState} from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

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
        <Result category='good' number={good} />
        <Result category='neutral' number={neutral} />
        <Result category='bad' number={bad} />
      </div>
    </div>
  );
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Result = ({ category, number }) => <p>{category} {number}</p>

export default App;
