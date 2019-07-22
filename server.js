const express = require("express");
const mongoose = require("mongoose");
const app = express();

//routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//import mongoDB uri
const database = require("./config/keys").mongoURI;

//connect to database
mongoose
  .connect(database)
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.log("db connection error"));

app.get("/", (req, res) => res.send("hello"));

//Routes
app.use("/api/users", users);
app.use("/api/users", posts);
app.use("/api/users", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
