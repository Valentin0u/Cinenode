const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number,
    moviereal: String,
    moviesynopsis: String
});

module.exports = mongoose.model('Movie', movieSchema);

