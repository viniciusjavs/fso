import React from "react"
import Person from './Person'

const Persons = ({ persons }) => {
    return (
        <div>
            {persons.map(({name, number, id}) => <Person key={id} name={name} number={number} />)}
        </div>
    )
}

export default Persons