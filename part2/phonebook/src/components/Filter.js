import React from "react"

const Filter = ({ name, handleChange }) => {
    return (
        <div>
            filter shown with: <input value={name} onChange={handleChange} />
        </div>
    )
}

export default Filter