var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var app = express();

// Analyser les corps de requête au format JSON
app.use(bodyParser.json());

// Analyser les corps de requête au format urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Session object declear
 */
var session = require('express-session');

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var usersRouter = require('./routes/users');
app.use('/', usersRouter);
var usersRouter = require('./routes/register-bebe');
app.use('/', usersRouter);

const db = require('./database/config');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // durée de vie de la session en millisecondes (1 heure)
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



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

const isAuth = require('./routes/middleware/isAuth'); 
app.use('/isAuth',isAuth);

console.log('Before line 60');
// Your

const isAdmin = require('./routes/middleware/isAdmin');
app.use('/isAdmin', isAdmin);

app.listen(3000, function() {
  console.log('Running server');
})


