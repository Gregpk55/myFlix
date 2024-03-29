// This secret key should remain private and is used to sign the JWT tokens
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
      passport = require('passport');

// Import local passport configuration
require('./passport');

/**
 * Generate a JWT token for a user.
 *
 * @param {Object} user - User object for which the JWT should be generated.
 * @returns {string} - JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,  // The username encoded in the JWT
    expiresIn: '7d',         // Token expiration time
    algorithm: 'HS256',      // Signing algorithm
  });
};

/**
 * Defines and exports the login route handler.
 *
 * @param {Object} router - Express router object.
 */
module.exports = (router) => {
  /**
   * POST login route.
   * Authenticate users and return JWT upon success.
   */
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error) {
        return res.status(400).json({
          message: 'There was an error during authentication.',
          error: error.toString(),
          user: user,
        });
      }
      if (!user) {
        return res.status(400).json({
          message: 'No user found or incorrect credentials.',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
