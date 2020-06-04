import React, { Component } from 'react'
import axios from 'axios'

import Main from '../template/Main'

const headerProps = {
    icon: 'book',
    title: 'Book Info',
    subtitle: 'Details'
}

const baseUrl = 'http://localhost:3001'

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: ''}
}

export default class BookDetail extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl + "/books/" +this.props.match.params.id).then(resp => {
            this.setState({ book: resp.data })
        })
    }

    save() {
       
    }

    updateField(event) {
        
    }

    load(book) {
        
    }

    remove() {
        
    }

    render() {
        return (
            <Main {...headerProps}>
                <div className="row">
                    <div className="col-12 col-md-3">
                        <label><h6>Title:</h6> </label>
                        <span>  {this.state.book.title}</span>
                    </div>
                    <div className="col-12 col-md-3">
                        <label><h6>Author:</h6> </label>
                        <span> {this.state.book.author}</span>
                    </div>
                    <div className="col-12 col-md-3">
                        <label><h6>Status:</h6></label>
                        <span> {this.state.book.category == "reading" ? "Reading" : this.state.book.category == "read" ? "Read" : "Want To Read"}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6>Publication Date:</h6></label>
                        <span> {this.state.book.createdDate}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6>Description:</h6></label>
                        <span> {this.state.book.description}</span>
                    </div>
                </div>
                
            </Main>
        )
    }
}