const Movie = require('../models/Movie');

exports.getMovies = (req, res) => {
    console.log('depuis movieController.getMovies');

    const title = "Votre liste de films préférés";
    moviesList = [];
    Movie.find((err, movies) => {
        if(err) {
            console.log('Impossible de récupérer votre liste de films depuis la base de données');
            res.sendStatus(500);
        } else {
            moviesList = movies;
            res.render('movies', { title: title, movies: moviesList});
        }
    });
}

exports.postMovie = (req, res) => {
    console.log('depuis movieController.postMovie');
    
    if (!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body; 
        console.log('form data: ', formData);
        
        const title = req.body.movietitle;
        const year = req.body.movieyear;
        const real = req.body.moviereal;
        const synopsis = req.body.moviesynopsis;
        const myMovie = new Movie({ movietitle: title, movieyear: year, moviereal: real, moviesynopsis: synopsis });

        myMovie.save((err, savedMovie) => {
            if(err) {
                console.error(err);
                return;
            } else {
                console.log(savedMovie);
            }
        });
        
        res.sendStatus(201);
    } 
};

exports.getMoviesOldBrowsers = (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {    
        moviesList = [... moviesList, { title: req.body.movietitle, year: req.body.movieyear, real: req.body.moviereal, synopsis: req.body.moviesynopsis }];
        res.sendStatus(201);
    } 
};

exports.getMoviesAdd = (req, res) => {
    res.send("Prochainement, un formulaire d'ajout ici");
};

exports.getMovieById = (req, res) => {
    const id = req.params.id;
    res.render('movie-details');
};

exports.postMovieDetails = (req, res) => {
    console.log('movietitle: ', req.body.movietitle, 'movieyear: ', req.body.movieyear, 'moviereal:', req.body.moviereal, 'moviesynopsis: ', req.body.moviesynopsis);
    if (!req.body) {
        return res.sendStatus(500);
    }
    const id = req.params.id;
    Movie.findByIdAndUpdate(id, { $set : {movietitle: req.body.movietitle, movieyear: req.body.movieyear, moviereal: req.body.moviereal, moviesynopsis: req.body.moviesynopsis}}, 
                                { new: true }, (err, movie) => {
        if(err) {
            console.error(err);
            return res.send("Le film n'a pas pu être mis à jour");
        }
        res.redirect('/movies');
    });
};

exports.getMovieDetails = (req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        console.log('movie-details', movie);
        res.render('movie-details.ejs', { movie: movie});
    })
};

exports.deleteMovie = (req, res) => {
    console.log('depuis movieController.delete.Movie');

    Movie.findByIdAndDelete(req.params.id, function (err, movie) {
        console.log(movie);
        res.sendStatus(202);
    });
};

exports.movieSearch = (req, res) => {
    res.render('movie-search');
};
