// require express, also morgan
const express = require("express"),
  //bodyParser = require("body-parser"),
  uuid = require("uuid");
const morgan = require("morgan");
const nodemon = require("nodemon");
require("dotenv").config();

// also import built-ins to log user requests to log.txt file
//(fs = require("fs")), (path = require("path"));

const app = express();
// refuses to run in Postman when I include bodyParser
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

//import mongoose and models
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// connects to database so can do crud on documents
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.lx41vnw.mongodb.net/MyMovies?retryWrites=true&w=majority&appName=Cluster1`
  )
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// sets up log.txt to receive user requests log
// const accessLogStream = fs.createWriteStream(path.join__dirname, "log.txt");

app.get("/", (req, res) => {
  res.send("Welcome to MyMovies!");
});

// 1. READ, returns data for all movie documents
app.get("/movies", async (req, res) => {
  // no parameters, will return all movies
  await Movies.find()
    // confirmation response to client with all movie documents
    .then((movies) => {
      res.status(201).json(movies);
    })
    // error handling, status 500 server error
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 2. READ, returns one document via movie title
app.get("/movies/:Title", async (req, res) => {
  // pass parameter of title to find movie
  await Movies.findOne({ Title: req.params.Title })
    // confirmation response to client with movie document
    .then((movies) => {
      res.json(movies);
    })
    // error handling, status 500 server error
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 3. READ, return data by genre
app.get("/movies/Genre/:Name", async (req, res) => {
  // pass parameter of genre name to find all movie documents w/that genre
  await Movies.findOne({ GenreName: req.params.GenreName })
    // confirmation response to client with movie documents w/passed genre
    .then((movies) => {
      res.json(movies);
    })
    // error handling, status 500 server error
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 4. READ, return data by director
app.get("/movies/Director/:Name", async (req, res) => {
  // pass parameter of director name to find all movie documents w/that director
  await Movies.findOne({ DirectorName: req.params.DirectorName })
    // confirmation response to client with movie documents w/passed director
    .then((movies) => {
      res.json(movies);
    })
    // error handling, status 500 server error
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 5. CREATE, register new user, status 201 created, 400 bad request, 500 server error
app.post("/users", async (req, res) => {
  // checks if user already exists
  await Users.findOne({ Name: req.body.Username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + "User already exists.");
    } else {
      // otherwise, creates new user document, Mongoose translates Node.js into MongoDB
      Users.create({
        Username: req.body.Username,
        Birthday: req.body.Birthday,
        Email: req.body.Email,
        Password: req.body.Password,
      })
        // confirmation response to client with status code and user document
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
    }
  });
});

// 6. UPDATE, update user
app.put("/users/:Username", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      // specifies which fields in document being updated
      $set: {
        Username: req.body.Username,
        Birthday: req.body.Birthday,
        Email: req.body.Email,
        Password: req.body.Password,
      },
    },
    // confirmation response to client with updated document
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    // error handling, status 500 server error
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// 7. CREATE, users add movies to favorites list
app.post("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      // specifies what is being added to document
      $push: { FavoriteMovies: req.params.MovieID },
    },
    // confirmation response to client with updated document
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    // error handling
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// 8. DELETE, users remove movies from list
app.delete("/movies", async (req, res) => {
  await Movies.findOneandRemove({ Title: req.params.Title })
    // confirmation response with status to client
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Title + "was not found.");
      } else {
        res.status(200).send(req.params.Title + " was deleted.");
      }
    })
    // error handling
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// 9. DELETE, removes user
app.delete("/users/:Username", async (req, res) => {
  await Users.findOneandRemove({ Username: req.params.Username })
    // confirmation response with status to client
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + "was not found.");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    // error handling
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// access documentation.html using express.static

app.use("/documentation", express.static("public"));

// listen on port
app.listen(5050, () => {
  console.log("Listening on Port 5050.");
});
