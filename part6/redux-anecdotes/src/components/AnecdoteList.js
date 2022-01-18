import React from "react"
import { useDispatch, useSelector } from 'react-redux'
import { voteById } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote }) => {
    const dispatch = useDispatch()
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => dispatch(voteById(anecdote.id))}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    return (
        anecdotes.map(anecdote =>
            <Anecdote key={anecdote.id} anecdote={anecdote} />
    ))
}

export default AnecdoteList