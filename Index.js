const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todo-database", {
  family: 4,
}); // If todo database is not present it will create it. 27017 is basic port

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10); //(what you want to hash, no of cycles)
    const user = await User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.json({ status: "error", error: "Invalid login" });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  ); //(the string to compare and the hash)

  if (isPasswordValid) {
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
    if (!token) {
      return res.json({ status: "error", error: "Missing Token" });
    }
    const decoded = jwt.verify(token, "todomernapplication1234@#1234", {
      algorithms: ["HS256"],
    });
    console.log("Decoded payload:", decoded);
    if (!decoded) {
      return res.json({ status: "error", error: "Invalid token payload" });
    }
    const email = decoded.email;
    if (!email) {
      return res.json({ status: "error", error: "Mising email property" });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ status: "error", error: "User not found" });
    }
    console.log(user.todo);

    return res.json({ status: "ok", todo: user.todo });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});

app.post("/api/home", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "todomernapplication1234@#1234", {
      algorithms: ["HS256"],
    });
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $push: { todo: req.body.todo } }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid token" });
  }
});


app.listen(1337, () => {
  console.log("server has started in port 1337");
});
