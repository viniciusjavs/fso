import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { voteById } from '../reducers/anecdoteReducer'
import { changeNotification, clearNotification } from "../reducers/notificationReducer"

const Anecdote = ({ anecdote }) => {
    const dispatch = useDispatch()

    const vote = () => {
        dispatch(voteById(anecdote.id))
        dispatch(changeNotification(`you voted '${anecdote.content}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
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