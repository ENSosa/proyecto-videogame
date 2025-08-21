// genresRouter.js
const { Router } = require('express');
const  getGenresController = require("../controllers/genrescontrollers");

const genresRouter = Router();

genresRouter.get("/", getGenresController);

module.exports = genresRouter;

