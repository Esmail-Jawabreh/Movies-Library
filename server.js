'use strict';

const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());

const PORT = 3000;


const data = require('./Movie Data/data.json');

function MovieInfo(data) {
    this.title = data.title;
    this.genre_ids = data.genre_ids;
    this.original_language = data.original_language;
    this.original_title = data.original_title;
    this.poster_path = data.poster_path;
    this.video = data.video;
    this.vote_average = data.vote_average;
    this.overview = data.overview;
    this.release_date = data.release_date;
    this.vote_count = data.vote_count;
    this.id = data.id;
    this.adult = data.adult;
    this.backdrop_path = data.backdrop_path;
    this.popularity = data.popularity;
    this.media_type = data.media_type;
}

//Home route
server.get('/', (req, res) => {

    let info = `title: ${data.title},<br> poster_path: ${data.poster_path},<br> overview: ${data.overview}`
    res.send(info);

})


// Favorite Page
server.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page.');
});


// Function to handle server error (status 500)
function handleServerError(error, req, res, next) {
    console.error(error.stack);
    res.status(500).send({
        status: 500,
        responseText: 'Sorry, something went wrong.',
    });
}

// Function to handle "page not found" error (status 404)
function handlePageNotFoundError(req, res, next) {
    res.status(404).send('Page not found.');
}

// Add error handling middleware to the server
server.use(handleServerError);
server.use(handlePageNotFoundError);



server.listen(PORT, () => {
    console.log(`Port ${PORT} is ready.`);
})