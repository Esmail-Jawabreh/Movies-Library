'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const server = express();
server.use(cors());

server.use(express.json());

const PORT = process.env.PORT || 3002; // http://localhost:3002/

require('dotenv').config();


const client = new pg.Client(process.env.DATABASE_URL);


function Movie(id, title, release_date, poster_path, overview, name) {
    this.id = id;
    this.title = title || name;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

const APIKey = process.env.APIKey;



// routes

server.get('/', homeHandler);
// server.get('*', handlePageNotFoundError);
server.get('/favorite', favoriteHandler);

server.get('/trending', trendingHandler);
server.get('/search', searchHandler);
server.get('/network', networkHandler);
server.get('/people', peopleHandler);

server.get('/getMovies', getMoviesHandler);

server.post('/addMovie', addMovieHandler);
server.put('/updateMovie/:id', updateIdHandler);
server.delete('/deleteMovie/:id', deleteIdHandler);
server.get('/getMovie/:id', getMovieHandler);



// Add error handling middleware to the server

server.use(handleServerError);
server.use(handlePageNotFoundError);



// Functions Handlers

function homeHandler(req, res) {
    const JSONdata = require('./Movie Data/data.json');
    const JSONinfo = new Movie(JSONdata.id, JSONdata.title, JSONdata.release_date, JSONdata.poster_path, JSONdata.overview);
    res.send(JSONinfo);
}

function favoriteHandler(req, res) {
    res.status(200).send('Welcome to Favorite Page.');
}

function trendingHandler(req, res) {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`

        axios.get(url)
            .then((result) => {

                let APIdata = result.data.results.map((item) => {
                    let APIinfo = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview, item.name);
                    return APIinfo
                })
                res.send(APIdata);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        handleServerError(error, req, res);
    }
}

function searchHandler(req, res) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`

        axios.get(url)
            .then((axiosRes) => {

                let mapsearchRes = axiosRes.data.results.map((item) => {
                    let newMoviesearch = new Movies(item.id, item.title, item.release_date, item.poster_path, item.overview, item.name);
                    return newMoviesearch
                })
                res.send(mapsearchRes);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        handleServerError(error, req, res);
    }
}

function networkHandler(req, res) {
    try {
        const urk = `https://api.themoviedb.org/3/network/3?api_key=${APIKey}`

        axios.get(url)
            .then((result) => {
                res.send(result.data);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        handleServerError(error, req, res);
    }
}

function peopleHandler(req, res) {
    try {
        const url = `https://api.themoviedb.org/3/person/5?api_key=${APIKey}&language=en-US`

        axios.get(url)
            .then((result) => {
                res.send(result.data);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        handleServerError(error, req, res);
    }
}

function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO addMovie (movieTitle, release_date, poster_path, overview, comment)
    VALUES('${movie.movieTitle}','${movie.release_date}' ,'${movie.poster_path}' ,'${movie.overview}','${movie.comment}') ;`

    client.query(sql)
        .then((data) => {
            res.send("Added Successfully ..");
        })
        .catch((error) => {
            handleServerError(error, req, res);
        })
}

function getMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM addMovie WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((error) => {
            handleServerError(error, req, res);
        })
}

function updateIdHandler(req, res) {
    const update = req.body;
    const id = req.params.id;
    const sql = `UPDATE addMovie SET comment=$1 WHERE id='${id}' RETURNING *`;
    const values = [update.comment];
    client.query(sql, values)
        .then((data) => {
            const sql = `SELECT * FROM addMovie`;
            client.query(sql)
                .then((data) => {
                    res.send(data.rows);
                })
                .catch((error) => {
                    handleServerError(error, req, res);
                })
        })
        .catch((error) => {
            handleServerError(error, req, res);
        })
}

function deleteIdHandler(req, res) {
    const update = req.body;
    const id = req.params.id;
    let sql = `DELETE FROM addMovie WHERE id=${id} RETURNING *`;
    client.query(sql)
        .then((data) => {
            const sql = `SELECT * FROM addMovie`;
            client.query(sql)
                .then((data) => {
                    res.send(data.rows);
                })
                .catch((error) => {
                    handleServerError(error, req, res);
                })
        })
        .catch((error) => {
            handleServerError(error, req, res);
        })
}

function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM addMovie`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((error) => {
            handleServerError(error, req, res);
        })
}


// Function to handle server error (status 500)
function handleServerError(error, req, res) {
    console.error(error.stack);
    res.status(500).send({
        status: 500,
        responseText: 'Sorry, something went wrong.',
    });
}

// Function to handle "page not found" error (status 404)
function handlePageNotFoundError(req, res) {
    res.status(404).send('Page not found.');
}




client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Port ${PORT} is ready.`);
        })
    })
    .catch((err) => {
        handleServerError(error, req, res);
    })
