//src/routes/artist.js
const express = require("express");
const artistController = require("../controllers/artist");
const router = express.Router();

router.post("/", artistController.createArtist);
router.get("/", artistController.readArtist);
router.get("/:artistId", artistController.singleArtist);
router.patch("/:artistId", artistController.updateArtist);
router.delete("/:artistId", artistController.deleteArtist);

module.exports = router;
