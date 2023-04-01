const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  { check, validationResult } = require('express-validator'),
  cors = require('cors'),
  passport = require("passport");

// Create Express app
const app = express();

// Define middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(methodOverride());
app.use(morgan("common"));

// Connect Mongoose
mongoose.connect('mongodb://localhost:27017/cfDB',
 { useNewUrlParser: true, useUnifiedTopology: true });

// Define models
const Movies = Models.Movie;
const Users = Models.User;

// Passport middleware
require("./passport");


// Cors middleware
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         let message =
//           `The CORS policy for this application doesn’t allow access from origin ` +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

// Add a user
app.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  try {
    // check the validation object for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    const user = await Users.findOne({ Username: req.body.Username });

    if (user) {
      // If the user already exists, send an appropriate error response
      return res.status(400).send('Username already exists.');
    }

    const hashedPassword = await Users.hashPassword(req.body.Password);
    const newUser = new Users({
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    });

    const addedUser = await newUser.save();
    res.status(201).json(addedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding user.');
  }
});

// Get all users
app.get('/users',passport.authenticate('jwt', 
{session: false}), async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Get a user by username
app.get('/users/:Username',passport.authenticate('jwt', 
{session: false}), async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Update a user's info, by username
app.put('/users/:Username',
[
  check('Username', 'Username is required').isLength({ min: 5 }),
  check(
    'Username',
    'Username contains non alphanumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail(),
],
passport.authenticate('jwt', 
{session: false}), async (req, res) => {

  let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  try {
    const hashedPassword = await Users.hashPassword(req.body.Password);
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});


// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
      passport.authenticate('jwt', { session: false }, async (err, user) => {
      try {
        if (err || !user) {
          return res.status(401).send('Unauthorized');
        }

        const updatedUser = await Users.findOneAndUpdate(
          { Username: req.params.Username },
          { $push: { FavoriteMovies: req.params.MovieID } },
          { new: true }
        );
        res.json(updatedUser);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      }
    })(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Morgan middleware error function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somthing Broke!");
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});