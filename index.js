// Asenna express ja body-parser
// Lisätään start ja dev (nodemon) -komentosarjat package.json-tiedostoon:
// "dev": "nodemon index.js",
// "start": "node index.js",
// Asenna pg

const express = require('express');
const bodyParser = require('body-parser');
const query = require('./db/movies');
const auth = require('./services/authenticate');

const app = express();
app.use(bodyParser.json());

const port = 3000;

// Salainen avain jwt: lle. Saimme sen ympäristöparametrista, jota kutsuttiin nimellä process.env.SECRET_KEY. 
// Process.env on globaali muuttuja, jonka tarjoaa Node. Voit lisätä process.env avulla omat ympäristömuuttujat. 
// Tällä koodilla saat salaisen avaimen ympäristömuuttujasta process.env.SECRET_KEY
process.env.SECRET_KEY = "SALAINEN AVAIN TÄHÄN";

// Reitit REST API toimintoihin, app. . Viitataan movies-moduulin getAllMovies yms toimintoihin
app.get("/api/movies", auth.authenticate, query.getAllMovies);
app.post("/api/movies", auth.authenticate, query.addMovie);
app.delete("/api/movies/:id", auth.authenticate, query.deleteMovie);
app.put("/api/movies/:id", auth.authenticate, query.updateMovie);
// Route for login
app.post("/login", auth.login);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;