require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const config = require('./config/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const auth = require('./middlewares/auth');
const { validateLogin, validateUserCreate } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/user');
const limiter = require('./middlewares/limiter');

const app = express();
mongoose.connect(config.mongo_dsn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors({
  origin: 'https://felaw.movies.nomoredomains.xyz',
  credentials: true,
}));

app.post(limiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', validateUserCreate, createUser);
app.post('/signin', validateLogin, login);
app.use(auth);
app.use(require('./routes/errorPath'));

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(config.port);
