const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const Conflict = require('../errors/Conflict');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

userSchema.statics.checkEmailDuplicate = function (email, excludeId = null) {
  return this.findOne({ email })
    .then((user) => {
      if (user && user._id.toString() !== excludeId) {
        throw Promise.reject(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
    })
    .catch((err) => err);
};

module.exports = mongoose.model('user', userSchema);
