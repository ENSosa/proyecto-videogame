const { Router } = require('express');
const videoGamesRouter = require('./videoGamesRouter');
// Importar todos los routers;

// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

router.use("/videogames", videoGamesRouter);



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
