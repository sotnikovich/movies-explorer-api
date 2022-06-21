const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Данный путь не найден'));
});

module.exports = router;
