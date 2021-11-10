import React from 'react'

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        id: 1,
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        id: 2,
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        id: 3,
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return <Course course={course} />
}

const Course = ({course: {name, parts}}) => {
  return (
    <>
      <Header name={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  )
}

const Header = ({ name }) => <h1>{name}</h1>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(({id, name, exercises}) => <Part key={id} name={name} exercises={exercises} />)}
    </div>
  )
}

const Part = ({name, exercises}) => <p> {name} {exercises} </p>

const Total = ({parts}) => {
  return (
    <p>
      <b>Total of {parts.reduce((acc, {exercises}) => acc + exercises, 0)} exercises</b>
    </p>
  )
}

export default App