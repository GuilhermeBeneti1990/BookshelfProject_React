import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import BooksHome from '../components/books/BooksHome'
import BookDetail from '../components/books/BookDetail'
import BooksByCategory from '../components/books/BooksByCategory'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/books' component={BooksHome} />
        <Route path='/books/details/:id' component={BookDetail} />
        <Route path='/books/category/:id' component={BooksByCategory} />
        <Redirect from='*' to='/' />
    </Switch>