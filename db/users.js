// dbconfig.js-tiedosto tarvitaan, jotta pystymme suorittamaan kyselyitä tietokantaan. 
// Kyselyllä voi hakea käyttäjän tietokannasta sähköpostiosoitteen perusteella. 
// Seuraavaksi luomme kyselyn parametrisoidun kyselyn avulla. 
// Saamme myös parametrissa next takaisinkutsu-funktion. 
// Tämän avulla voimme kutsua tätä toimintoa muista javascript-tiedostoista. 
// Kun saamme tuloksen tietokannasta, kutsumme takaisinkutsu-funktiota ja välitämme tuloksen parametrina.

const db = require('./dbconfig');

// Get user by email
const getUserByEmail = (email, next) => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  } 


  db.query(query, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    else {
      next(result.rows);
    }
  })
}

module.exports = {
  getUserByEmail: getUserByEmail
}