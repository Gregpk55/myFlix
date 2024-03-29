const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Movie schema definition.
 * 
 * @typedef {Object} movieSchema
 * @property {string} Title - The title of the movie. Required.
 * @property {string} Description - The description of the movie. Required.
 * @property {Object} Genre - The genre of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - The description of the genre.
 * @property {Object} Director - The director of the movie.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - The biography of the director.
 * @property {string[]} Actors - A list of actor names.
 * @property {string} ImagePath - A path to the movie's image.
 * @property {boolean} Featured - Whether the movie is featured or not.
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * User schema definition.
 * 
 * @typedef {Object} userSchema
 * @property {string} Username - The username of the user. Required.
 * @property {string} Password - The password of the user. Required.
 * @property {string} Email - The email of the user. Required.
 * @property {Date} Birthday - The user's date of birth.
 * @property {mongoose.Schema.Types.ObjectId[]} FavoriteMovies - A list of references to the user's favorite movies.
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hashes a password for storage.
 * 
 * @param {string} password - The plain text password.
 * @returns {string} - The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a user's password.
 * 
 * @param {string} password - The plain text password.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Mongoose model for the Movie schema.
 * @type {mongoose.Model}
 */
let Movie = mongoose.model("Movie", movieSchema);

/**
 * Mongoose model for the User schema.
 * @type {mongoose.Model}
 */
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
