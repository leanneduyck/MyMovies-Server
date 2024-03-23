// express server
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    Name: "Mary",
    favoriteMovies: [],
  },
  {
    id: 2,
    Name: "John",
    favoriteMovies: [],
  },
];

let movies = [
  {
    Title: "Harry Potter and the Sorcerer's Stone",
    Release: "2001",
    Genre: "Adventure, Fantasy",
    Description:
      "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family, and the terrible evil that haunts the magical world.",
    Rating: "PG",
    "Img URL":
      "https://www.imdb.com/title/tt0241527/mediaviewer/rm2105413120/?ref_=tt_ov_i",
    Director: {
      Name: "Chris Columbus",
      DOB: "09-10-1958",
      DOD: "N/A",
      Description:
        "Born in Pennsylvania and raised in Ohio, Chris Columbus was first inspired to make movies after seeing 'The Godfather' at age 15.",
    },
  },
  {
    Title: "Harry Potter and the Chamber of Secrets",
    Release: "2002",
    Genre: "Adventure, Fantasy",
    Description:
      "An ancient prophecy seems to be coming true when a mysterious presence begins stalking the corridors of a school of magic and leaving its victims paralyzed.",
    Rating: "PG",
    "Img URL":
      "https://www.imdb.com/title/tt0295297/mediaviewer/rm3790637825/?ref_=tt_ov_i",
    Director: {
      Name: "Chris Columbus",
      DOB: "09-10-1958",
      DOD: "N/A",
      Description:
        "Born in Pennsylvania and raised in Ohio, Chris Columbus was first inspired to make movies after seeing 'The Godfather' at age 15.",
    },
  },
  {
    Title: "Harry Potter and the Prisoner of Azkaban",
    Release: "2004",
    Genre: "Adventure, Fantasy",
    Description:
      "Harry Potter, Ron, and Hermione return to Hogwarts School of Witchcraft and Wizardry for their third year of study, where they delve into the myster surrounding an escaped prisoner who poses a dangerous threat to the young wizard.",
    Rating: "PG",
    "Img URL":
      "https://www.imdb.com/title/tt0304141/mediaviewer/rm3241184256/?ref_=tt_ov_i",
    Director: {
      Name: "Alfonso Cuaron",
      DOB: "11-28-1961",
      DOD: "N/A",
      Description:
        "Alfonso Cuaron Orozco was born in Mexico City, Mexico. From an early age, he yearned to be either a film director or an astronaut.",
    },
  },
  {
    Title: "Harry Potter and the Goblet of Fire",
    Release: "2005",
    Genre: "Adventure, Fantasy",
    Description:
      "Harry Potter finds himself competing in a hazardous tournament between rival schools of magic, but he is distracted by recurring nightmares.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt0330373/mediaviewer/rm436509952/?ref_=tt_ov_i",
    Director: {
      Name: "Mike Newell",
      DOB: "03-28-1942",
      DOD: "N/A",
      Description:
        "Mike Newell was born on 28 March 1942 in St. Albans, Hertfordshire, UK. He is married to Bernice Stegers. They have three children.",
    },
  },
  {
    Title: "Harry Potter and the Order of the Pheonix",
    Release: "2007",
    Genre: "Adventure, Fantasy",
    Description:
      "With their warning about Lord Voldemort's return scoffed at, Harry and Dumbledore are targeted by the Wizard authorities as an authoritarian bureaucrat slowly seizes power at Hogwarts.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt0373889/mediaviewer/rm3414694144/?ref_=tt_ov_i",
    Director: {
      Name: "David Yates",
      DOB: "10-08-1963",
      DOD: "N/A",
      Description:
        "David Yates was born on 8 October 1963 in St. Helens, Merseyside, UK. He directed several HP films.",
    },
  },
  {
    Title: "Harry Potter and the Half-Blood Prince",
    Release: "2009",
    Genre: "Adventure, Fantasy",
    Description:
      "As Harry Potter begins his sixth year at Hogwarts, he discovers an old book marked as 'the property of the Half-Blood Prince' and begins to learn more about Lord Voldemort's dark past.",
    Rating: "PG",
    "Img URL":
      "https://www.imdb.com/title/tt0417741/mediaviewer/rm282560512/?ref_=tt_ov_i",
    Director: {
      Name: "David Yates",
      DOB: "10-08-1963",
      DOD: "N/A",
      Description:
        "David Yates was born on 8 October 1963 in St. Helens, Merseyside, UK. He directed several HP films.",
    },
  },
  {
    Title: "Harry Potter and the Deathly Hallows: Part 1",
    Release: "2010",
    Genre: "Adventure, Fantasy",
    Description:
      "As Harry, Ron, and Hermione race against time and evil to destroy the Horcruxes, they uncover the existence of the three most powerful objects in the wizarding world: the Deathly Hallows.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt0926084/mediaviewer/rm706774528/?ref_=tt_ov_i",
    Director: {
      Name: "David Yates",
      DOB: "10-08-1963",
      DOD: "N/A",
      Description:
        "David Yates was born on 8 October 1963 in St. Helens, Merseyside, UK. He directed several HP films.",
    },
  },
  {
    Title: "Harry Potter and the Deathly Hallows: Part 2",
    Release: "2011",
    Genre: "Adventure, Fantasy",
    Description:
      "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt1201607/mediaviewer/rm3179585537/?ref_=tt_ov_i",
    Director: {
      Name: "David Yates",
      DOB: "10-08-1963",
      DOD: "N/A",
      Description:
        "David Yates was born on 8 October 1963 in St. Helens, Merseyside, UK. He directed several HP films.",
    },
  },
  {
    Title: "The Lord of the Rings: The Fellowship of the Ring",
    Release: "2001",
    Genre: "Adventure, Fantasy",
    Description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-Earth from the Dark Lord Sauron.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/?ref_=tt_ov_i",
    Director: {
      Name: "Peter Jackson",
      DOB: "10-31-1961",
      DOD: "N/A",
      Description:
        "Sir Peter Jackson made history with the LOTR trilogy, becoming the first person to direct three major feature films simultaneously.",
    },
  },
  {
    Title: "The Lord of the Rings: The Two Towers",
    Release: "2002",
    Genre: "Adventure, Fantasy",
    Description:
      "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided Fellowhip makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt0167261/mediaviewer/rm306845440/?ref_=tt_ov_i",
    Director: {
      Name: "Peter Jackson",
      DOB: "10-31-1961",
      DOD: "N/A",
      Description:
        "Sir Peter Jackson made history with the LOTR trilogy, becoming the first person to direct three major feature films simultaneously.",
    },
  },
  {
    Title: "The Lord of the Rings: The Return of the King",
    Release: "2003",
    Genre: "Adventure, Fantasy",
    Description:
      "Gandalf and Aaragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mt. Doom with the One Ring.",
    Rating: "PG-13",
    "Img URL":
      "https://www.imdb.com/title/tt0167260/mediaviewer/rm584928512/?ref_=tt_ov_i",
    Director: {
      Name: "Peter Jackson",
      DOB: "10-31-1961",
      DOD: "N/A",
      Description:
        "Sir Peter Jackson made history with the LOTR trilogy, becoming the first person to direct three major feature films simultaneously.",
    },
  },
];

