import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BooksByCategory.css'
import Main from '../template/Main'
import axios from 'axios'
import BackComponent from './BackToList'
import { baseURL, showCategoryFormated } from '../../util/helper'

const headerProps = {
    icon: 'bookmark',
    subtitle: ' Books by category',
}

const initialState = {
    list: [],
    orderAsc: false,
    orderIconClass: 'desc',
    categoryColor: ''
}

export default class BooksByCategory extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseURL() + "/books").then(resp => {
            let newList = []
            resp.data.map((book) => {
                if(book.category == this.props.match.params.id) {
                    newList.push(book)
                }
            })
            this.setState({ list: newList })
        })
        this.showColorCategory(this.props.match.params.id)
    }

    showColorCategory(category) {
        console.log(category)
        switch(category) {
            case 'reading':
                this.setState({ categoryColor: 'reading'})
                break
            case 'read':
                this.setState({ categoryColor: 'read'})
                break
            case 'wantToRead':
                this.setState({ categoryColor: 'wantToRead'})
                break
            default:
                break
        }
    }

    renderListOfBooks() {
        return this.state.list.map((book, index) => {
            return ( 
                <ul key={index}>
                    <li>
                        <h6><Link to={"/books/details/" + book.id}><i className="fa fa-book"></i> {book.title}</Link></h6>
                    </li>
                    <li>
                        <span><b>Author: </b></span>{book.author}
                    </li>
                </ul>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                <h5>Category of this book: <span className={`category ${this.state.categoryColor}`}>{showCategoryFormated(this.props.match.params.id)}</span></h5>
                <hr/>
                {this.renderListOfBooks()}
                <BackComponent />
            </Main>
        )
    }
}