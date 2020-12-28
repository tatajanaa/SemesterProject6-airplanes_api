const createError = require('http-errors');
const logger = require('morgan');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql');
const myConnection = require("express-myconnection");

let indexRouter = require('./routes/index');
let flightsRouter = require('./routes/flights');
let planesRouter = require('./routes/planes');
let weatherRouter = require('./routes/weather');

let config =
    {
      host: "sep6db.mysql.database.azure.com",
      user: "sep6@sep6db",
      password: "Sepsix1234",
      database: 'united_airplanes_db',
      ssl: true
    };

const app = express();

app.use(cors())
app.use(myConnection(mysql, config, 'single'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/flights', flightsRouter);
app.use('/weather', weatherRouter);
app.use('/planes', planesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
