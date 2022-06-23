const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  try {
    req.user = jwt.verify(authorization.substring(7), config.jwt_secret);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  return next();
};
