// tests/artist-read.test.js
const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../src/services/db");
const app = require("../src/app");

describe("read artist", () => {
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

  describe("/artist", () => {
    describe("GET", () => {
      it("returns all artist records in the database", async () => {
        const res = await request(app).get("/artist").send();

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((artistRecord) => {
          const expected = artists.find((a) => a.id === artistRecord.id);

          expect(artistRecord).to.deep.equal(expected);
        });
      });
    });
  });

  describe("/artist/:artistId", () => {
    describe("GET", () => {
      it("returns a single artist with the correct id", async () => {
        const expected = artists[0];
        const res = await request(app).get(`/artist/${expected.id}`).send();

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(expected);
      });

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).get("/artist/999999").send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
