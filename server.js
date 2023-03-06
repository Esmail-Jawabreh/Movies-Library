'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const server = express();
server.use(cors());
//server.use(errorHandler);
server.use(express.json());

const PORT = process.env.PORT; // http://localhost:3000/

require('dotenv').config();


const client = new pg.Client(process.env.DATABASE_URL);


function MovieIJSON(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function MovieAPI(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}




// routes
server.get('/', homeHandler); // Home page
server.get('/favorite', favoriteHandler); // Favorite Page

server.get('/trending', trendingHandler); // Trending Page
server.get('/search', searchHandler); // Search Page
server.get('/tvshows', tvshowsHandler); // Tv shows Page
server.get('/actors', actorsHandler); // Actors Page

server.post('/addMovie', addMovieHandler); // addMovie Page
server.get('/getMovies', getMoviesHandler); // getMovies page 
server.put('/UPDATE/:id', updateIdHandler);
server.delete('/DELETE/:id', deleteIdHandler);

// Functions Handlers

function homeHandler(req, res) {
    const JSONdata = require('./Movie Data/data.json');
    const JSONinfo = new MovieIJSON(JSONdata.title, JSONdata.poster_path, JSONdata.overview);
    res.send(JSONinfo);
}

function favoriteHandler(req, res) {
    res.status(200).send('Welcome to Favorite Page.');
}

async function trendingHandler(req, res) {
    const APIKey = process.env.APIKey;
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
    let axiosRes = await axios.get(url);

    let APIdata = axiosRes.data.results.map((item) => {
        let APIinfo = new MovieAPI(item.id, item.title, item.release_date, item.poster_path, item.overview);
        return APIinfo;
    })


    res.send(APIdata);

    //     try {
    //         const APIKey = process.env.APIKey;
    //         const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
    //         axios.get(url)
    //             .then((result) => {


    //                 let APIdata = axiosRes.data.results.map((item)=>{
    //                     let APIinfo = new MovieAPI(item.id, item.title, item.release_date, item.poster_path, item.overview);
    //                     return APIinfo;
    //                 })
    //                 res.send(APIdata);
    //             })
    //             .catch((err) => {
    //                 res.status(500).send(err);
    //                 res.status(404).send(err);
    //             })

    //     }
    //     catch (error) {
    //         handleServerError(error, req, res, next);
    //         handlePageNotFoundError(req, res, next)
    //     }
}

async function searchHandler(req, res) {
    const APIKey = process.env.APIKey;;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
    let axiosRes = await axios.get(url);
    res.send(axiosRes.data);
}

async function tvshowsHandler(req, res) {
    // const APIKey = process.env.APIKey;;
    // const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
    // let axiosRes = await axios.get(url);
    res.send('Nothing here yet.');
}

async function actorsHandler(req, res) {
    // const APIKey = process.env.APIKey;;
    // const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
    // let axiosRes = await axios.get(url);
    res.send('Nothing here yet.');
}

function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO addMovie (title,comments) VALUES ($1,$2) RETURNING *;`;

    const values = [movie.title, movie.comments];

    client.query(sql, values)
        .then((data) => {
            res.send("your data was added.");
        })
        .catch((err) => {
            handleServerError(err, req, res, next);
        })
}

function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM addMovie`;
    client.query(sql)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            handleServerError(err, req, res, next);
        })
}

function updateIdHandler(req, res) {
    const id = req.params.id;
    const sql = `UPDATE addMovie SET title=$1, comments=$2 WHERE id=${id} RETURNING *`;
    const values = [movie.title, movie.comments];
    client.query(sql, values)
        .then((data) => {
            res.status(200).send(data.rows);
        })
        .catch((err) => {
            handleServerError(err, req, res, next);
        })
}

function deleteIdHandler(req, res) {
    //console.log(req.params.id); //to get the path prameters
    const id = req.params.id;
    const sql = `DELETE FROM addMovie WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.status(204).json({});
        })
        .catch((err) => {
            handleServerError(err, req, res, next);
        })
}



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




client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Port ${PORT} is ready.`);
        })
    })
