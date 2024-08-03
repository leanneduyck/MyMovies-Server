const jwtSecret = 'your_jwt_secret'; // same key as JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

//testing

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // same username as encoded in JWT
    expiresIn: '7d',
    algorithm: 'HS256', // encodes values of JWT
  });
};

module.exports = (router) => {
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
