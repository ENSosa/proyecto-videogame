const { Router } = require("express");
const axios = require("axios");
const { API_KEY } = process.env;

const router = Router();

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
        const platforms = response.data.results.map(p => p.name);
        res.status(200).json(platforms);
    } catch (error) {
        console.error("Error al obtener plataformas:", error);
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

module.exports = router;
