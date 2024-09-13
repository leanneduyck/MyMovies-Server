<<<<<<< HEAD
const jwtSecret = 'your_jwt_secret'; // same key as JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

//testing
=======
/**
 * @fileOverview this file handles authentication logic
 */

const jwtSecret = 'your_jwt_secret'; // same key as JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

/**
 * Generates a JWT token for user
 * @param {Object} user - user object
 * @returns {String} - JWT token
 */
>>>>>>> 795e98723110eb81d79c14dc16ea2797ff240eb3

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // same username as encoded in JWT
    expiresIn: '7d',
    algorithm: 'HS256', // encodes values of JWT
  });
};

/**
 * Module exports
 * @param {Object} router - express router
 */

module.exports = (router) => {
  /**
   * POST: login user, jwt token
   * @name /login
   * @param {String} Username - username
   * @param {String} Password - hashed
   * @returns {Object} - user object, jwt token
   */

  // new endpoint for registered users, http authentication, jwt token
  router.post('/login', (req, res) => {
    passport.authenticate(
      'local',
      {
        session: false,
      },
      (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right.',
            user: user,
          });
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        req.login(
          user,
          {
            session: false,
          },
          (error) => {
            if (error) {
              res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({ user, token });
          }
        );
      }
    )(req, res);
  });
};
