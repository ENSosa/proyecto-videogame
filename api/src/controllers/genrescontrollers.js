// genresController.js
const { Genres } = require('../db');
const axios = require('axios');


// Función para obtener géneros de la API (puedes renombrarla según tu preferencia)
const obtainGenresFromAPI = async () => {
  try {
    // Reemplaza 'URL_DE_LA_API_PARA_OBTENER_GENEROS' con la URL real de la API
    const response = await axios.get('https://api.rawg.io/api/genres?key=1d372a7cdecc43a19f0bd3dee214d98c');
    return response.data;
  } catch (error) {
    console.error('Error al obtener géneros desde la API:', error);
    throw new Error('Error al obtener géneros desde la API');
  }
};

// Controlador para obtener géneros
const getGenresController = async (req, res) => {
  try {
    const genresFromDB = await Genres.findAll();

    if (genresFromDB.length > 0) {
      // Si hay géneros en la base de datos, devolverlos
      const genreNames = genresFromDB.map((genre) => genre.name);
      res.status(200).json(genreNames);
    } else {
      // Si no hay géneros en la base de datos, obtenerlos de la API
      const genresFromAPI = await obtainGenresFromAPI();
      const genreData = genresFromAPI.results.map(g => ({
        name: g.name
      }));
      // Guardar los géneros en la base de datos
      await Genres.bulkCreate(genreData);

      // Devolver los géneros obtenidos de la API
      res.status(200).json(genreData.map(g => g.name));
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = getGenresController;
