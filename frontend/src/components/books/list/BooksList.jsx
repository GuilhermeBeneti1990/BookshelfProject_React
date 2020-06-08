import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Main from '../../template/Main'
import BookListWithoutCategory from '../listWithoutCategory/BookListWithoutCategory'
import { showAlert, showCompleteAlert } from '../../errorOrSuccess/errorOrSuccess'
import './BooksList.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setBook, setListOfBook, setListOfBookWithoutCategory, setEditing, setEditingFomrClass, setCategories } from '../../../actions/index'

import { date, baseURL, orderBy, showCategoryFormated, goToTop } from '../../../util/helper'
import BookForm from '../form/BookForm'

const headerProps = {
    icon: 'file-text',
    subtitle: 'List'
}

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: false},
    orderAsc: false,
    orderIconClass: 'desc'
}

class BooksList extends Component {
    state = { ...initialState }

    async componentWillMount() {
        await axios(baseURL() + "/books").then(resp => {
            this.props.setListOfBook(resp.data)
            this.props.setListOfBookWithoutCategory(resp.data.filter(b => b.category == ""))
        })
        await axios(baseURL() + "/categories").then(resp => {
            this.props.setCategories(resp.data)
        })
    }

    async save() {
        const book = this.props.book
        if(!book.title == "") {
            if(!book.description == "") {
                if(!book.author == "") {
                    if(!book.createdDate =="") {
                        const method = book.id ? 'put' : 'post'
                        const methodResultString = book.id ? 'Book Updated' : 'Book Created'
                        const url = book.id ? `${baseURL()}/books/${book.id}` : baseURL() + "/books"
                        await axios[method](url, book)
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
        const list = this.props.list.filter(b => b.id !== book.id)
        if(add) list.unshift(book)
        return list
    }

    load(book) {
        this.props.setBook(book)
        this.props.setEditing(true)
        this.props.setEditingFomrClass('inputBorder')
        goToTop()
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
                    timestamp: date(),
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
        this.props.setListOfBook(list)

    }

    renderTable() {
        console.log(this.props)
        const list = this.props.list.filter(b => b.category != "" && !b.deleted)
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
        return this.props.list.map(book => {
            if(!book.category == "" && book.deleted == false) {
                return (
                    <tr key={book.id}>
                        <td>#{book.id}</td>
                        <td><Link to={"/books/details/" + book.id}><i className="fa fa-book"></i> {book.title}</Link></td>
                        <td>{book.author}</td>
                        <td><a href={`/books/category/${book.category}`}>{showCategoryFormated(book.category)}</a></td>
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
                <BookForm />
                <BookListWithoutCategory
                    loadFunction={this.load.bind(this)}
                    list={this.props.listWithoutCategory}
                    removeFunction={this.remove.bind(this)}
                    />
                <hr/>
                {this.renderTable()}
            </Main>
        )
    }
}

const mapStateToProps = store => ({ 
    book: store.bookState.book,
    list: store.bookState.listOfBooks,
    listWithoutCategory: store.bookState.listOfBookWithoutCategory,
    categories: store.categoryState.categories
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setBook,
    setListOfBook,
    setListOfBookWithoutCategory,
    setEditing,
    setEditingFomrClass,
    setCategories }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BooksList)