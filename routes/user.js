const userRoutes = require('express').Router();
const { findAuthUser, updateUser } = require('../controllers/user');
const { validateProfileUpdate } = require('../middlewares/validation');

userRoutes.get('/me', findAuthUser);

userRoutes.patch('/me', validateProfileUpdate, updateUser);
module.exports = userRoutes;
