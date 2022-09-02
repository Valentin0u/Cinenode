const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const axios = require('axios');
const path = require('path');

const authController = require('./controllers/authController');
const movieController = require('./controllers/movieController');


var { expressjwt: jwt } = require("express-jwt");
const config = require('./config');

console.log(config);

const mongoose = require('mongoose');
const Movie = require('./models/Movie');

mongoose.Promise = Promise;


mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@cluster0.wmlpgng.mongodb.net/cinénode`)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion : Impossible de se connecter à la DB :('));
db.once('open', function() {
  console.log('DB connectée :) ')
});


const PORT = 3000;
let moviesList = [];

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.get(jwt({ secret: secret, algorithms: ["HS256"]})
    .unless({ path: ['/', '/movies', new RegExp('/movies.*/', 'i'), '/movie-search', '/login', new RegExp('/movie-details.*/', 'i')]}));

app.get('/', (req, res) => {
        res.render('index');
    });


app.get('/movies', movieController.getMovies);

app.post('/movies', upload.fields([]), movieController.postMovie);

var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.post('/movies-old-browser', urlencodedParser, movieController.getMoviesOldBrowsers);

app.get('/movies/add', movieController.getMoviesAdd);

app.get('/movies/:id', movieController.getMovieById);

app.post('/movie-details/:id', urlencodedParser, movieController.postMovieDetails);

app.get('/movie-details/:id', movieController.getMovieDetails);

app.delete('/movie-details/:id', (req, res) => {

    const id = req.params.id;
    Movie.findByIdAndRemove(id, (err, movie) => {
        res.sendStatus(202);
    });
});

//app.delete('/movie-details/:id', movieController.deleteMovie)

app.get('/movie-search', movieController.movieSearch);

app.get('/login', authController.login);

app.post('/login', urlencodedParser, authController.postLogin);

app.get('/member-only', authController.getMemberOnly);
 
app.listen(PORT, () => {
    console.log(`Port ${PORT} à l'écoute`);
});
