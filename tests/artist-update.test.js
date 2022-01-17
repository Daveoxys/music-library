// tests/artist-update.test.js
const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../src/services/db");
const app = require("../src/app");

describe("update artist", () => {
  let db;
  let artists;
  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query("INSERT INTO Artist (name, genre) VALUES(?, ?)", [
        "The Killers",
        "Alt Rock",
      ]),
      db.query("INSERT INTO Artist (name, genre) VALUES(?, ?)", [
        "Bruce Springsteen",
        "Rock",
      ]),
      db.query("INSERT INTO Artist (name, genre) VALUES(?, ?)", [
        "The Smiths",
        "Indie",
      ]),
    ]);

    [artists] = await db.query("SELECT * FROM Artist");
  });

  afterEach(async () => {
    await db.query("DELETE FROM Artist");
    await db.close();
  });

  describe("/artist/:artistId", () => {
    describe("PATCH", () => {
      it("updates a single artist with the correct id", async () => {
        const artist = artists[0];
        const res = await request(app)
          .patch(`/artist/${artist.id}`)
          .send({ name: "new name", genre: "new genre" });

        expect(res.status).to.equal(200);

        const [[newArtistRecord]] = await db.query(
          "SELECT * FROM Artist WHERE id = ?",
          [artist.id]
        );

        expect(newArtistRecord.name).to.equal("new name");
      });

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app)
          .patch("/artist/999999")
          .send({ name: "new name" });

        expect(res.status).to.equal(404);
      });
    });
  });
});
