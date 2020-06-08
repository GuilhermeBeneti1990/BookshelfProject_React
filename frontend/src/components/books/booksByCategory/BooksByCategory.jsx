import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BooksByCategory.css'
import Main from '../../template/Main'
import axios from 'axios'
import BackComponent from '../BackToList'
import { baseURL, showCategoryFormated } from '../../../util/helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setListOfBook } from '../../../actions/index'

const headerProps = {
    icon: 'bookmark',
    subtitle: ' Books by category',
}

const initialState = {
    categoryColor: ''
}

class BooksByCategory extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseURL() + "/books").then(resp => {
            let newList = []
            resp.data.map((book) => {
                if(book.category == this.props.match.params.id) {
                    newList.push(book)
                }
            })
            this.props.setListOfBook(newList)
        })
        this.showColorCategory(this.props.match.params.id)
    }

    showColorCategory(category) {
        console.log(category)
        switch(category) {
            case 'reading':
                this.setState({ categoryColor: 'reading'})
                break
            case 'read':
                this.setState({ categoryColor: 'read'})
                break
            case 'wantToRead':
                this.setState({ categoryColor: 'wantToRead'})
                break
            default:
                break
        }
    }

    renderListOfBooks() {
        return this.props.list.map((book, index) => {
            return ( 
                <ul key={index}>
                    <li>
                        <h6><Link to={"/books/details/" + book.id}><i className="fa fa-book bookName"></i> <span className="bookName">{book.title}</span></Link></h6>
                    </li>
                    <li>
                        <span><b>Author: </b></span>{book.author}
                    </li>
                </ul>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                <h5>Category of this book: <span className={`category ${this.state.categoryColor}`}>{showCategoryFormated(this.props.match.params.id)}</span></h5>
                <hr/>
                {this.renderListOfBooks()}
                <BackComponent />
            </Main>
        )
    }
}

const mapStateToProps = store => ({ 
    list: store.bookState.listOfBooks,
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setListOfBook }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BooksByCategory)