import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import './BookDetail.css'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setBook, setComment, setCommentList, setEditingComment } from '../../../actions/index'

import { date, baseURL } from '../../../util/helper'
import { showAlert, showCompleteAlert } from '../../errorOrSuccess/errorOrSuccess'

const headerProps = {
    icon: 'book',
    subtitle: 'Details',
    noComment: ''
}

const initialState = {
    noComment: ''
}

class CommentList extends Component {
    state = { ...initialState }

    async componentDidMount() {
        await axios(baseURL() + "/comments").then(resp => {
            var comments = []
            for(let i = 0; i < resp.data.length; i ++) {
                if(resp.data[i].parentId == this.props.book.id && !resp.data[i].deleted) {
                    comments.push(resp.data[i])
                }
            }
            if(comments.length > 0) {
                this.props.setCommentList(comments)
            } else {
                this.setState({ noComment: 'No comments, make one' })
            }
        })
    }

    load(comment) {
        this.props.setComment(comment)
        this.props.setEditingComment(true)
    }

    remove(comment) {
        showCompleteAlert('question', 'Do you want to delete this comment?', true, 'Yes', 'No')
            .then((result) => {
                const obj = {
                    timestamp: date(),
                    author: comment.author,
                    body: comment.body,
                    parentId: this.props.parentId,
                    id: comment.id,
                    deleted: true
                }
            if(result.value) {
                axios.put(`${baseURL()}/comments/${comment.id}`, obj).then(resp => {
                    showAlert('success', 'Comment deleted!')
                    .then((result) => {
                        if(result.value) {
                            window.location.reload(false)
                        }
                    })
                })
            } else if(result.dismiss === Swal.DismissReason.cancel) {
                return
            }
        })
    }

    render() {
        if(this.props.list.length > 0) {
            return this.props.list.map((comment, index) => {
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
        } else {
            return (
                <div>
                    <p className="noComment">{this.state.noComment}</p>
                </div>
            )
        }
    }

}

const mapStateToProps = store => ({
    book: store.bookState.book,
    comment: store.commentState.comment,
    list: store.commentState.list,
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setBook,
    setComment,
    setCommentList,
    setEditingComment }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentList)

CommentList.propTypes = {
    parentId: PropTypes.number
}