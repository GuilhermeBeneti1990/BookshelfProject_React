import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import './BooksHome.css'

import { baseURL, showDate, orderBy } from '../../util/helper'
import { showCompleteAlert } from '../errorOrSuccess/errorOrSuccess'

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: ''},
    categories: [],
    list: [],
    editing: false,
    orderAsc: false,
    orderIconClass: 'desc'
}

export default class BooksListWithoutCategory extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseURL() + "/books").then(resp => {
            this.setState({ list: resp.data })
        })
    }

    getUpdatedList(book, add = true) {
        const list = this.state.list.filter(b => b.id !== book.id)
        if(add) list.unshift(book)
        return list
    }

    remove(book) {
        showCompleteAlert('question', 'Do you want to delete this book?', true, 'Yes', 'No')
            .then((result) => {
            if(result.value) {
                axios.delete(`${baseURL()}/books/${book.id}`).then(resp => {
                    const list = this.getUpdatedList(book, false)
                    this.setState({ list })
                })
            } else if(result.dismiss === Swal.DismissReason.cancel) {
                return
            }
        })
    }

    orderBy() {
        if(this.state.orderAsc) {
            var list = this.state.list.sort(orderBy)
            this.setState({ orderAsc: false, orderIconClass: "desc"})
        } else {
            var list = this.state.list.sort(orderBy).reverse()
            this.setState({ orderAsc: true, orderIconClass: "asc" })
        }
        this.setState({ list })

    }

    renderTable() {
        return(
            <table className="table table-striped table-hover mt-4">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th><i onClick={() => this.orderBy()} className={`fa fa-sort-alpha-${this.state.orderIconClass} sortIcon`}></i> Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Publication Date</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(book => {
            if(book.category == "") {
                return (
                    <tr key={book.id}>
                        <td>#{book.id}</td>
                        <td><Link to={"/books/details/" + book.id}><i className="fa fa-book"></i> {book.title}</Link></td>
                        <td>{book.author}</td>
                        <td><span className="noCategory">Without Category</span></td>
                        <td>{showDate(book.createdDate)}</td>
                        <td><button className="btn btn-info" onClick={() => this.props.loadFunction(book)}><i className="fa fa-pencil"></i></button></td>
                        <td> <button className="btn btn-danger ml-2" onClick={ () => this.remove(book) }><i className="fa fa-trash"></i></button></td>
                    </tr>
                )
            }
        })
    }

    render() {
        return (
            this.renderTable()
        )
    }
}

BooksListWithoutCategory.PropTypes = {
    loadFunction: PropTypes.func
}