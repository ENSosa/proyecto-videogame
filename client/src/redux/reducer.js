import { FILTER_BY_GENRE, FILTER_BY_ORIGIN, GET_GENRES, GET_PLATFORMS, GET_VIDEOGAMES, ORDER_BY_NAME, ORDER_BY_RATING, SEARCH_VIDEOGAMES } from './action-types';

const initialState = {
    allGames: [],
    gamesBackup: [],
    genres: [],
    platforms: []

};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VIDEOGAMES:
            return {
                ...state,
                allGames: action.payload,
                gamesBackup: action.payload,
            };
        case SEARCH_VIDEOGAMES:
            return {
                ...state,
                allGames: action.payload
            };
        case GET_GENRES:
            return {
                ...state,
                genres: action.payload,
            };

        case GET_PLATFORMS:
            return {
                ...state,
                platforms: action.payload,
            };


        case FILTER_BY_GENRE:
            const allGames = state.gamesBackup;

            if (action.payload === 'all') {
                return {
                    ...state,
                    allGames: allGames
                };
            }

            const filtered = allGames.filter(game => {
                if (!game.genres) return false;
                return game.genres.includes(action.payload);
            });

            return {
                ...state,
                allGames: filtered
            };

        case FILTER_BY_ORIGIN:
            const allGamesOrigin = state.gamesBackup;

            if (action.payload === "all") {
                return {
                    ...state,
                    allGames: allGamesOrigin
                };
            }

            const filterByOrigin = allGamesOrigin.filter(game => {
                if (action.payload === "api") {
                    return typeof game.id === "number"; // API: ID numérico
                } else if (action.payload === "db") {
                    return typeof game.id === "string"; // DB: ID UUID (string)
                }
                return true;
            });

            return {
                ...state,
                allGames: filterByOrigin
            };


        case ORDER_BY_NAME:
            const sortedByName = [...state.allGames].sort((a, b) => {
                if (a.name.toLowerCase() > b.name.toLowerCase()) return action.payload === "asc" ? 1 : -1;
                if (a.name.toLowerCase() < b.name.toLowerCase()) return action.payload === "asc" ? -1 : 1;
                return 0;
            });
            return {
                ...state,
                allGames: sortedByName,
            };

        case ORDER_BY_RATING:
            const sortedByRating = [...state.allGames].sort((a, b) => {
                if (action.payload === "asc") return a.rating - b.rating;
                if (action.payload === "desc") return b.rating - a.rating;
                return 0;
            });
            return {
                ...state,
                allGames: sortedByRating,
            };

        default:
            return state;
    }
};

export default reducer;
