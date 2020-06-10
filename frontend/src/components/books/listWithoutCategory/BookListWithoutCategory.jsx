import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import '../list/BooksList.css'

import { baseURL, orderBy } from '../../../util/helper'

const initialState = {
    orderAsc: false,
    orderIconClass: 'desc',
}

export default class BooksListWithoutCategory extends Component {
    state = { ...initialState }

    orderBy() {
        if(this.state.orderAsc) {
            var list = this.props.list.sort(orderBy)
            this.setState({ orderAsc: false, orderIconClass: "desc"})
        } else {
            var list = this.props.list.sort(orderBy).reverse()
            this.setState({ orderAsc: true, orderIconClass: "asc" })
        }
        this.setState({ list })

    }

    renderTable() {
        console.log(this.props.list)
        const list = this.props.list.filter(b => b.category == "" && b.deleted == false)
        if(list.length > 0) {
            return (
                <React.Fragment>
                    <h6><b>Books without category</b></h6>
                    <table className="table table-striped table-hover mt-4">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th><i onClick={() => this.orderBy()} className={`fa fa-sort-alpha-${this.state.orderIconClass} sortIcon`}></i> Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Edit</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                </React.Fragment>
            )
        } else {
            return (
                <div></div>
            )
        }
    }

    renderRows() {
        return this.props.list.map(book => {
            if(book.category == "" && book.deleted == false) {
                return (
                    <tr key={book.id}>
                        <td>#{book.id}</td>
                        <td><Link to={"/books/details/" + book.id}><i className="fa fa-book bookName"></i> <span className="bookName">{book.title}</span></Link></td>
                        <td>{book.author}</td>
                        <td><span className="noCategory">Without Category</span></td>
                        <td><button className="btn btn-info" onClick={() => this.props.loadFunction(book)}><i className="fa fa-pencil"></i></button></td>
                        <td> <button className="btn btn-danger ml-2" onClick={ () => this.props.removeFunction(book) }><i className="fa fa-trash"></i></button></td>
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

BooksListWithoutCategory.propTypes = {
    loadFunction: PropTypes.func,
    list: PropTypes.array,
    removeFunction: PropTypes.func
}