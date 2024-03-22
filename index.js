// require express, also morgan
// also import built-ins to log user requests to log.txt file
const express = require("express");
morgan = require("morgan");
(fs = require("fs")), (path = require("path"));

const app = express();

// sets up log.txt to receive user requests log
const accessLogStream = fs.createWriteStream(path.join__dirname, "log.txt");

let topMovies = [
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

// get request to return json, endpoint /movies
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// get request returns default text, endpoint /
app.get("/", (req, res) => {
  res.send("This is a list of great movies.");
});

// gets documentation.html file from public folder instead of using modules (express.static)
app.use("/documentation.html", express.static("public"));

// uses morgan to log user requests
app.use(morgan("combined", { stream: accessLogStream }));

// error handling
app.use((err, req, res, next) => {
  consolse.error(err.stack);
  res.status(500).send("This is an error message.");
});

// listens to port
app.listen(8080, () => {
  console.log("Listening on Port 8080.");
});
