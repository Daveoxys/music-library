//src/controllers/artist.js
const getDb = require("../services/db");

exports.createArtist = async (req, res) => {
  const db = await getDb();
  const { name, genre } = req.body;

  try {
    await db.query("INSERT INTO Artist (name, genre) VALUES (?, ?)", [
      name,
      genre,
    ]);

    res.sendStatus(201);
    res.send(
      `Successfully created artist "${req.body.name}" and added to the "${req.body.genre}" genre.`
    );
  } catch (err) {
    res.sendStatus(500).json(err);
  }

  db.close();
};

exports.readArtist = async (req, res) => {
  const db = await getDb();

  try {
    const [artists] = await db.query("SELECT * FROM Artist");
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};
