import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import BooksList from '../components/books/BooksList'
import BookDetail from '../components/books/BookDetail'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/books' component={BooksList} />
        <Route path='/books/details/:id' component={BookDetail} />
        <Redirect from='*' to='/' />
    </Switch>