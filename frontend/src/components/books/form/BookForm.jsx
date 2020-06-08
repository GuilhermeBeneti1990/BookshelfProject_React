import React, { Component } from 'react'
import axios from 'axios'
import { showAlert } from '../../errorOrSuccess/errorOrSuccess'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setBook, setListOfBook, setListOfBookWithoutCategory, setCategories, setEditing, setEditingFomrClass } from '../../../actions/index'

import { baseURL } from '../../../util/helper'

const headerProps = {
    icon: 'file-text',
    subtitle: 'List'
}

const initialState = {
    book: {id: '', title: '', description: '', author: '', timestamp: '', category: '', deleted: false},
    orderAsc: false,
    orderIconClass: 'desc'
}

class BookForm extends Component {
    state = { ...initialState }

    async componentWillMount() {
        this.props.setBook(initialState.book)
        await axios(baseURL() + "/categories").then(resp => {
            this.props.setCategories(resp.data)
        })
    }

    clear() {
        this.props.setBook(initialState.book)
        this.props.setEditing(false)
        this.props.setEditingFomrClass('')
    }

    async save() {
        const book = this.props.book
        if(!book.title == "") {
            if(!book.description == "") {
                if(!book.author == "") {
                    const method = book.id ? 'put' : 'post'
                    const methodResultString = book.id ? 'Book Updated' : 'Book Created'
                    const url = book.id ? `${baseURL()}/books/${book.id}` : baseURL() + "/books"
                    await axios[method](url, book)
                        .then(resp => {
                            this.props.setEditing(false)
                            this.setState({ book: initialState.book})
                            showAlert('success', methodResultString).then((result) => {
                                if(result.value) {
                                    window.location.reload(false);
                                }
                            })
                        })
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

    updateField(event) {
        const book = { ...this.props.book }
        book[event.target.name] = event.target.value
        this.props.setBook(book)
    }

    render() {
        return (
            <React.Fragment>
                <h5>{!this.state.editing ? "Register a book" : "Editing a book"}</h5>
                <div className="form">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-4">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" className={`form-control ${this.props.editingForm}`} name="title" value={this.props.book.title} onChange={ e => this.updateField(e) } placeholder="Insert the title"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-8">
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" className={`form-control ${this.props.editingForm}`} name="description" value={this.props.book.description} onChange={ e => this.updateField(e) } placeholder="Describe this book"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-4">
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" className={`form-control ${this.props.editingForm}`} name="author" value={this.props.book.author} onChange={ e => this.updateField(e) } placeholder="Who is the author?"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <div className="form-group">
                            <label>Category</label>
                            <select className={`form-control ${this.props.editingForm}`} name="category" onChange={ e => this.updateField(e) } value={this.props.book.category}>
                                {this.props.categories.map((category, index) => <option value={category}>
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
                        {this.props.editing ?
                            <button className="btn btn-danger ml-2" onClick={ e => this.clear(e) }>
                                Cancel
                            </button>
                        : <div></div> }
                    </div>
                </div>
            </div>
            {this.props.list.filter(b => !b.deleted).length == 0 ?
            <div><span className="noBooks">No books where found in our database, fill the form and register a new one!</span></div>
            :<div></div>}
            </React.Fragment>
        )
    }

}

const mapStateToProps = store => ({ 
    book: store.bookState.book,
    list: store.bookState.listOfBooks,
    editing: store.bookState.editing,
    editingForm: store.bookState.editingForm,
    categories: store.categoryState.categories
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setBook,
    setListOfBook,
    setListOfBookWithoutCategory,
    setEditing,
    setEditingFomrClass,
    setCategories }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BookForm)