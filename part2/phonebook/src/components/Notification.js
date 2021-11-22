import React from "react"

const Notification = ({noteObj: { message, success }}) => {
    let style = {
        color: 'red',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    if (success === true) {
        style.color = 'green'
    }

    if (message === undefined) {
        return null
    }

    return (
        <div style={style}>
            {message}
        </div>
    )
}

export default Notification