const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    quote: { type: String },
  },
  { collection: "userData" }
);

const model = mongoose.model("userData", User); // (collectionName , schema(Defined above))

module.exports = model;
