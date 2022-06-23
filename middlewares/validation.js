const { isURL } = require('validator');
const { celebrate, Joi } = require('celebrate');

const isUrlCustomValidator = (value, helpers) => (isURL(value) ? value : helpers.message('Это поле заполнено некорректно, ожидается URL') && false);

module.exports.validateMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(3)
      .max(60),
    director: Joi.string().required(),
    duration: Joi.number().required().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isUrlCustomValidator),
    trailerLink: Joi.string().required().custom(isUrlCustomValidator),
    thumbnail: Joi.string().required().custom(isUrlCustomValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

module.exports.validateMovieDelete = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports.validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
});
