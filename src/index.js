const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require("bcrypt");

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "../views"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.send("Passwords do not match.");
  }

  // Check if email already exists
  const existingUser = await collection.findOne({ email: email });

  if (existingUser) {
    return res.send("Email already registered. Please use a different email.");
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const data = {
    name: username,
    email: email,
    password: hashedPassword,
  };

  const userdata = await collection.insertMany(data);
  console.log(userdata);

  res.render("signupSuccess");
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email });

    if (!check) {
      return res.send("Email not found.");
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      return res.send("Wrong password.");
    } else {
      res.render("home");
    }
  } catch (error) {
    console.error(error);
    res.send("Error logging in.");
  }
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
