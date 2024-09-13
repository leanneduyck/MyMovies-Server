/**
 * @fileOverview this file defines schema and models for movies and users
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

/**
 * movie schema, defined by Mongoose
 * @type {mongoose.Schema}
 */

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Release: { type: String },
  Description: { type: String, required: true },
  Rating: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    BirthYear: String,
    Description: String,
  },
});

/**
 * user schema, defined by Mongoose
 * @type {mongoose.Schema}
 */

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Birthday: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * hashes password
 * @param {String} password - password to hash
 * @returns {String} - hashed password
 */

// hashes password
userSchema.statics.hashPassword = (password) => {
  return bcryptjs.hashSync(password, 10);
};

/**
 * compares pw to hashed pw in database
 * @param {String} password
 * @returns {Boolean} - true if pw matches hashed pw in database
 */

// validates hashed pw submitted against hashed pw in database
userSchema.methods.validatePassword = function (password) {
  return bcryptjs.compareSync(password, this.Password);
};

// create models to be used to crud documents in database via index.js

/**
 * mongoose model for movie
 * @type {mongoose.Model}
 */

let Movie = mongoose.model('Movie', movieSchema);

/**
 * mongoose model for user
 * @type {mongoose.Model}
 */

let User = mongoose.model('User', userSchema);

// export models so can be imported into index.js
module.exports.Movie = Movie;
module.exports.User = User;
//module.exports.Genre = Genre;
//module.exports.Director = Director;
