# My Flix

<h2>Description</h2>

MyFlix is a movie database app that allows users to browse and search for movies, add movies to their favorites list, and update their profile information.

<h2>Technologies Used</h2>

* Node.js
* Express
* MongoDB
* Mongoose
* Passport.js
* JWT
* CORS
* Morgan
* Body-parser
* Method-override
* Express-validator

<h2>Endpoints</h2>

* GET / : returns "Welcome to MyFlix!"
* POST /users : creates a new user account
* GET /users : returns a list of all users
* GET /users/:Username : returns a specific user by username
* PUT /users/:Username : updates a user's information
* POST /users/:Username/movies/:MovieID : adds a movie to a user's list of favorite movies
* DELETE /users/:Username/movies/:MovieID : removes a movie from a user's list of favorite movies
* GET /movies : returns a list of all movies
* GET /movies/:Title : returns a specific movie by title
* GET /movies/genres/:Name : returns a list of movies by genre
* GET /movies/directors/:Name : returns a list of movies by director

[Github] https://github.com/Gregpk55/myFlix


