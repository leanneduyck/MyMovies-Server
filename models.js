const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

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

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Birthday: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// hashes password
userSchema.statics.hashPassword = (password) => {
  return bcryptjs.hashSync(password, 10);
};

// validates hashed pw submitted against hashed pw in database
userSchema.methods.validatePassword = function (password) {
  return bcryptjs.compareSync(password, this.Password);
};

// create models to be used to crud documents in database via index.js
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// export models so can be imported into index.js
module.exports.Movie = Movie;
module.exports.User = User;
//module.exports.Genre = Genre;
//module.exports.Director = Director;