// 1. READ, return list of movies, status 200 is OK
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// 2. READ, return data by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  // applies find method to array of movies
  const movie = movies.find((movie) => movie.Title === title);
  // checks return, 200 is OK, 400 is bad request
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Movie is not on the list.");
  }
});

// 3. READ, return data by genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  // only returns genre section
  const genre = movies.find((movie) => movie.Genre === genreName).Genre;
  // checks return, 200 is OK, 400 is bad request
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre.");
  }
});

// 4. READ, return data by director
app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  // only returns director section
  const director = movies.find(
    (movie) => movie?.Director?.Name === directorName
  )?.Director;
  // // checks return, 200 is OK, 400 is bad request
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("No such director.");
  }
  return res.status(200);
});

// 5. CREATE, register users
app.post("/users", (req, res) => {
  // uses bodyParser
  const newUser = req.body;
  // checks if user has name
  if (newUser.name) {
    // auto creates user id
    newUser.id = uuid.v4();
    // empty array for favorite movies
    newUser.favoriteMovies = [];
    users.push(newUser);
    // 201 is created
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Users require names.");
  }
});

// 6. UPDATE, updates users
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  // user id and user name truthy equal
  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user.");
  }
});

// 7. POST, users add movies to favorites list
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  // user id and user name truthy equal
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies.push(movieTitle);
    // text confirming movie added
    res
      .status(200)
      .send(`${movieTitle} has been added to User ${id}/n's array.`);
  } else {
    res.status(400).send("No such movie.");
  }
});

// 8. DELETE, users remove movie from list
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  // user id and user name truthy equal
  let user = users.find((user) => user.id == id);
  if (user) {
    // only movies not matching deleted title stay in array
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    // text confirming movie removed
    res
      .status(200)
      .send(`${movieTitle} has been removed from User ${id}/n's array.`);
  } else {
    res.status(400).send("No such user.");
  }
});

// 9. DELETE, users may deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    // only users not matching deleted user stay in array
    users = users.filter((user) => user.id != id);
    // text confirming user removed
    res.status(200).send(`User ${id} has been removed.`);
  } else {
    res.status(400).send("No such user.");
  }
});

// listening
app.listen(8888, () => console.log("Listening on Port 8888."));

// original code from earlier assignment

// imports http, url, fs modules
//const http = require("http"),
//fs = require("fs"),
//url = require("url");

// creates new server, url
//const server = http.createServer((request, response) => {
//let addr = request.url,
//q = new URL(addr, "http://localhost:8080"),
//filePath = "";

// if url contains "documentation", returns documentation.html;
// otherwise, returns index.html
//if (q.pathname.includes("documentation")) {
//filePath = __dirname + "/documentation.html";
//} else {
//filePath = "index.html";
//}

// returns correct file to user
//fs.readFile(filePath, (err, data) => {
//if (err) {
//throw err;
//}

//response.writeHead(200, { "Content-Type": "text/html" });
//response.write(data);
//response.end("Hello Node!\n");
//});

// logs request url + timestamp into log.txt
//fs.appendFile(
//"log.txt",
//"URL:" + addr + "\nTimestamp: " + new Date() + "\n\n",
//(err) => {
//if (err) {
//console.log(err);
//} else {
//console.log("Added to log.");
//}
//}
//);
//});

// listens for requests from Port 8080
//server.listen(8080);

//console.log("This server is running on Port 8080.");
