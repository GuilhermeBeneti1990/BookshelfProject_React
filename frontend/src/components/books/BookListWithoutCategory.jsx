import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { showAlert, showCompleteAlert } from '../errorOrSuccess/errorOrSuccess'
import './BooksHome.css'

import { date, baseURL, showDate, orderBy } from '../../util/helper'

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: false},
    categories: [],
    editing: false,
    orderAsc: false,
    orderIconClass: 'desc',
}

export default class BooksListWithoutCategory extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseURL() + "/books").then(resp => {
            this.setState({ list: resp.data })
        })
    }

    getUpdatedList(book, add = true) {
        const list = this.props.list.filter(b => b.id !== book.id)
        if(add) list.unshift(book)
        return list
    }

    remove(book) {
        showCompleteAlert('question', 'Do you want to delete this book?', true, 'Yes', 'No')
            .then((result) => {
            if(result.value) {
                //When a book is deleted, all your comments also will receive the flag deleted: false
                axios(baseURL() + "/comments").then(resp => {
                    for(let i = 0; i < resp.data.length; i ++) {
                        if(resp.data[i].parentId == book.id) {
                            const comment = {
                                timestamp: date(),
                                author:resp.data[i].author,
                                body: resp.data[i].body,
                                parentId: resp.data[i].parentId,
                                id: resp.data[i].id,
                                deleted: true
                            }
                            axios['put'](`${baseURL()}/comments/${comment.id}`, comment)
                            .then(resp => {
                                window.location.reload(false);
                            })
                        }
                    }
                })
                const obj = {
                    id: book.id,
                    title: book.title,
                    description: book.description,
                    author: book.author,
                    createdDate: book.createdDate,
                    category: book.category,
                    deleted: true
                }
                axios.put(`${baseURL()}/books/${book.id}`, obj).then(resp => {
                    const list = this.getUpdatedList(book, false)
                    this.setState({ list })
                    window.location.reload(false);
                })
            } else if(result.dismiss === Swal.DismissReason.cancel) {
                return
            }
        })
    }

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
                                <th>Publication Date</th>
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

BooksListWithoutCategory.propTypes = {
    loadFunction: PropTypes.func
}