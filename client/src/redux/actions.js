import axios from 'axios';
import { FILTER_BY_GENRE, FILTER_BY_ORIGIN, GET_GENRES, GET_PLATFORMS, GET_VIDEOGAMES, ORDER_BY_NAME, ORDER_BY_RATING, SEARCH_VIDEOGAMES } from './action-types';

export const getVideogames = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:3001/videogames');
            dispatch({
                type: GET_VIDEOGAMES,
                payload: response.data,
            });
        } catch (error) {
            console.error("Error al obtener videojuegos:", error);
        }
    };
};

export const getGenres = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:3001/genres');
            dispatch({
                type: GET_GENRES,
                payload: response.data,
            });

        } catch (error) {
            throw Error(error.message)
        }
    }
};
export const filterByGenre = (genre) => {
    return {
        type: FILTER_BY_GENRE,
        payload: genre,
    };
};
export const filterByOrigin = (origin) => {
    return {
        type: FILTER_BY_ORIGIN,
        payload: origin
    }
}
export const orderByName = (order) => {
    return {
        type: ORDER_BY_NAME,
        payload: order
    }
}
export const orderByRating = (order) => {
    return {
        type: ORDER_BY_RATING,
        payload: order
    }
}
export const searchVideogames = (name) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`http://localhost:3001/videogames?name=${name}`);
            dispatch({
                type: SEARCH_VIDEOGAMES,
                payload: response.data
            });
        } catch (error) {
            console.error("Error al buscar videojuegos:", error);
            alert("No se encontraron videojuegos con ese nombre.");
        }
    };
};
export const getPlatforms = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("http://localhost:3001/platforms");
            dispatch({
                type: GET_PLATFORMS,
                payload: response.data,
            });
        } catch (error) {
            console.error("Error al obtener plataformas:", error);
        }
    };
};
export const createVideogame = (formData) => {
    return async () => {
        try {
            const response = await axios.post('http://localhost:3001/videogames', formData);
            alert('¡Videojuego creado con éxito!');
            return response.data;
        } catch (error) {
            console.error("Error al crear videojuego:", error);
            alert('Hubo un error al crear el videojuego');
        }
    };
};



