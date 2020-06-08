import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import BooksList from '../components/books/list/BooksList'
import BookDetail from '../components/books/details/BookDetail'
import BooksByCategory from '../components/books/booksByCategory/BooksByCategory'


export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/books' component={BooksList} />
        <Route path='/books/details/:id' component={BookDetail} />
        <Route path='/books/category/:id' component={BooksByCategory} />
        <Redirect from='*' to='/' />
    </Switch>