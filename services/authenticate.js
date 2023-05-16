// Sisällytä tarvittavat moduulit: 
// Jsonwebtoken:ia käytetään luomaan ja tarkistamaan kirjautumistunnuksia. 
// Bcrypt-sovellusta käytetään salasanojen salaamiseen. 
// Users.js, tarvitaan käyttäjän hakemiseen tietokannasta kirjautumisprosessin aikana. 
// Users.js -koodi sisältää kirjautumisprosessin ja autentikoinnin toiminnot.

const jwt = require('jsonwebtoken');
const user = require('../db/users');
const bcrypt = require('bcrypt');

// User login
const login = (req, res) => {
  // Extract email and password from the request body
  // Käyttäjä voi kirjautua sisään movie REST-sovellusliittymään lähettämällä POST-pyynnön /login päätepisteeseen. 
  // Pyynnön runko-osan tulee sisältää kelvollinen sähköpostiosoite ja salasana. 
  // Sisäänkirjautumistoiminnossa puretaan ensin sähköposti ja salasana pyynnön runko-osasta.
  const email = req.body.email;
  const password = req.body.password;


// Kutsumme users.js-tiedoston getUserByEmail() kyselyä tarkistaaksemme, onko käyttäjä olemassa tietokannassa. 
// Kysely palauttaa joukon käyttäjiä, mutta koska käyttäjän sähköposti on tietokannassa yksilöivä, 
// saamme käyttäjän tulostaulun ensimmäisestä (ainoasta) elementistä. 
// Jos käyttäjä löydetään tietokannasta, tuotamme käyttäjälle kirjautumistunnuksen käyttämällä jsonwebtokenin sign() -menetelmää. 
// JSON-verkkotunnuksen generointi tarvitsee salaisen avaimen, joka on satunnainen pitkä merkkijono. 
// Koodissa saamme salaisen avaimen ympäristöparametreista.
// Lopuksi vertaamme salasanaa pyynnöstä salasanaan, jonka noudimme tietokannasta. 
// Jos nämä täsmäävät, lähetämme kirjautumistunnuksen takaisin vastauksena. 
// Jos salasana ei ole oikea, lähetämme vastauksen tilakoodilla 400
  const loginUser = user.getUserByEmail(email, (user) => {
  if (user.length > 0) {
    const hashpwd = user[0].password;
    const token = jwt.sign({userId: email}, process.env.SECRET_KEY);

    if (bcrypt.compareSync(password, hashpwd))
      res.send({token});
    else
      res.sendStatus(400).end(); 
  }
  else {
    res.sendStatus(400).end();
  }
});
}

// User authentication
const authenticate = (req, res, next) => {
  // Käytetään todentamaan kirjautumistunnus jokaisessa pyynnössä. 
  // Jos pyynnöstä saamamme tunnus ei ole oikea, vastauksena ei palauteta mitään tietoja tietokannasta.
  // Kirjautumistunnus lähetetään pyynnön Authorization -otsikossa, puretaan otsikoista express:in header-purkutoiminnolla. 
  // Jos tunnusta ei ole, lähetämme vastauksena tilakoodin 400
  const token = req.header('Authorization');
  if(!token) {
    res.sendStatus(400).end();
  }
  
  // Verify the received token
  // jsonwebtokenin vahvistustoiminto (verify)
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
     res.sendStatus(400).end();
   else
     next();
  }); 
}

module.exports = {
  authenticate: authenticate,
  login: login
}