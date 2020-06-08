import { bookReducer } from './bookReducer'
import { categoryReducer } from './categoryReducer'
import { commentReducer } from './commentReducer'
import { combineReducers } from 'redux'

export const Reducers = combineReducers({
    bookState: bookReducer,
    categoryState: categoryReducer,
    commentState: commentReducer
})