// require express, also morgan and nodemon
const express = require("express"),
  app = express(),
  uuid = require("uuid");
const morgan = require("morgan");
const nodemon = require("nodemon");
require("dotenv").config();

// also import built-ins to log user requests to log.txt file?
//(fs = require("fs")), (path = require("path"));

app.use(express.json);

//use CORS, allows access from all domains as per 2.10 instructions
const cors = require("cors");
app.use(cors());

// express validator library
const { check, validationResult } = require("express-validator");

// ensures express available in auth.js file, also requires passport module
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//import mongoose and models
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// connects to database so can do crud on documents
mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //} local connection
  //`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.lx41vnw.mongodb.net/MyMovies?retryWrites=true&w=majority&appName=Cluster1`
  //)
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

// 1. READ, returns data for all movie documents, sends jwt token along
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // no parameters, will return all movies
    await Movies.find()
      // confirmation response to client with all movie documents
      .then((movies) => {
        res.status(200).json(movies);
      })
      // error handling, status 500 server error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// 2. READ, returns one document via movie title, sends jwt token along
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// 3. READ, return data by genre, sends jwt token along
app.get(
  "/movies/Genre/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // pass parameter of genre name to find all movie documents w/that genre
    await Movies.find({ "Genre.Name": req.params.Name })
      // confirmation response to client with movie documents w/passed genre
      .then((movies) => {
        res.json(movies);
      })
      // error handling, status 500 server error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// 4. READ, return data by director, sends jwt token along
app.get(
  "/movies/Director/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // pass parameter of director name to find all movie documents w/that director
    await Movies.find({ "Director.Name": req.params.Name })
      // confirmation response to client with movie documents w/passed director
      .then((movies) => {
        res.json(movies);
      })
      // error handling, status 500 server error
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// 5a. GET, returns all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// 5. CREATE, register new user, status 201 created, 400 bad request, 500 server error
// no jwt authorization so new users can access
app.post(
  "/users/create",
  // validation for username, email, pw
  [
    check(
      "Username",
      "Username is required, with a minimum of 5 characters."
    ).isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumberic characters which is not allowed."
    ).isAlphanumeric(),
    check("Username", "Username is required.").not().isEmpty(),
    check("Email", "Email does not appear to be valid.").isEmail(),
    check("Email", "Email is required.").not().isEmpty(),
    check("Password", "Password is required.").not().isEmpty(),
  ],
  async (req, res) => {
    // checks validation for errors, will not execute if error found
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(442).json({ errors: errors.array() });
    }
    // hashes pw
    let hashedPassword = Users.hashPassword(req.body.Password);
    // checks if user already exists
    await Users.findOne({ Name: req.body.Username }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists.");
      } else {
        // otherwise, creates new user document, Mongoose translates Node.js into MongoDB
        Users.create({
          Username: req.body.Username,
          Birthday: req.body.Birthday,
          Email: req.body.Email,
          Password: hashedPassword,
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
  }
);

// 6. UPDATE, update user
app.put(
  "/users/:Username",
  // validation for username, email, pw
  [
    check(
      "Username",
      "Username is required, with a minimum of 5 characters."
    ).isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumberic characters which is not allowed."
    ).isAlphanumeric(),
    check("Username", "Username is required.").not().isEmpty(),
    check("Email", "Email does not appear to be valid.").isEmail(),
    check("Email", "Email is required.").not().isEmpty(),
    check("Password", "Password is required.").not().isEmpty(),
  ],
  // sends jwt token along
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // checks validation for errors, will not execute if error found
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(442).json({ errors: errors.array() });
    }
    // hashes pw
    let hashedPassword = Users.hashPassword(req.body.Password);
    console.log(req.body);
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
  }
);

// 7. CREATE, users add movies to favorites list, sends jwt token along
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// 8. DELETE, users remove movies from list, sends jwt token along
app.delete(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.deleteOne({ Title: req.query.Title })
      // confirmation response with status to client
      .then((user) => {
        if (!user) {
          res.status(400).send(req.query.Title + "was not found.");
        } else {
          res.status(200).send(req.query.Title + " was deleted.");
        }
      })
      // error handling
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// 9. DELETE, removes user, sends jwt token along
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.deleteOne({ Username: req.params.Username })
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
  }
);

// access documentation.html using express.static

app.use("/documentation", express.static("public"));

// listen on port, no longer locally hosted
const port = process.env.PORT || 5050;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
