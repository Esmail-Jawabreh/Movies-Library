DROP TABLE IF EXISTS addMovie ;

CREATE TABLE IF NOT EXISTS addMovie (
    id SERIAL PRIMARY KEY,
    movieTitle VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(1000),
    overview VARCHAR(1000),
    comment VARCHAR(1000)
);

