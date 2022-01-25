import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'VOTE':
      return state
                .map(a => a.id !== action.data.id ? a : {...a, votes: a.votes + 1})
                .sort((a, b) => b.votes - a.votes)
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
  }
  return state
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    await anecdoteService.updateAnecdote({...anecdote, votes: anecdote.votes + 1})
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id }
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: anecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

export default anecdoteReducer