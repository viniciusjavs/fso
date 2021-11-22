import React from "react"
import Person from './Person'

const Persons = ({ persons, handleDel }) => {
    return (
        <div>
            {persons.map(({name, number, id}) => <Person key={id} name={name} number={number} id={id} handleClick={handleDel} />)}
        </div>
    )
}

export default Persons