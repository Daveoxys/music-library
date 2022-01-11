const express = require("express");
const artistController = require("../controllers/artist");
const router = express.Router();
const getDb = require("../services/db");

exports.create = async (req, res) => {
  const db = await getDb();
  const { name, genre } = req.body;

  try {
    `INSERT INTO Artist (name, genre) VALUES (?, ?)`, [name, genre];

    res.sendStatus(201);
    res.send(
      `An artist by the name of "${req.body.name}" has been created in the database in the "${req.body.genre}" genre.`
    );
  } catch (err) {
    res.sendStatus(500).json(err);
  }

  db.close();
};

router.post("/", artistController.create);

module.exports = router;
