// module requirements
const express = require('express');
const app = express();
const uuid = require('uuid');
const morgan = require('morgan');
// AWS-SDK modules
const fileUpload = require('express-fileupload');
const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
require('dotenv').config();

app.use(express.json());

// AWS middleware for file upload
app.use(fileUpload());

// configures S3 client
const s3Client = new S3Client({
  // region: process.env.AWS_REGION, // set region in .env file
  // trying below:
  region: 'us-east-1',
});

// configures S3 bucket name
const BUCKET_NAME = process.env.AWS_BUCKET_NAME; // set bucket name in .env file

// use CORS, allows access from all domains as per 2.10 instructions
const cors = require('cors');
app.use(cors());

// express validator library
const { check, validationResult } = require('express-validator');

// ensures express available in auth.js file, also requires passport module
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// import mongoose and models
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

console.log('MongoDB URI:', process.env.CONNECTION_URI);

// connects to database so can do crud on documents
mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //} local connection; leaving for when need to test locally
  //`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.lx41vnw.mongodb.net/MyMovies?retryWrites=true&w=majority&appName=Cluster1`
  //)
  .then(() => {
    console.log('Connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

/**
 * @name welcomeMessage
 * @returns {string} - Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to MyMovies!');
});

// 1. READ, returns data for all movie documents, sends jwt token along
/**
 * @name getMovies
 * @param {string} /movies' - endpoint for all movie documents
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {array<object>} movie documents
 */
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

// 2. READ, returns one document via movie title, sends jwt token along
/**
 * @name getMovieByTitle
 * @param {string} '/movies/:Title' - endpoint for one movie document
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {object} movie document
 */
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

// 3. READ, return data by genre, sends jwt token along
/**
 * @name getMoviesByGenre
 * @param {string} '/movies/Genre/:Name' - endpoint for all movie documents with genre
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {array<object>} movie documents with genre
 */
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

// 4. READ, return data by director, sends jwt token along
/**
 * @name getMoviesByDirector
 * @param {string} '/movies/Director/:Name' - endpoint for all movie documents with director
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {array<object>} movie documents with director
 */
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

// 5a. GET, returns all users
// only really use this for testing API
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

// 5. CREATE, register new user, status 201 created, 400 bad request, 500 server error
// no jwt authorization so new users can access
/**
 * @name createUser or registerUser
 * @param {string}'/users/create' - endpoint for new user registration
 * @param {string} req.body.Username
 * @param {string} req.body.Birthday
 * @param {string} req.body.Email
 * @param {string} req.body.Password
 * @param {function} validation - checks for username, email, pw
 * @param {function} async - asynchronous function
 * @returns {object} user document
 */
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

// 6. UPDATE, update user
/**
 * @name updateUser
 * @param {string} '/users/:Username' - endpoint for updating user
 * @param {string} req.params.Username
 * @param {string} req.body.Username
 * @param {string} req.body.Password
 * @param {function} validation - checks for username, email, pw
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {object} updated user document
 */
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

// 7. CREATE, users add movies to favorites list, sends jwt token along
/**
 * @name addFavoriteMovie
 * @param {string} '/users/:Username/movies/:MovieID' - endpoint for adding movie to favorites list
 * @param {string} req.params.Username
 * @param {string} req.params.MovieID
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {object} updated user document
 */
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

// 8. DELETE, users remove movies from list, sends jwt token along
/**
 * @name removeFavoriteMovie
 * @param {string} '/users/:Username/movies/:MovieID' - endpoint for removing movie from favorites list
 * @param {string} req.params.Username
 * @param {string} req.params.MovieID
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {object} updated user document
 */
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

// 9. DELETE, removes user, sends jwt token along
/**
 * @name deleteUser
 * @param {string} '/users/:Username' - endpoint for deleting user
 * @param {string} req.params.Username
 * @param {function} passport.authenticate - jwt token sent along
 * @param {function} async - asynchronous function
 * @returns {string} confirmation message
 */
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

// 10. POST, users upload images to AWS S3 bucket
app.post('/images/:Username', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.image;
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `original-images/${req.params.Username}/${file.name}`, // organize by file name
    Body: file.data,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    res.send(`File uploaded successfully. ${data.ETag}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 11. GET, lists all images in S3 bucket
app.get('/images/:Username', async (req, res) => {
  // query type of images to list, default to 'original'
  const { type = 'original' } = req.query;

  // validate that the type is either 'original' or 'resized'
  if (!['original', 'resized'].includes(type)) {
    return res
      .status(400)
      .send("Invalid type parameter. Use 'original' or 'resized'.");
  }

  // define the prefix based on the specified type
  // const imagePrefix = `${req.params.Username}/${
  //   type === 'resized' ? 'resized-images/' : 'original-images/'
  // }`;

  const originalPrefix = `original-images/${req.params.Username}/`;
  const resizedPrefix = `resized-images/${req.params.Username}/`;

  const listOriginalParams = {
    Bucket: BUCKET_NAME,
    Prefix: originalPrefix, // only list objects under the specified type
  };

  const listResizedParams = {
    Bucket: BUCKET_NAME,
    Prefix: resizedPrefix, // only list objects under the specified type
  };

  try {
    // fetch the list of objects from S3 based on the prefix
    const originalData = await s3Client.send(
      new ListObjectsV2Command(listOriginalParams)
    );
    const resizedData = await s3Client.send(
      new ListObjectsV2Command(listResizedParams)
    );

    const data = { ...originalData, ...resizedData };

    const imageKeys = data.Contents.map((item) => item.Key);
    res.send(imageKeys); // send the list of image keys as response
  } catch (err) {
    res.status(500).send(`Error retrieving images: ${err.message}`);
  }
});

// 12. GET, returns one image from S3 bucket
app.get('/images/:ImageID', async (req, res) => {
  const downloadParams = {
    Bucket: BUCKET_NAME,
    Key: req.params.ImageID,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(downloadParams));
    res.send(data.Body);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// access documentation.html using express.static
app.use('/documentation', express.static('public'));
// listen on port, leaving for local testing
//const port = process.env.PORT || 5050;
//app.listen(port, "0.0.0.0", () => {
//console.log("Listening on Port " + port);
//});

const PORT = process.env.PORT || 8889;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
