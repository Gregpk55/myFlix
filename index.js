const express = require("express"),
  morgan = require("morgan");

const bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  uuid = require("uuid");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

//Connect Mongoose
mongoose.connect('mongodb://localhost:27017/cfDB',
 { useNewUrlParser: true, useUnifiedTopology: true });




const app = express();
app.use(morgan("common"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

let users = [
  {
    id: 1,
    name: "Kim",
    favouriteMovie: [],
  },
];

let movies = [
  {
    Title: "Blow",
    Description:
      " Based on a true story, this film follows the rise and fall of George Jung, a drug dealer who became one of the biggest cocaine traffickers in the United States in the 1970s.",
    Genre: {
      Name: "Drama/Crime",
      Description:
        "Crime dramas are films that focus on the moral dilemmas of criminals. They differ from crime thrillers as the films generally focus on a grimmer and more realistic portrayal of the criminal world over violence and gunplay sequences.",
    },
    Year: 2001,
    Director: {
      Name: "Ted Demme",
      bio: "American film and television director, producer, and actor. Born in New York City, Demme began his career in the entertainment industry as a producer on the MTV network, where he helped create and produce shows such as Yo! MTV Raps and Remote Control.",
      Birthyear: "1963",
      Deathyear: "2002",
    },
  },
  {
    Title: "The Shining",
    Description:
      "This classic horror movie, directed by Stanley Kubrick and based on a novel by Stephen King, tells the story of a family who becomes the winter caretakers of an isolated hotel, only to be plagued by supernatural occurrences and the father's descent into madness.",
    Genre: {
      Name: "Horror",
      Description:
        "a genre that aims to scare and unsettle its audience, often featuring supernatural elements, suspenseful storytelling, and graphic violence.",
    },
    Year: 1980,
    Director: {
      Name: "Stanley Kubrick",
      bio: "Stanley Kubrick (1928-1999) was an American film director, screenwriter, and producer. He is widely regarded as one of the most influential and innovative filmmakers of the 20th century. Born in New York City, Kubrick began his career as a photographer for Look magazine before transitioning to filmmaking in the early 1950s.",
      Birthyear: "1928",
      Deathyear: "1999",
    },
  },
  {
    Title: "Goodfellas",
    Description:
      "Considered one of the greatest gangster movies ever made, Goodfellas chronicles the rise and fall of Henry Hill, a young man who becomes a member of the New York City mafia.",
    Genre: {
      Name: "Drama/Crime",
      Description:
        "Crime dramas are films that focus on the moral dilemmas of criminals. They differ from crime thrillers as the films generally focus on a grimmer and more realistic portrayal of the criminal world over violence and gunplay sequences.",
    },
    Year: 1990,
    Director: {
      Name: "Martin Scorsese",
      bio: "American filmmaker and one of the most influential directors in the history of cinema. He was born in New York City in 1942 and grew up in the neighborhood of Little Italy, which would later become a frequent setting in his films. ",
      Birthyear: "1942",
      Deathyear: "present",
    },
  },
  {
    Title: "The Lord of the Rings: The Fellowship of the Ring",
    Description:
      "The first installment in the epic Lord of the Rings trilogy, this film follows hobbit Frodo Baggins as he embarks on a perilous journey to destroy a powerful ring and save Middle-earth from evil forces.",
    Genre: {
      Name: "Fantasy/Adventure",
      Description:
        "A type of adventure film where the action takes place in imaginary lands with strange beasts, wizards and witches. These films contain many of the elements of the sword-and-sorcery film, but are not necessarily bound to the conventions of the sword and magic.",
    },
    Year: 2001,
    Director: {
      Name: "Peter Jackson",
      bio: "Peter Jackson is a New Zealand filmmaker and screenwriter best known for directing the critically acclaimed and commercially successful film adaptations of J.R.R. Tolkien's 'The Lord of the Rings' and 'The Hobbit' books",
      Birthyear: "1961",
      Deathyear: "present",
    },
  },
  {
    Title: "The Lord of the Rings: The Two Towers",
    Description:
      "The second installment in the Lord of the Rings trilogy, this film continues Frodo's journey and introduces new characters as the battle between good and evil intensifies.",
    Genre: {
      Name: "Fantasy/Adventure",
      Description:
        "A type of adventure film where the action takes place in imaginary lands with strange beasts, wizards and witches. These films contain many of the elements of the sword-and-sorcery film, but are not necessarily bound to the conventions of the sword and magic.",
    },
    Year: 2002,
    Director: {
      Name: "Peter Jackson",
      bio: "Peter Jackson is a New Zealand filmmaker and screenwriter best known for directing the critically acclaimed and commercially successful film adaptations of J.R.R. Tolkien's 'The Lord of the Rings' and 'The Hobbit' books",
      Birthyear: "1961",
      Deathyear: "present",
    },
  },
  {
    Title: "The Lord of the Rings: The Return of the King",
    Description:
      "The final installment in the Lord of the Rings trilogy, this film brings the story to a thrilling conclusion as the fate of Middle-earth hangs in the balance.",
    Genre: {
      Name: "Fantasy/Adventure",
      Description:
        "A type of adventure film where the action takes place in imaginary lands with strange beasts, wizards and witches. These films contain many of the elements of the sword-and-sorcery film, but are not necessarily bound to the conventions of the sword and magic.",
    },
    Year: 2003,
    Director: {
      Name: "Peter Jackson",
      bio: "Peter Jackson is a New Zealand filmmaker and screenwriter best known for directing the critically acclaimed and commercially successful film adaptations of J.R.R. Tolkien's 'The Lord of the Rings' and 'The Hobbit' books",
      Birthyear: "1961",
      Deathyear: "present",
    },
  },
  {
    Title: "Sicario",
    Description:
      " A young FBI agent is recruited by a government task force to help take down a Mexican drug cartel, but soon discovers that the lines between good and evil are blurred in this dangerous world.",
    Genre: {
      Name: "Thriller/Drama",
      Description:
        "A thriller generally keeps its audience on the 'edge of their seats' as the plot builds towards a climax. The cover-up of important information is a common element. Literary devices such as red herrings, plot twists, unreliable narrators, and cliffhangers are used extensively.",
    },
    Year: 2015,
    Director: {
      Name: "Denis Villeneuve",
      bio: "French Canadian film director and writer who was known for his deft hand at making visually inventive, sensitive, and unflinching films that often focus on issues of human trauma and identity.",
      Birthyear: "1967",
      Deathyear: "2023",
    },
  },
  {
    Title: "Sicario: Day of the Soldado",
    Description:
      "A sequel to Sicario, this film sees a new mission for the task force as they try to start a war between rival drug cartels.",
    Genre: {
      Name: "Thriller/Drama",
      Description:
        "A thriller generally keeps its audience on the 'edge of their seats' as the plot builds towards a climax. The cover-up of important information is a common element. Literary devices such as red herrings, plot twists, unreliable narrators, and cliffhangers are used extensively.",
    },
    Year: 2018,
    Director: {
      Name: "Stefano Sollima",
      bio: "An Italian director and screenwriter, Stefano Sollima is noted for making gritty crime-drama films such as ACAB - All Cops Are Bastards (2012), and Suburra (2015). Born in Rome, Sollima started his career as a camera operator and he covered reports from war zones for TV networks like CNN, NBC and CBS.",
      Birthyear: "1966",
      Deathyear: "present",
    },
  },
  {
    Title: "Sahara",
    Description:
      "Based on a novel by Clive Cussler, this film follows adventurer Dirk Pitt as he searches for a lost Civil War battleship in the Sahara Desert.",
    Genre: {
      Name: "Action/Adventure",
      Description:
        "A common theme of adventure films is of characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown.",
    },
    Year: 2005,
    Director: {
      Name: "Breck Eisner",
      bio: "American film director and producer, he is the son of Michael Eisner, former CEO of The Walt Disney Company. He began his career in the film industry by directing music videos and commercials before moving on to feature films.",
      Birthyear: "1970",
      Deathyear: "present",
    },
  },
  {
    Title: "Gran Torino",
    Description:
      "Directed by and starring Clint Eastwood, this film tells the story of a bitter Korean War veteran who forms an unlikely friendship with a young Hmong boy and tries to protect him from gang violence in his neighborhood.",
    Genre: {
      Name: "Drama",
      Description:
        " A genre focused on realistic characters and emotional themes, often exploring the human condition and societal issues.",
    },
    Year: 2008,
    Director: {
      Name: "Clint Eastwood",
      bio: "American actor, director, producer, and composer who was born on May 31, 1930, in San Francisco, California. He began his acting career in the 1950s, starring in various TV shows and films. However, he gained international fame in the 1960s as a star of the 'spaghetti Western' genre, including his iconic role as 'The Man with No Name' in Sergio Leone's trilogy of films.",
      Birthyear: "1930",
      Deathyear: "present",
    },
  },
];
//Add a user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $addToSet: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Remove a movie from a user's list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true },
   function(err, updatedUser) {  
     if (err) {
       console.error(err);
       res.status(500).send("Error: " + err);
     } else {
       res.json(updatedUser);
     }
   });
});


// Get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Genre Search
app.get("/movies/genre/:genreName", (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Director Search
app.get("/movies/director/:directorName", (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//DELETE Movie
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favouriteMovie = user.favouriteMovie.filter(
      (title) => title !== movieTitle
    );
    res.status(200).send("movie has been deleted!");
    console.log(movieTitle);
  } else {
    res.status(400).send("movie not added");
  }
});
// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Morgan middleware error function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somthing Broke!");
});
//Connect Mongoose
mongoose.connect('mongodb://localhost:27017/cfDB',
 { useNewUrlParser: true, useUnifiedTopology: true });

// Port 8080 listen request
app.listen(8080, () => {
  console.log("Your app is listening to port 8080.");
});
