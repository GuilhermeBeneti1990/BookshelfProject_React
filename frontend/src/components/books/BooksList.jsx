import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import Main from '../template/Main'

const headerProps = {
    icon: 'book',
    title: 'Lits of Books',
    subtitle: 'List'
}

const baseUrl = 'http://localhost:3001'

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: ''},
    categories: [],
    list: [],
    editing: false
}

export default class BooksList extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl + "/books").then(resp => {
            this.setState({ list: resp.data })
        })
        axios(baseUrl + "/categories").then(resp => {
            this.setState({ categories: resp.data })
        })
    }

    clear() {
        this.setState({ book: initialState.book, editing: false })
    }

    save() {
        const book = this.state.book
        if(!book.title == "") {
            if(!book.description == "") {
                if(!book.author == "") {
                    if(!book.createdDate =="") {
                        const method = book.id ? 'put' : 'post'
                        const url = book.id ? `${baseUrl}/books/${book.id}` : baseUrl + "/books"
                        axios[method](url, book)
                            .then(resp =>{
                                const list = this.getUpdatedList(resp.data)
                                this.setState({ book: initialState.book, list, editing: false })
                            })
                            window.location.reload(false);
                    } else {
                        alert("Books date is required")
                    }
                } else {
                    alert("Books author is required")
                }
            } else {
                alert("Books description is required")
            }
        } else {
            alert("Books title is required")
        }
    }

    getUpdatedList(book, add = true) {
        const list = this.state.list.filter(u => u.id !== book.id)
        if(add) list.unshift(book)
        return list
    }

    updateField(event) {
        const book = { ...this.state.book }
        book[event.target.name] = event.target.value
        this.setState({ book })
    }

    load(book) {
        this.setState({ book, editing: true })
    }

    remove(book) {
        axios.delete(`${baseUrl}/books/${book.id}`).then(resp => {
            const list = this.getUpdatedList(book, false)
            this.setState({ list })
        })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" className="form-control" name="title" value={this.state.book.title} onChange={ e => this.updateField(e) } placeholder="Insert the title"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" className="form-control" name="description" value={this.state.book.description} onChange={ e => this.updateField(e) } placeholder="Describe this book"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" className="form-control" name="author" value={this.state.book.author} onChange={ e => this.updateField(e) } placeholder="Who is the author?"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Publication Date</label>
                            <input type="text" className="form-control" name="createdDate" value={this.state.book.createdDate} onChange={ e => this.updateField(e) } placeholder=""/>
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Category</label>
                            <select class="form-control" name="category" onChange={ e => this.updateField(e) } value={this.state.book.category}>
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
        )
    }

    renderTable() {
        return(
            <table className="table table-striped table-hover mt-4">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
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
            return (
                <tr key={book.id}>
                    <td>{book.id}</td>
                    <td><Link to={"/books/details/" + book.id}>{book.title}</Link></td>
                    <td>{book.author}</td>
                    <td>{book.category == "reading" ? "Reading" : book.category == "wantToRead" ? "Want To Read" : book.category == "read" ? "Read" : ""}</td>
                    <td>{book.createdDate}</td>
                    <td><button className="btn btn-info" onClick={ () => this.load(book) }><i className="fa fa-pencil"></i></button></td>
                    <td> <button className="btn btn-danger ml-2" onClick={ () => this.remove(book) }><i className="fa fa-trash"></i></button></td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}