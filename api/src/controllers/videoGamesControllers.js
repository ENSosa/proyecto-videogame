const axios = require("axios");
const { Videogames, Genres } = require('../db');
const { API_KEY } = process.env;
const { Op } = require('sequelize');

const isUUID = (value) => {
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(value);
};

// ✅ UNIFICADO: Todos los videojuegos o búsqueda por nombre
const getVideoGamesController = async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      // Buscar por nombre
      const dbGames = await Videogames.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
        include: {
          model: Genres,
          as: 'Genres',
          attributes: ['name'],
          through: { attributes: [] }
        },
        limit: 15,
      });

      const formattedDbGames = dbGames.map(game => ({
        id: game.id,
        name: game.name,
        image: game.image,
        rating: game.rating,
        genres: game.Genres.map(g => g.name),
      }));

      if (formattedDbGames.length > 0) {
        return res.status(200).json(formattedDbGames);
      }

      // Buscar en API
      const apiURL = `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}&page=1&page_size=15`;
      const apiResponse = await axios.get(apiURL);

      const apiGames = apiResponse.data.results.map(game => ({
        id: game.id,
        name: game.name,
        image: game.background_image,
        rating: game.rating,
        genres: game.genres.map(g => g.name),
      }));

      return res.status(200).json(apiGames);
    }

    // Traer todos los juegos (100)
    const dbGames = await Videogames.findAll({
      include: {
        model: Genres,
        as: 'Genres',
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    const formattedDbGames = dbGames.map(game => ({
      id: game.id,
      name: game.name,
      image: game.image,
      rating: game.rating,
      genres: game.Genres.map(g => g.name)
    }));

    const page1 = axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=1&page_size=40`);
    const page2 = axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=2&page_size=40`);
    const page3 = axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=3&page_size=20`);

    const [res1, res2, res3] = await Promise.all([page1, page2, page3]);

    const apiGames = [...res1.data.results, ...res2.data.results, ...res3.data.results].map(game => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      rating: game.rating,
      genres: game.genres.map(g => g.name)
    }));

    const allGames = [...formattedDbGames, ...apiGames].slice(0, 100);
    return res.status(200).json(allGames);
  } catch (error) {
    console.error("Error en getVideoGamesController:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 🎮 Detalle por ID
const getVideoGameDetailController = async (req, res) => {
  const { idVideogame } = req.params;

  try {
    if (isUUID(idVideogame)) {
      const videoGameFromDB = await Videogames.findOne({
        where: { id: idVideogame },
        include: {
          model: Genres,
          as: 'Genres',
          attributes: ['name'],
          through: { attributes: [] }
        }
      });

      if (videoGameFromDB) {
        const mappedGame = {
          id: videoGameFromDB.id,
          name: videoGameFromDB.name,
          description: videoGameFromDB.description,
          image: videoGameFromDB.image,
          released: videoGameFromDB.released,
          rating: videoGameFromDB.rating,
          platforms: videoGameFromDB.platforms,
          genres: videoGameFromDB.Genres.map(g => g.name),
        };
        return res.status(200).json(mappedGame);
      }
    }



    const apiURL = `https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`;
    const response = await axios.get(apiURL);
    const game = response.data;

    const mappedGame = {
      id: game.id,
      name: game.name,
      description: game.description,
      image: game.background_image,
      released: game.released,
      rating: game.rating,
      platforms: game.platforms.map(p => p.platform.name),
      genres: game.genres.map(g => g.name),
    };

    return res.status(200).json(mappedGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🎮 Crear videojuego
const createVideoGameController = async (req, res) => {
  try {
    const { name, description, platforms, image, released, rating, genres } = req.body;
    console.log("📦 Datos recibidos del front:", req.body);

    const newVideoGame = await Videogames.create({
      name,
      description,
      platforms,
      image,
      released,
      rating,
    });
    console.log("✅ Videojuego creado:", newVideoGame.name);

    if (genres && genres.length > 0) {
      console.log("🎯 Buscando géneros:", genres);

      const selectedGenres = await Genres.findAll({
        where: {
          name: {
            [Op.in]: genres,
          },
        },
      });

      console.log("✅ Géneros encontrados:", selectedGenres.map(g => g.name));
      await newVideoGame.setGenres(selectedGenres);
      console.log("🔗 Géneros asociados correctamente");
    }

    res.status(201).json(newVideoGame);
  } catch (error) {
    console.error("💥 Error en createVideoGameController:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getVideoGamesController,
  getVideoGameDetailController,
  createVideoGameController,
};
