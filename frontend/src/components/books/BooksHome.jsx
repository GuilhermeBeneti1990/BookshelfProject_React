import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Main from '../template/Main'
import BookListWithoutCategory from './BookListWithoutCategory'
import { showAlert, showCompleteAlert } from '../errorOrSuccess/errorOrSuccess'
import './BooksHome.css'

import { date, baseURL, showDate, orderBy, showCategoryFormated } from '../../util/helper'

const headerProps = {
    icon: 'file-text',
    subtitle: 'List'
}

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: false},
    categories: [],
    list: [],
    listWithoutCategory: [],
    editing: false,
    orderAsc: false,
    orderIconClass: 'desc',
    editingForm: ''
}

export default class BooksHome extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseURL() + "/books").then(resp => {
            this.setState({ list: resp.data, listWithoutCategory: resp.data.filter(b => b.category == "") })
        })
        axios(baseURL() + "/categories").then(resp => {
            this.setState({ categories: resp.data })
        })
    }

    clear() {
        this.setState({ book: initialState.book, editing: false, editingForm: '' })
    }

    save() {
        const book = this.state.book
        if(!book.title == "") {
            if(!book.description == "") {
                if(!book.author == "") {
                    if(!book.createdDate =="") {
                        const method = book.id ? 'put' : 'post'
                        const methodResultString = book.id ? 'Book Updated' : 'Book Created'
                        const url = book.id ? `${baseURL()}/books/${book.id}` : baseURL() + "/books"
                        axios[method](url, book)
                            .then(resp => {
                                const list = this.getUpdatedList(resp.data)
                                this.setState({ book: initialState.book, list, editing: false })
                                showAlert('success', methodResultString).then((result) => {
                                    if(result.value) {
                                        window.location.reload(false);
                                    }
                                })
                            })
                    } else {
                          showAlert("error", "Books date is required!")
                    }
                } else {
                    showAlert("error", "Books author is required!")
                }
            } else {
                showAlert("error", "Books description is required!")
            }
        } else {
            showAlert("error", "Books title is required!")
        }
    }

    getUpdatedList(book, add = true) {
        const list = this.state.list.filter(b => b.id !== book.id)
        if(add) list.unshift(book)
        return list
    }

    updateField(event) {
        const book = { ...this.state.book }
        book[event.target.name] = event.target.value
        this.setState({ book })
    }

    load(book) {
        this.setState({ book, editing: true, editingForm: 'inputBorder' })
        this.topFunction()
    }

    topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
            var list = this.state.list.sort(orderBy)
            this.setState({ orderAsc: false, orderIconClass: "desc"})
        } else {
            var list = this.state.list.sort(orderBy).reverse()
            this.setState({ orderAsc: true, orderIconClass: "asc" })
        }
        this.setState({ list })

    }

    renderForm() {
        return (
            <React.Fragment>
                <h5>{!this.state.editing ? "Register a book" : "Editing a book"}</h5>
                <div className="form">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-4">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" className={`form-control ${this.state.editingForm}`} name="title" value={this.state.book.title} onChange={ e => this.updateField(e) } placeholder="Insert the title"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-8">
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" className={`form-control ${this.state.editingForm}`} name="description" value={this.state.book.description} onChange={ e => this.updateField(e) } placeholder="Describe this book"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-4">
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" className={`form-control ${this.state.editingForm}`} name="author" value={this.state.book.author} onChange={ e => this.updateField(e) } placeholder="Who is the author?"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-3">
                        <div className="form-group">
                            <label>Publication Date</label>
                            <input type="text" className={`form-control ${this.state.editingForm}`} name="createdDate" value={this.state.book.createdDate} onChange={ e => this.updateField(e) } placeholder="" type="date"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="form-group">
                            <label>Category</label>
                            <select className={`form-control ${this.state.editingForm}`} name="category" onChange={ e => this.updateField(e) } value={this.state.book.category}>
                                {this.state.categories.map((category, index) => <option value={category}>
                                    {category == "reading" ? "Reading" : category == "wantToRead" ? "Want To Read" : category == "read" ? "Read" : ""}
                                </option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-info" onClick={ e => this.save(e) }>
                            Save
                        </button>
                        {this.state.editing ?
                            <button className="btn btn-danger ml-2" onClick={ e => this.clear(e) }>
                                Cancel
                            </button>
                        : <div></div> }
                    </div>
                </div>
            </div>
            {this.state.list.filter(b => !b.deleted).length == 0 ?
            <div><span className="noBooks">No books where founded in our database, fill the form and register a new one!</span></div>
            :<div></div>}
            </React.Fragment>
        )
    }

    renderTable() {
        const list = this.state.list.filter(b => b.category != "" && !b.deleted)
        if(list.length > 0) {
            return(
                <React.Fragment>
                    <h6><b>Books with category</b></h6>
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
                    <hr/>
                </React.Fragment>
            )
        } else {
            return (
                <div>
                </div>
            )
        }
    }

    renderRows() {
        return this.state.list.map(book => {
            if(!book.category == "" && book.deleted == false) {
                return (
                    <tr key={book.id}>
                        <td>#{book.id}</td>
                        <td><Link to={"/books/details/" + book.id}><i className="fa fa-book"></i> {book.title}</Link></td>
                        <td>{book.author}</td>
                        <td><a href={`/books/category/${book.category}`}>{showCategoryFormated(book.category)}</a></td>
                        <td>{showDate(book.createdDate)}</td>
                        <td><button className="btn btn-info" onClick={ () => this.load(book) }><i className="fa fa-pencil"></i></button></td>
                        <td> <button className="btn btn-danger ml-2" onClick={ () => this.remove(book) }><i className="fa fa-trash"></i></button></td>
                    </tr>
                )
            }
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                <BookListWithoutCategory loadFunction={this.load.bind(this)} list={this.state.listWithoutCategory} />
                <hr/>
                {this.renderTable()}
            </Main>
        )
    }
}