const axios = require("axios");
const { Videogames, Genres, PlatformGame, Platforms } = require('../db'); // Asegúrate de tener importados ambos modelos
const {API_KEY} = process.env;
const { Op } = require('sequelize');


const isUUID = (value) => {
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(value);
};



const getVideoGamesController = async (req, res) => {
  try {
    const videoGamesData = await Videogames.findAll();
    console.log('Data obtained:', videoGamesData);
    res.status(200).json(videoGamesData);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getVideoGameDetailController = async (req, res) => {
  console.log("aaaaaaaaaaaaaayuda");
  const { idVideogame } = req.params;
  console.log(idVideogame);

  try {
    console.log("CCCCCCCCCCCCCCCc");

    if (isUUID(idVideogame)) {
      const videoGameFromDB = await Videogames.findOne({
        where: { id: idVideogame }
      });

      console.log("DDDDDDDDDDDDDDDDDDDDD");

      if (videoGameFromDB) {
        // si encontramos el videojuego
        console.log("11111111111111111111");
        console.log("Lo encontro por base de datos");
        res.status(200).json(videoGameFromDB);
        return; // Agregado para salir de la función después de enviar la respuesta
      }
    }

    console.log("22222222222222222222222");
    const apiURL = `https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY} `;
    const response = await axios.get(apiURL);                     //el ?key= va asi se reemplaza solo el numero
    const videoGameFromApi = response.data;

    const mapApiToVideogameModel = (apiResponse) => {// toma la respuesta de la APi y realiza una asignación de propiedades a un objeto que representará un videojuego
      // Mapear las propiedades de la API al modelo Videogames
      return {
        name: apiResponse.name,
        id: apiResponse.id.toString(),
        description: apiResponse.description,
        image: apiResponse.image,
        released: apiResponse.released,
        rating: apiResponse.rating,

        platforms: apiResponse.platforms.map(platform => ({//uso el metodo map para iterar cada elemnto del array

          id: platform.platform.id,  //uno es la platform del map y otro es la propiedad
          name: platform.platform.name,
          slug: platform.platform.slug,
          image: platform.platform.image,
          year_end: platform.platform.year_end,
          year_start: platform.platform.year_start,
          games_count: platform.platform.games_count,
          image_background: platform.platform.image_background
        }))
      };
    };
    const mappedVideoGame = mapApiToVideogameModel(videoGameFromApi);//utiñizo la funcion mapeo para transformar los datos de la api a un onj estructurado que esta almacenado en mappedVideoGame(este representa un videojuego con las prop id name description,etc)

    console.log("Lo encontro por api");
    res.status(200).json(mappedVideoGame);
  } catch (error) {
    console.log("errooooooooor");
    res.status(400).json({ error: error.message });
  }
};





const getVideoGameByNameController = async (req, res) => {
  console.log('Before database query');
  const { name } = req.query;
  console.log('Name:', name);

  try {
    const videoGamesData = await Videogames.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: 15,
    });

    console.log('After database query');

    if (videoGamesData.length > 0) {
      console.log('Video games found in the database:', videoGamesData);
      res.status(200).json(videoGamesData);
    } else {
      console.log('Before API call');
      const decodedSearch = decodeURIComponent(name);
      const apiURL = `https://api.rawg.io/api/games?key=${API_KEY}&search=${decodedSearch}&page=1&page_size=1`;
      console.log('API URL:', apiURL);

      const apiResponse = await axios.get(apiURL);
      console.log('API Response:', apiResponse);

      const apiResults = apiResponse.data.results;
      console.log('After API call');
      console.log('API Results:', apiResults);


     if (apiResults.length > 0) {
       // Mapea los resultados de la API a un formato adecuado
       const mappedResults = apiResults.map(apiResult => ({
        // Mapeo de propiedades del videojuego (ajustar según sea necesario)
        name: apiResult.name,
        id: apiResult.id.toString(),
        description: apiResult.description,
        image: apiResult.image,
        released: apiResult.released,
        rating: apiResult.rating,
        // Incluye información de las plataformas asociadas (ajustar según sea necesario)
        platforms: apiResult.platforms.map(platform => ({
          id: platform.platform.id,
          name: platform.platform.name,
          slug: platform.platform.slug,
          image: platform.platform.image,
          year_end: platform.platform.year_end,
          year_start: platform.platform.year_start,
          games_count: platform.platform.games_count,
          image_background: platform.platform.image_background
          // Otras propiedades de la plataforma
        })),
      }));

      res.status(200).json(mappedResults);
      } else {
        console.log('No video games found in the API');
        res.status(404).json({ message: 'No se encontraron videojuegos.' });
      }
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).json({ error: error.message });
  }

};






const createVideoGameController = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      description,
      platforms,
      image,
      released,
      rating,
      genres,
    } = req.body;

    // Crear el videojuego en la base de datos
    const newVideoGame = await Videogames.create({
      name,
      description,
      image,
      released,
      rating,
    });

    // Relacionar el videojuego con los géneros proporcionados
    if (genres && genres.length > 0) {
      const selectedGenres = await Genres.findAll({
        where: {
          id: {
            [Op.in]: genres,
          },
        },
      });

      await newVideoGame.setGenres(selectedGenres);
    }

    // Crear las plataformas asociadas al videojuego
    if (platforms && platforms.length > 0) {
      // Iterar sobre las plataformas proporcionadas
      for (const platform of platforms) {
        const createdPlatform = await Platforms.create({
          id: platform.id,
          name: platform.name,
          slug: platform.slug,
          image: platform.image,
          year_end: platform.year_end,
          year_start: platform.year_start,
          games_count: platform.games_count,
          image_background: platform.image_background,
        });

        // Relacionar la plataforma con el videojuego a través de la tabla intermedia
        await PlatformGame.create({
          released_at: platform.released_at,
          requirements_en: platform.requirements.en,
          requirements_ru: platform.requirements.ru,
        });

        // Asociar la plataforma creada al videojuego
        await newVideoGame.addPlatform(createdPlatform);
      }
    }

    res.status(201).json(newVideoGame);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getVideoGamesController,
  getVideoGameDetailController,
  getVideoGameByNameController,
  createVideoGameController
};
