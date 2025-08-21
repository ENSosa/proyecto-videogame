import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav/Nav'
import SearchBar from '../../components/SearchBar/SearchBar'
import Card from '../../components/Card/Card'
import './Home.css'
import { useDispatch, useSelector } from 'react-redux'
import { getVideogames, getGenres, filterByGenre, filterByOrigin, orderByName, orderByRating } from '../../redux/actions'
import { Link } from 'react-router-dom'

const Home = () => {
    const dispatch = useDispatch();
    const allGames = useSelector((state) => state.allGames);

    // 🆕 Estado local
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(15);

    useEffect(() => {
        dispatch(getVideogames());
        dispatch(getGenres())
    }, [dispatch]);

    // 🧮 Calculamos los índices
    const indexLastGame = currentPage * gamesPerPage;
    const indexFirstGame = indexLastGame - gamesPerPage;
    const currentGames = allGames.slice(indexFirstGame, indexLastGame);

    const handlePaginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const genres = useSelector((state) => state.genres);

    const handleFilterGenre = (e) => {
        dispatch(filterByGenre(e.target.value));
    };

    return (
        <div className="home-container">
            {/* HEADER: izq (logo) - centro (search) - der (links) */}
            <header className="header">
                <div className="header__left">
                    <h1 className="logo-title">VideoGames</h1>
                </div>

                <div className="header__center">
                    <SearchBar />
                </div>
                <div className="header__right">
                    <div className="nav-links">
                        <Link to="/home" className="nav-link">Inicio</Link>
                        <Link to="/create" className="nav-link">Crear Videojuego</Link>
                    </div>
                </div>

            </header>

            {/* FILTROS centrados */}
            <div className="filters-bar">
                <select onChange={handleFilterGenre}>
                    <option value="all">Géneros</option>
                    {genres.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>

                <select onChange={(e) => dispatch(filterByOrigin(e.target.value))}>
                    <option value="all">Origen</option>
                    <option value="api">API</option>
                    <option value="db">Base de datos</option>
                </select>

                <select onChange={(e) => dispatch(orderByName(e.target.value))}>
                    <option value="">Ordenar por Nombre</option>
                    <option value="asc">A - Z</option>
                    <option value="desc">Z - A</option>
                </select>

                <select onChange={(e) => dispatch(orderByRating(e.target.value))}>
                    <option value="">Ordenar por Rating</option>
                    <option value="asc">Bajo</option>
                    <option value="desc">Alto</option>
                </select>
            </div>

            {/* PAGINADO */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(allGames.length / gamesPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => handlePaginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* GRID DE CARDS */}
            <div className="cards-container">
                {currentGames.map((game) => (
                    <Card
                        key={game.id}
                        id={game.id}
                        name={game.name}
                        image={game.image}
                        genres={game.genres?.join(', ')}
                    />
                ))}
            </div>
        </div>
    );

};
export default Home