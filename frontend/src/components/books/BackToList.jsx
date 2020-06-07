import React from 'react'
import { Link } from 'react-router-dom'

export default props => (
    <div className="row">
        <div className="col-12 d-flex justify-content-end">
            <Link to="/books"><i className="fa fa-arrow-left"></i> Back to list</Link>
        </div>
    </div>
)