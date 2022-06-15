const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const { validateLogin, validateUserCreate } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateLogin, login);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError({ message: 'Данный путь не найден' }));
});

module.exports = router;
