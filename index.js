/**
 * @fileOverview this is the main file of MyMovies API
 * handles all CRUD operations for users and movies
 */

// require express, morgan, nodemon
const express = require('express');
const app = express();
const uuid = require('uuid');
const morgan = require('morgan');
require('dotenv').config();

// log requests to console
app.use(express.json());

// CORS - trying below to see if works better
const cors = require('cors');
// app.use(
//   cors({
//     origin: '*', // allows all domains to access API
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // allows these methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // allows these headers
//   })
// );

const allowedOrigins = [
  'https://main--react-mymovies.netlify.app',
  'https://my-movies-angular.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// handle preflight requests
app.options(
  '*',
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// express validator library
const { check, validationResult } = require('express-validator');

// ensures express available in auth.js file, also requires passport module
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//import mongoose and models
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

console.log('MongoDB URI:', process.env.CONNECTION_URI);

// connects to database so can do crud on documents
mongoose
  .connect(process.env.CONNECTION_URI)
  //} local connection if/when needed
  //`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.lx41vnw.mongodb.net/MyMovies?retryWrites=true&w=majority&appName=Cluster1`
  //)
  .then(() => {
    console.log('Connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

/**
 * GET: returns welcome message
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {String} - welcome message
 */

app.get('/', (req, res) => {
  res.send('Welcome to MyMovies!');
});

/**
 * 1. GET: returns array of all movies, sends jwt token along
 * @name GetAllMovies
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - all movie documents
 */

// 1. READ, returns array of all movie documents, sends jwt token along
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find();
      res.status(200).json(movies);
    } catch (err) {
      // error handling, status 500 server error
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

/**
 * 2. GET: returns data for one movie, requires jwt token
 * @name GetMovie
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - one movie document by title
 */

// 2. READ, returns one document via movie title, sends jwt token along
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      // confirmation response to client with movie document
      .then((movies) => {
        res.json(movies);
      })
      // error handling, status 500 server error
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * 3. GET: returns data for genre, requires jwt token
 * @name GetMovieByGenre
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - all movie documents by specific genre
 */

// 3. READ, return data by genre, sends jwt token along
app.get(
  '/movies/Genre/:Name',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // pass parameter of genre name to find all movie documents w/that genre
    await Movies.find({ 'Genre.Name': req.params.Name })
      // confirmation response to client with movie documents w/passed genre
      .then((movies) => {
        res.json(movies);
      })
      // error handling, status 500 server error
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * 4. GET: returns data for director, requires jwt token
 * @name GetMovieByDirector
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - all movie documents by specific director
 */

// 4. READ, return data by director, sends jwt token along
app.get(
  '/movies/Director/:Name',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // pass parameter of director name to find all movie documents w/that director
      const movies = await Movies.find({ 'Director.Name': req.params.Name });
      res.json(movies);
    } catch (err) {
      // error handling, status 500 server error
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

/**
 * 5a. GET: returns all users, requires jwt token
 * @name GetAllUsers
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - all user documents
 */

// 5a. GET, returns all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * 5. POST: returns data for one user, requires jwt token, hashes pw
 * @name RegisterUser
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - new user document
 */

// 5. CREATE, register new user, status 201 created, 400 bad request, 500 server error
// no jwt authorization so new users can access
app.post(
  '/users/create',
  // validation for username, email, pw
  [
    check(
      'Username',
      'Username is required, with a minimum of 5 characters.'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumberic characters which is not allowed.'
    ).isAlphanumeric(),
    check('Username', 'Username is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail(),
    check('Email', 'Email is required.').not().isEmpty(),
    check('Password', 'Password is required.').not().isEmpty(),
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
        return res.status(400).send(req.body.Username + ' already exists.');
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
            res.status(500).send('Error: ' + error);
          });
      }
    });
  }
);

/**
 * 6. PUT: returns updated user, requires jwt token, hashes pw
 * @name UpdatedUser
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - updated user document, profile info
 */

// 6. UPDATE, update user
app.put(
  '/users/:Username',
  // validation for username, email, pw
  [
    check(
      'Username',
      'Username is required, with a minimum of 5 characters.'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumberic characters which is not allowed.'
    ).isAlphanumeric(),
    check('Username', 'Username is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail(),
    check('Email', 'Email is required.').not().isEmpty(),
    check('Password', 'Password is required.').not().isEmpty(),
  ],
  // sends jwt token along
  passport.authenticate('jwt', { session: false }),
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
          Password: hashedPassword,
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
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * 7. POST: returns user's favorite list, requires jwt token
 * @name AddToFavorites
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - updated user document, favorite list
 */

// 7. CREATE, users add movies to favorites list, sends jwt token along
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console;
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
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * 8. DELETE: removes movie from user's favorite list, requires jwt token
 * @name RemoveFromFavorites
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} - updated user document, favorite list
 */

// 8. DELETE, users remove movies from list, sends jwt token along
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        // specifies what is being added to document
        $pull: { FavoriteMovies: req.params.MovieID },
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
        res.status(500).send('Error: ' + error);
      });
  }
);

/**
 * 9. DELETE: removes user, requires jwt token
 * @name DeleteUser
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {String} - confirmation message
 */

// 9. DELETE, removes user, sends jwt token along
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.deleteOne({ Username: req.params.Username })
      // confirmation response with status to client
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + 'was not found.');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      // error handling
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// access documentation.html using express.static
app.use('/documentation', express.static('public'));

// listen on local port, use if locally hosted
//const port = process.env.PORT || 5050;
//app.listen(port, "0.0.0.0", () => {
//console.log("Listening on Port " + port);
//});

const PORT = process.env.PORT || 8889;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
