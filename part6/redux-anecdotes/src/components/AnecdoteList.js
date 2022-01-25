import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const Anecdote = ({ anecdote }) => {
    const dispatch = useDispatch()

    const vote = () => {
        dispatch(voteAnecdote(anecdote)).then(() => {
                dispatch(setNotification(`you voted '${anecdote.content}'`))
            })
    }

    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={vote}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state =>
        state
            .anecdotes
            .filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase())))
    return (
        anecdotes.map(anecdote =>
            <Anecdote key={anecdote.id} anecdote={anecdote} />
    ))
}

export default AnecdoteList