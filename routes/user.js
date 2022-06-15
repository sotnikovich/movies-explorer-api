const userRoutes = require('express').Router();
const { findAuthUser, updateProfile } = require('../controllers/user');
const { validateProfileUpdate } = require('../middlewares/validation');

userRoutes.get('/me', findAuthUser);
userRoutes.patch('/me', validateProfileUpdate, updateProfile);

module.exports = userRoutes;
