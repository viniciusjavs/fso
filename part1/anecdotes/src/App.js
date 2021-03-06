import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(getRandomInt(anecdotes.length))
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState(0)

  const setVote = () => {
    const newArray = [...points]
    newArray[selected] += 1
    if (newArray[mostVoted] < newArray[selected])
      setMostVoted(selected)
    setPoints(newArray)
  }

  return (
    <>
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
    </div>
    <DisplayVotes points={points} selected={selected} />
    <div>
      <button onClick={setVote}>vote</button>
      <button onClick={() => setSelected(getRandomInt(anecdotes.length))}>next anecdote</button>
    </div>
    <div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVoted]}
    </div>
    </>
  );
}

const getRandomInt = (max) => Math.floor(Math.random() * max)

const DisplayVotes = ({ points, selected }) => {
  if (points[selected] === 0 || points[selected] === 1)
    return (
      <div>
        has {points[selected]} vote
      </div>
    )
  return (
    <div>
      has {points[selected]} votes
    </div>
  )
}

export default App;
