const { Router } = require('express');
const { getVideoGamesController, getVideoGameDetailController } = require('../controllers/videoGamesControllers');

const videoGamesRouter = Router();


videoGamesRouter.get("/",getVideoGamesController);
videoGamesRouter.get("/:idVideogame", getVideoGameDetailController)


module.exports =videoGamesRouter;