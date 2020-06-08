import React, { Component } from 'react'
import axios from 'axios'
import './BookDetail.css'
import Swal from 'sweetalert2'
import BackComponent from './BackToList'
import Main from '../template/Main'

import { date, baseURL, showDate, showCategoryFormated } from '../../util/helper'
import { showAlert, showCompleteAlert } from '../errorOrSuccess/errorOrSuccess'

const headerProps = {
    icon: 'book',
    subtitle: 'Details',
    noComment: ''
}

const initialState = {
    book: {id: '', title: '', description: '', author: '', createdDate: '', category: '', deleted: false},
    comments: [],
    comment: {id: '', author: '', body: '', timestamp: '', deleted: false},
    editing: false
}

export default class BookDetail extends Component {
    state = { ...initialState }

    async componentWillMount() {
        await axios(baseURL() + "/books/" + this.props.match.params.id).then(resp => {
            this.setState({ book: resp.data })
        })
        await axios(baseURL() + "/comments").then(resp => {
            var comments = []
            for(let i = 0; i < resp.data.length; i ++) {
                if(resp.data[i].parentId == this.state.book.id && !resp.data[i].deleted) {
                    comments.push(resp.data[i])
                }
            }
            if(comments.length >= 1) {
                this.setState({ comments })
            } else {
                this.setState({ noComment: 'No comments, make one' })
            }
        })
    }

    updateField(event) {
        var comment = { ...this.state.comment }
        comment[event.target.name] = event.target.value
        this.setState({ comment })
    }

    load(comment) {
        this.setState({ comment, editing: true })
    }

    clear() {
        this.setState({ comment: initialState.comment, editing: false })
    }

    save() {
        if(!this.state.comment.author == "") {
            if(!this.state.comment.body =="") {
                const comment = {
                    timestamp: date(),
                    author: this.state.comment.author,
                    body: this.state.comment.body,
                    parentId: this.props.match.params.id,
                    id: this.state.comment.id,
                    deleted: false
                }
                const method = comment.id ? 'put': 'post'
                const url = comment.id ? `${baseURL()}/comments/${comment.id}` : baseURL() + "/comments"
                axios[method](url, comment)
                .then(resp => {
                    window.location.reload(false);
                })
            } else {
                showAlert('error', 'No comment to post, write something.')
            }
        } else {
            showAlert('error', 'Author name is required!')
        }
    }

    remove(comment) {
        showCompleteAlert('question', 'Do you want to delete this comment?', true, 'Yes', 'No')
            .then((result) => {
                const obj = {
                    timestamp: date(),
                    author: comment.author,
                    body: comment.body,
                    parentId: this.props.match.params.id,
                    id: comment.id,
                    deleted: true
                }
            if(result.value) {
                axios.put(`${baseURL()}/comments/${comment.id}`, obj).then(resp => {
                    showAlert('success', 'Comment deleted!')
                    .then((result) => {
                        if(result.value) {
                            window.location.reload(false);
                        }
                    })
                })
            } else if(result.dismiss === Swal.DismissReason.cancel) {
                return
            }
        })
    }

    renderComments() {
        return this.state.comments.map((comment, index) => {
            return ( 
                <ul key={index}>
                    {!comment.deleted ? 
                    <li>
                        <span className="date"><b>{comment.timestamp}</b></span>
                        <button className="iconButton trashButton" onClick={ () => this.remove(comment) }><i className="fa fa-trash fa-xs"></i></button><br/>
                        <i className="fa fa-user"></i> <span><b>{comment.author}</b></span> <br/>
                        <i className="fa fa-comment-o comment"></i> <span className="comment">{comment.body}</span> 
                        <button className="iconButton" onClick={ () => this.load(comment) }><i className="fa fa-edit"></i></button><br/>
                        <hr/>
                    </li>
                    : <li></li>}
                </ul>
            )
        })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                <div className="col-12 col-md-12 col-lg-4">
                        <div className="form-group">
                            <label><h6>Comment owner</h6></label>
                            <input type="text" className="form-control" name="author" value={this.state.comment.author} onChange={ e => this.updateField(e) } placeholder="Who are you?"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-6">
                        <div className="form-group">
                            <label><h6>Comment</h6></label>
                            <input type="text" className="form-control" name="body" value={this.state.comment.body} onChange={ e => this.updateField(e) } placeholder="Inser your comment about this book"/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                    <button className="btn btn-info" onClick={ e => this.save(e) }>
                            <i className="fa fa-send"></i>  Send
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

    render() {
        return (
            <Main {...headerProps}>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <label><h6><i className="fa fa-book"></i> Title:</h6> </label>
                        <span>  {this.state.book.title}</span>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label><h6><i className="fa fa-user"></i> Author:</h6> </label>
                        <span> {this.state.book.author}</span>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label><h6><i className="fa fa-check-square-o"></i> Category:</h6></label>
                        <span> <a href={`/books/category/${this.state.book.category}`}>{showCategoryFormated(this.state.book.category)}</a></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6><i className="fa fa-calendar"></i> Publication Date:</h6></label>
                        <span> {showDate(this.state.book.createdDate)}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6><i className="fa fa-info-circle"></i> Description:</h6></label>
                        <span> {this.state.book.description}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6><i className="fa fa-comments"></i> Comments:</h6></label>
                        <p className="noComment">{this.state.noComment}</p>
                        {this.renderComments()}
                    </div>
                </div>
                {this.renderForm()}
                <BackComponent />
            </Main>
        )
    }
}