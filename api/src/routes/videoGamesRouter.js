const { Router } = require('express');
const { getVideoGamesController, getVideoGameDetailController, getVideoGameByNameController, createVideoGameController } = require('../controllers/videoGamesControllers');

const videoGamesRouter = Router();

//videoGamesRouter.get("/name", getVideoGameByNameController);
videoGamesRouter.get("/:idVideogame", getVideoGameDetailController);
videoGamesRouter.post("/", createVideoGameController);
videoGamesRouter.get("/", getVideoGamesController);


module.exports = videoGamesRouter;