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
      `Successfully created Artist: ${req.body.name} under Genre: ${req.body.genre}.`
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
  const [[artistLength]] = await db.query("SELECT * FROM Artist");
  const [[artists]] = await db.query("SELECT * FROM Artist WHERE id = ?", [
    artistId,
  ]);

  if (!artists) {
    res.status(404);
    res.send(
      `Sorry, artist with an ID of _${artistId} doesn't exist. Please try again using an ID between 2 and ${artistLength.length}.` //still need to amend code so ID is not undefined.
    );
  } else {
    res.status(200).json(artists);
  }

  db.close();
};

exports.updateArtist = async (req, res) => {
  const db = await getDb();
  const data = req.body;
  const { artistId } = req.params;

  try {
    const [[artists]] = await db.query("SELECT * FROM Artist WHERE id = ?", [
      artistId,
    ]);
    if (!artists) {
      res.status(404);
      res.send(`Sorry, artist with the ID number ${artistId} doesn't exist.`);
    } else {
      await db.query("UPDATE Artist SET ? WHERE id = ?", [data, artistId]);
      res.send(
        `Artist with the ID number ${artistId} has successfully been updated!`
      );
      res.status(200).json(artists);
    }
  } catch (err) {
    res.status(500).send(`There is an error with the delete function.`);
  }
  db.close();
};

exports.deleteArtist = async (req, res) => {
  const db = await getDb();
  const { artistId } = req.params;

  try {
    const [[artists]] = await db.query("SELECT * FROM Artist WHERE id = ?", [
      artistId,
    ]);
    if (!artists) {
      res.status(404);
      res.send(`Sorry, artist with the ID number ${artistId} doesn't exist.`);
    } else {
      await db.query("DELETE FROM Artist WHERE id = ?", [artistId]);
      res.send(
        `Artist with the ID number ${artistId} has successfully been deleted from the database, but not our hearts.`
      );
      res.status(200);
    }
  } catch (err) {
    res.status(500);
  }
  db.close();
};
