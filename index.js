// require express, also morgan
// also import built-ins to log user requests to log.txt file
const express = require('express');
    morgan = require('morgan');
    fs = require('fs'),
    path = require('path');

const app = express();

// sets up log.txt to receive user requests log
const accessLogStream = fs.createWriteStream(path.join__dirname, 'log.txt');

let topMovies = [
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        release: '2001'
    },
    {
        title: 'Harry Potter and the Chamber of Secrets',
        release: '2002'
    },
    {
        title: 'Harry Potter and the Prisoner of Azkaban',
        release: '2004'
    },
    {
        title: 'Harry Potter and the Goblet of Fire',
        release: '2005'
    },
    {
        title: 'Harry Potter and the Order of the Pheonix',
        release: '2007'
    },
    {
        title: 'Harry Potter and the Half-Blood Prince',
        release: '2009'
    },
    {
        title: 'Harry Potter and the Deathly Hallows: Part 1',
        release: '2010'
    },
    {
        title: 'Harry Potter and the Deathly Hallows: Part 2',
        release: '2011'
    }
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        release: '2001'
    },
    {
        title: 'The Lord of the Rings: The Two Towers',
        release: '2002'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        release: '2003'
    }
];

// get request to return json, endpoint /movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// get request returns default text, endpoint /
app.get('/', (req, res) => {
    res.send('This is a list of great movies.');
});

// gets documentation.html file from public folder instead of using modules (express.static)
app.use('/documentation.html', express.static('public'));

// uses morgan to log user requests
app.use(morgan('combined', {stream: accessLogStream}));

// error handling
app.use((err, req, res, next) => {
    consolse.error(err.stack);
    res.status(500).send('This is an error message.');
});

// listens to port
app.listen(8080, () => {
    console.log('Listening on Port 8080.');
});
