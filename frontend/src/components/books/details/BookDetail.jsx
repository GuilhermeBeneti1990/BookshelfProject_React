import React, { Component } from 'react'
import axios from 'axios'
import './BookDetail.css'
import BackComponent from '../BackToList'
import Main from '../../template/Main'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setBook, setComment, setCommentList } from '../../../actions/index'

import { baseURL, showCategoryFormated } from '../../../util/helper'
import CommentList from './CommentList'
import CommentForm from './CommentForm'

const headerProps = {
    icon: 'book',
    subtitle: 'Details',
}

class BookDetail extends Component {

    async componentWillMount() {
        await axios(baseURL() + "/books/" + this.props.match.params.id).then(resp => {
            this.props.setBook(resp.data)
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <label><h6><i className="fa fa-book"></i> Title:</h6> </label>
                        <span>  {this.props.book.title}</span>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label><h6><i className="fa fa-user"></i> Author:</h6> </label>
                        <span> {this.props.book.author}</span>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label><h6><i className="fa fa-check-square-o"></i> Status of reading:</h6></label>
                        <span> <a href={`/books/category/${this.props.book.category}`}>{showCategoryFormated(this.props.book.category)}</a></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6><i className="fa fa-info-circle"></i> Description:</h6></label>
                        <span> {this.props.book.description}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <label><h6><i className="fa fa-comments"></i> Comments:</h6></label>
                        <CommentList parentId={this.props.match.params.id}/>
                    </div>
                </div>
                <CommentForm parentId={this.props.match.params.id} />
                <BackComponent />
            </Main>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookDetail)