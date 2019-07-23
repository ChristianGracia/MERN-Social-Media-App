const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// app init
const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import mongoDB uri
const database = require("./config/keys").mongoURI;

// connect to database
mongoose
  .connect(database)
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.log("db connection error"));

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

//Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
