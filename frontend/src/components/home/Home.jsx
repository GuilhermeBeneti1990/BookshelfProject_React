import './Home.css'
import home_img from '../../assets/imgs/home_img.jpg'
import React from 'react'

import Main from '../template/Main'

export default props =>
    <Main icon="home" subtitle="Home">
        <div className="home_title display-4"><b>Bookshelf</b></div>
        <hr />
        <div className="home_img mb-4">
            <img src={home_img} alt="Books"/>
        </div>
    </Main>