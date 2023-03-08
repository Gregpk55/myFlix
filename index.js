const express = require("express"),
  morgan = require("morgan");

const bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  uuid = require("uuid");

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
//create
app.post('/users', (req,res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
    }
    else {
      res.status(400).send('users need name')
    }
});
//UPDATE
app.put('/users/:id', (req, res)=>{
  const {id}=req.params;
  const userUpdate=req.body;

  let user=users.find(user=>user.id == id);

  if(user){
      user.name=userUpdate.name;
      res.status(200).json(user);
  }else{
      res.status(400).send('no such user');
  }
});
//POST
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
      user.favouriteMovie.push(movieTitle);
      res.status(200).send('movie has been added');
      console.log(movieTitle);
  }else{
      res.status(400).send('movie not added');
  }
});
//Movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});
//Title Search
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});
//Genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});
//Director
app.get('/movies/director/:directorName',(req,res)=>{
  const {directorName} =req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;
 
  if (director){
      res.status(200).json(director);
  }else{
      res.status(400).send('no such director found');
  }
});
//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favouriteMovie = user.favouriteMovie.filter( title => title !== movieTitle);
      res.status(200).send('movie has been deleted!');
      console.log(movieTitle);
  }else{
      res.status(400).send('movie not added');
  }
});
//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
      res.status(200).send('user has been deleted!');
      
  }else{
      res.status(400).send('no such user');
  }
});


// Morgan middleware error function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Somthing Broke!");
});


// Port 8080 listen request
app.listen(8080, () => {
  console.log("Your app is listening to port 8080.");
});
