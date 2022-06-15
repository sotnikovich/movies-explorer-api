const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createNewMovie = async (req, res, next) => {
  const owner = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError('Фильм с указанным _id не найден')))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new Forbidden('Нельзя удалить чужой фильм'));
      }
      return Movie.deleteOne(movie)
        .then(() => res.status(200).send(movie));
    })
    .catch(next);
};
