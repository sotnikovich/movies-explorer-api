require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const config = require('./config/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');

const app = express();

mongoose.connect(config.mongo_dsn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(config.port);
