// tests/artist-delete.test.js
const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../src/services/db");
const app = require("../src/app");

describe("delete artist", () => {
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

    [artists] = await db.query("SELECT * from Artist");
  });

  afterEach(async () => {
    await db.query("DELETE FROM Artist");
    await db.close();
  });

  describe("/artist/:artistId", () => {
    describe("DELETE", () => {
      it("deletes a single artist with the correct id", async () => {
        const artist = artists[0];
        const res = await request(app).delete(`/artist/${artist.id}`).send();

        expect(res.status).to.equal(200);

        const [[deletedArtistRecord]] = await db.query(
          "SELECT * FROM Artist WHERE id = ?",
          [artist.id]
        );

        expect(!!deletedArtistRecord).to.be.false;
      });

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).delete("/artist/999999").send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
