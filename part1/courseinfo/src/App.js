import React from 'react'

const App = () => {
  const course = 'Half Stack application development'
  const content = [{part: 'Fundamentals of React', exercises: 10},
                   {part: 'Using props to pass data', exercises: 7},
                   {part: 'State of a component', exercises: 10}]

  return (
    <div>
      <Header course={course}/>
      <Content content={content}/>
      <Total total={content.reduce((acc, content) => acc + content.exercises, 0)}/>
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <>
    <p>
      {props.content[0].part} {props.content[0].exercises}
    </p>
    <p>
      {props.content[1].part} {props.content[1].exercises}
    </p>
    <p>
      {props.content[2].part} {props.content[2].exercises}
    </p>
    </>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.total}</p>
  )
}

export default App