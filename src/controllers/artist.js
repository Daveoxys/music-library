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

exports.readArtist = async (_, res) => {
  const db = await getDb();

  try {
    const [artists] = await db.query("SELECT * FROM Artist");
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json(err);
  }

  db.close();
};

exports.singleArtist = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;
  const [[artistLength]] = await db.query(
    "SELECT * FROM music_library_dev.Artist"
  );
  const [[artists]] = await db.query("SELECT * FROM Artist WHERE id = ?", [
    artistId,
  ]);

  if (!artists) {
    res.status(404);
    res.send(
      `Sorry, artist with an ID of ${artistId} doesn't exist. Please try again using an ID between 2 and ${artistLength.length}.`
    );
  } else {
    res.status(200).json(artists);
  }

  db.close();
};
