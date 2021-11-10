import React from 'react'

const App = () => {
  const courses = [
    {
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
        },
        {
          id: 4,
          name: 'Redux',
          exercises: 11
        }
      ]
    },
    {
      id: 2,
      name: 'Node.js',
      parts: [
        {
          id: 1,
          name: 'Routing',
          exercises: 3
        },
        {
          id: 2,
          name: 'Middlewares',
          exercises: 7
        }
      ]
    }
  ]

  return <Course courses={courses} />
}

const Course = ({courses}) => {
  return (
    <>
      {courses.map(({id, name, parts}) =>
        <div key={id}>
          <Header name={name} />
          <Content parts={parts} />
          <Total parts={parts} />
        </div>
      )}
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