import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import './BookDetail.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setBook, setComment, setCommentList } from '../../../actions/index'

import { date, baseURL } from '../../../util/helper'
import { showAlert } from '../../errorOrSuccess/errorOrSuccess'

const headerProps = {
    icon: 'book',
    subtitle: 'Details',
    noComment: ''
}

const initialState = {
    comment: {id: '', author: '', body: '', timestamp: '', deleted: false},
    editing: false
}

class CommentForm extends Component {
    state = { ...initialState }

    updateField(event) {
        var comment = { ...this.props.comment }
        comment[event.target.name] = event.target.value
        this.props.setComment(comment)
    }

    clear() {
        this.props.setComment(initialState.comment)
        this.setState({ editing: false })
    }

    async save() {
        if(!this.props.comment.author == "") {
            if(!this.props.comment.body =="") {
                const comment = {
                    timestamp: date(),
                    author: this.props.comment.author,
                    body: this.props.comment.body,
                    parentId: this.props.parentId,
                    id: this.props.comment.id,
                    deleted: false
                }
                const method = comment.id ? 'put': 'post'
                const url = comment.id ? `${baseURL()}/comments/${comment.id}` : baseURL() + "/comments"
                await axios[method](url, comment)
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

    render() {
        return (
            <div className="form">
                <div className="row">
                <div className="col-12 col-md-12 col-lg-4">
                        <div className="form-group">
                            <label><h6>Comment owner</h6></label>
                            <input type="text" className="form-control" name="author" value={this.props.comment.author} onChange={ e => this.updateField(e) } placeholder="Who are you?"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-6">
                        <div className="form-group">
                            <label><h6>Comment</h6></label>
                            <input type="text" className="form-control" name="body" value={this.props.comment.body} onChange={ e => this.updateField(e) } placeholder="Inser your comment about this book"/>
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
}

const mapStateToProps = store => ({
    book: store.bookState.book,
    comment: store.commentState.comment,
    list: store.commentState.list
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setBook,
    setComment,
    setCommentList }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm)

CommentForm.propTypes = {
    parentId: PropTypes.number
}