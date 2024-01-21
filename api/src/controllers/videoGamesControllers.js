const axios = require("axios");
const { Videogames, Genres, PlatformGame, Platforms } = require('../db'); // Asegúrate de tener importados ambos modelos

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

const getVideoGamesController2 = async (req, res) => {
  const url = "https://api.rawg.io/api/games?key=1d372a7cdecc43a19f0bd3dee214d98c";
  try {
    console.log("Making axios call");
    const response = await axios.get(url);
    console.log(response);
    res.status(200).json({ data: response.data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "something bad has occurred." });
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
    const apiURL = `https://api.rawg.io/api/games/${idVideogame}?key=1d372a7cdecc43a19f0bd3dee214d98c`;
    const response = await axios.get(apiURL);
    const videoGameFromApi = response.data;

    console.log("Lo encontro por api");
    res.status(200).json(videoGameFromApi);
  } catch (error) {
    console.log("errooooooooor");
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getVideoGamesController,
  getVideoGameDetailController
};
