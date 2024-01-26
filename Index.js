const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Model/User");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todo-database", {
  family: 4,
}); // If todo database is not present it will create it. 27017 is basic port

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        email: user.email,
      },
      "todomernapplication1234@#1234"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/home", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "todomernapplication1234@#1234");
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.post("/api/home", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "todomernapplication1234@#1234");
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );
    return { status: "ok", quote: user.quote };
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});


app.listen(1337, () => {
  console.log("server has started in port 1337");
});
