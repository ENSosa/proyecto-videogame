import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchVideogames } from '../../redux/actions';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            dispatch(searchVideogames(searchTerm));
            setSearchTerm('');
        }
    };

    return (
        <form className="search-form" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder="Buscar videojuego..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
        </form>
    );
};

export default SearchBar;
