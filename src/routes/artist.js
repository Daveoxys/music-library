//src/routes/artist.js
const express = require("express");
const artistController = require("../controllers/artist");
const router = express.Router();

router.post("/", artistController.createArtist);
router.get("/", artistController.readArtist);

module.exports = router;
