import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './Detail.css'; // Podés crearle estilos si querés

const Detail = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/videogames/${id}`);
                setGame(response.data);
            } catch (error) {
                console.error('Error al cargar el detalle:', error);
            }
        };

        fetchGame();
    }, [id]);

    if (!game) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="detail-container">
            <button onClick={() => navigate(-1)}>volver</button>
            <h1>{game.name}</h1>
            <img src={game.image} alt={game.name} />
            <p><strong>Rating:</strong> {game.rating}</p>
            <p><strong>Descripción:</strong> {game.description}</p>
            <p><strong>Fecha de lanzamiento:</strong> {game.released}</p>
            <p><strong>Plataformas:</strong> {game.platforms?.join(', ')}</p>
            <p><strong>Géneros:</strong> {game.genres?.join(', ')}</p>
        </div>
    );
};

export default Detail;
