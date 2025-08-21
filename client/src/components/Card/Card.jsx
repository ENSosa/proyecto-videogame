import React from 'react'
import './Card.css'
import { Link } from 'react-router-dom';

const Card = ({ id, name, image, genres }) => {
    return (
        <div className="card">
            <Link to={`/detail/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={image} alt={name} className="card-img" />
                <h3 className="card-title">{name}</h3>
                <p className="card-genres">{genres}</p>
            </Link>
        </div>
    );
};

export default Card