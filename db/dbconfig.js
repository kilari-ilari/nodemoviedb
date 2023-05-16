// yhden vastuun periaate (Single-responsibility principle), 
// jokaisella moduulilla vain yksi selkeästi rajattu rooli tai tehtävä

// Tuomme dbconfig.js-tiedoston ensimmäiselle riville node-postgres Pool-moduulin. 
// Pool-moduulin avulla voimme konfiguroida ja luoda yhteysvarantoja (connection pool) Postgres SQL-tietokantaan.
const { Pool } = require('pg')

// Luomme uuden Pool-moduulin instanssin ja se saa parametrina konfigurointiolion.
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "movie",
  password: "YOUR_DB_PASSWORD" // Muuta tämä
})

// Viimeisissä riveissä exporttaamme moduulimme, jotta sitä voidaan käyttää muissa moduuleissa. 
// Nimeämme sen myös query:ksi, joka sitten kutsuu node-postgres pool.query() -toimintoa, 
// jota käytetään SQL-lauseiden suorittamiseksi tietokannassa.
module.exports = {
  query: (text, params) => pool.query(text, params),
}