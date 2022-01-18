import { createStore, combineReducers } from 'redux'
import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import { composeWithDevTools } from '@redux-devtools/extension'

const store = createStore(combineReducers({
    anecdotes: anecdoteReducer,
    notification: notificationReducer
}), composeWithDevTools)

console.log(store.getState())

export default store