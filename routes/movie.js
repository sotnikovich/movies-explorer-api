const movieRoutes = require('express').Router();
const { getAllMovies, createNewMovie, deleteMovie } = require('../controllers/movie');
const { validateMovieCreate, validateMovieDelete } = require('../middlewares/validation');

movieRoutes.get('/', getAllMovies);
movieRoutes.post('/', validateMovieCreate, createNewMovie);
movieRoutes.delete('/:movieId', validateMovieDelete, deleteMovie);

module.exports = movieRoutes;
