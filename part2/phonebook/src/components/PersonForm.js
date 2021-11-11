import React from "react"

const PersonForm = ({ addPerson, name, handleNameChange, number, handleNumberChange }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                <label htmlFor="name" >name:</label>
                <input id="name" value={name} onChange={handleNameChange}/>
            </div>
            <div>
                <label htmlFor="number">number:</label>
                <input value={number} onChange={handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm