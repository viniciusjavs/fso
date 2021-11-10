import React from "react"

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

  export default Course