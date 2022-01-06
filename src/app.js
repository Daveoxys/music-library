const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send("Hello? Is there anybody in there? Just nod if you can hear me.");
});

module.exports = app;
