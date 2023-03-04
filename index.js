const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"), 
  path = require("path");
  const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

  const app = express();
  app.use(morgan("common"));

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.get("/movies", morgan('common'), (req, res) => {
    const movies = [
      {
        title: "Blow",
        year: 2001,
        director: "Ted Demme",
      },
    ];
    //Response
    res.json(movies);
});

app.use(express.static("public"));


app.get("/", (req, res) => {
  console.log("Welcome to myFlix");
  res.send("Welcome to myFlix!");
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

app.use(express.static("public"));
