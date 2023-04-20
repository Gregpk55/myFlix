const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  cors = require('cors'),
  passport = require('passport');

const { check, validationResult } = require('express-validator');

// Create Express app
const app = express();

//Authenticate+Login
const auth = require('./auth')(app);

// Define middleware
let allowedOrigins = [
  'http://localhost:1234',
  'http://localhost:8080',
  'http://localhost:27017',
  'https://greg-kennedy-myflix.herokuapp.com'
];
app.use(cors({

origin: (origin, callback) => {
  if(!origin) return callback(null, true);
  if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
    let message = 'The CORS policy for this application doesn/t allow access from origin ' + origin;
    return callback(new Error(message ), false);
  }
  return callback(null, true);
}
}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(methodOverride());
app.use(morgan('common'));

// Connect Mongoose
//mongoose.connect('mongodb://localhost:27017/cfDB')
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define models
const Movies = Models.Movie;
const Users = Models.User;

// Passport middleware
require('./passport');

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// Add a user
app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
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
        Birthday: req.body.Birthday,
      });

      const addedUser = await newUser.save();
      res.status(201).json(addedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding user.');
    }
  }
);

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.put(
  '/users/:Username',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
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
            Birthday: req.body.Birthday,
          },
        },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

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

// Remove a movie from a user's list of favorites
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});
// Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.Title });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});
//Genre Search
app.get(
  '/movies/genre/:genreName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({
        'Genre.Name': req.params.genreName,
      });
      if (movie) {
        res.json(movie.Genre);
      } else {
        res.status(404).send('Movie not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);
//Director Search
app.get(
  '/movies/director/:directorName',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({
        'Director.Name': req.params.directorName,
      });
      if (movie) {
        res.json(movie.Director);
      } else {
        res.status(404).send('Movie not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);
//DELETE Movie
app.delete(
  '/users/:id/:movieTitle',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id, movieTitle } = req.params;
      let user = user.find((user) => user.id == id);

      if (user) {
        user.favouriteMovie = user.favouriteMovie.filter((title) => title !== movieTitle);
        res.status(200).send('movie has been deleted!');
        console.log(movieTitle);
      } else {
        res.status(400).send('movie not added');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
);
// Delete a user by username
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findOneAndRemove({
        Username: req.params.Username,
      });
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

// Morgan middleware error function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somthing Broke!');
});

//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});