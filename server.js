'use strict';

const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());

const PORT = 3000; // http://localhost:3000/


//const data = require('./Movie Data/data.json');

function MovieInfo(title , poster_path , overview ) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

//Home route
server.get('/', (req, res) => {

    //let info = `title: ${data.title},<br> poster_path: ${data.poster_path},<br> overview: ${data.overview}`
    const data = require('./Movie Data/data.json');
    const info = new MovieInfo(data.title, data.poster_path, data.overview);
    res.send(info);

});


// Favorite Page
server.get('/favorite', (req, res) => {
    res.status(200).send('Welcome to Favorite Page.');
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