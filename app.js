'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 8080)); // Set the port

// Setup mongoDB w. mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongoConn = mongoose.connect('mongodb://user:1234@ds163010.mlab.com:63010/jepdb').connection;
mongoConn.on('error', function(err) {
    console.error(err.message);
    console.error("MongoDB connection failed");
});
mongoConn.once('open', function() {
    console.log("MongoDB connection open");
});

//Export models...
var joke = require('./models/joke');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
var index = require('./routes/index');
var jokes = require('./routes/jokes')(express);
app.use(index);
app.use(jokes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(app.get('port'), function () {
    console.log('app is running on port', app.get('port'));
});

module.exports = app;