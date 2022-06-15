const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const config = require('../config/config');

module.exports.findAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return next(new NotFoundError('Пользователь не найден'));
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        config.jwt_secret,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new Unauthorized('Авторизация не пройдена')));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.checkEmailDuplicate(email, req.user._id).then(() => {
    User.findByIdAndUpdate(req.user._id, { name, email })
      .then((user) => {
        if (user) {
          res.send(user);
        }
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Переданы невалидные данные'));
        }
        if (err.name === 'MongoError' && err.code === 11000) {
          return next(new Conflict('Конфликт данных'));
        }
        return next(err);
      });
  });
};
