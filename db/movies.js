// Kyselyt, joita olemme käyttäneet aiemmin index.js-tiedostossa, siirretään nyt movies.js-tiedostoon. 
// Meidän on ensin tuotava dbconfig.js-moduuli movies.js-tiedostoon voidaksemme kommunikoida tietokannan kanssa. 

const db = require('./dbconfig');

// Seuraavaksi määrittelemme kyselymme täällä luomalla ne funktioiksi, joiden nimi on getAllMovies ja getMovieById.
// vertaa: app.get("/api/movies", (req, res) =>

// Muuten kyselyt ovat täsmälleen samat.
// Lisäämme reitin, joka kuuntelee GET-pyyntöä /api/movies- päätepisteessä. 
// Kun pyyntö saapuu, db.query-toiminto käynnistetään kaikkien elokuvien hakemiseksi elokuvatietokannasta. 
// db.query-funktio saa kaksi parametria. Ensimmäinen parametri on SQL-kysely, jonka haluamme suorittaa. 
// Toinen parametri on takaisinkutsu-funktio, jota kutsutaan, kun kysely on suoritettu. 
// Funktion tulosparametri (result) sisältää haun tulosjoukon ja virheparametri (err) sisältää virheen, 
// jos sellaista on. result.rows sisältää kyselyn tuloksen, joka on tässä tapauksessa joukko elokuvia. 
// Tarkistamme, onko takaisinkutsu-funktiossa virheitä, ja kirjaamme ne konsoliin. 
// Muussa tapauksessa kyselyn tulos lähetetään vastauksessa.

// Get all movies
const getAllMovies = (req, res) => {
  db.query('SELECT * FROM movies', (err, result) => {
    if (err)
      console.error(err);
    else
      res.json(result.rows)
  })
}

// Get movie by id
const getMovieById = (req, res) => {
  const query = {
    text: 'SELECT * FROM movies WHERE id = $1',
    values: [req.params.id],
  }

  db.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    else {
      if (result.rows.length > 0)
        res.json(result.rows);
      else
        res.status(404).end();
    }
  })
}

// Add new movie
const addMovie = (req, res) => {
  // Extract movie from the request body
  const newMovie = req.body;

  const query = {
    text: 'INSERT INTO movies (title, director, year) VALUES ($1, $2, $3)',
    values: [newMovie.title, newMovie.director, newMovie.year],
  }
  
  db.query(query, (err, res) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
  })
  
  res.json(newMovie);
}

//Delete movie
const deleteMovie = (req, res) => {
    const query = {
      text: 'DELETE FROM movies WHERE id = $1',
      values: [req.params.id],
    }
  
    db.query(query, (err, res) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
    })
  
    res.status(204).end();
  }

// Update movie
const updateMovie = (req, res) => {
    // Extract edited movie from the request body
    const editedMovie = req.body;
  
    const query = {
      text: 'UPDATE movies SET title=$1, director=$2, year=$3 WHERE id = $4',
      values: [editedMovie.title, editedMovie.director, editedMovie.year, req.params.id],
    }
  
    db.query(query, (err, res) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
    })
  
    res.json(editedMovie);
  }

// Delete all movies
const deleteAllMovies = () => {
  db.query('DELETE FROM movies', (err, res) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
  })
}

module.exports = {
  getAllMovies: getAllMovies,
  getMovieById: getMovieById,
  addMovie: addMovie,
  deleteMovie: deleteMovie,
  updateMovie: updateMovie,
  deleteAllMovies: deleteAllMovies
}