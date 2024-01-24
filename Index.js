const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.send("hello world");
});

app.listen(1337, () => {
  console.log("server has started in port 1337");
});
