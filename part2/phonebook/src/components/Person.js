import React from "react"

const Person = ({ name, number, id, handleClick }) => {
    return (
        <div>
            {name} {number} &nbsp;
            <button onClick={() => handleClick(name, id)}>delete</button>
        </div>
    )
}

export default Person