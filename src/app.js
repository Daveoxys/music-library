const express = require("express");
const artistRouter = require("./routes/artist");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send("Hello? Is there anybody in there? Just nod if you can hear me.");
});

app.use("/artist", artistRouter);

module.exports = app;
