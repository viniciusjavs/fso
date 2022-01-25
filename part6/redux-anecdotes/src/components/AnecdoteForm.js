import React from "react"
import { connect } from "react-redux"
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = ({ createAnecdote, setNotification }) => {
    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        createAnecdote(content).then(() => {
            setNotification(`Created '${content}'`)
        })
      }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote" /></div>
                <button>create</button>
            </form>
        </div>
    )
}

const mapDispatchToProps = { createAnecdote, setNotification }

export default connect(null, mapDispatchToProps)(AnecdoteForm)