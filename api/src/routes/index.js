const { Router } = require('express');
const videoGamesRouter = require('./videoGamesRouter');
const genresRouter = require("./genresRouter")
const platformsRouter = require('./platformsRouter');


// Importar todos los routers;

// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

router.use("/videogames", videoGamesRouter);
router.use("/genres", genresRouter);
router.use('/platforms', platformsRouter);



// Configurar los routers  
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;