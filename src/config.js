const mongoose = require("mongoose");
const connect = mongoose.connect(
  "mongodb+srv://syedk3549:Abbas12@cluster0.hkubvrs.mongodb.net/LoginDB?retryWrites=true&w=majority&appName=Cluster0"
);
//mongodb://localhost:27017/Login-tut"

// Check database connected or not
connect
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.error("Database cannot be Connected\n", err);
  });

// Create Schema
const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;
