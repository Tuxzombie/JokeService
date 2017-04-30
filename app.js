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
app.set('view engine', 'hbs');
app.set('views', './public/views');

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

// Extra services!!
var otherJokeServices = [];
var otherJokes = [];

var registerServerToJokeRegistry  = function() {
    request.post({
        url:     'https://krdo-joke-registry.herokuapp.com/api/services',
        form:    { "name": "Dad's Jokeservice",
            "address": "http://jokeService-jeppe-steen.herokuapp.com",
            "secret": "1234" }
    }, function(error, response, body){
        console.log(error);
    });
};

var requestServers = function() {
    var options = {json: true, url: 'https://krdo-joke-registry.herokuapp.com/api/services'};
    request(options, function (error, response, body) {
        if (error) {
            console.log("Error getting other joke services.")
        } else {
            for (var i = 0; i < body.length; i++) {
                if(body[i].address !== "http://jokeService-jeppe-steen.herokuapp.com") {
                    otherJokeServices.push(body[i]);
                }
            }
        }
        console.log("serverArray indeholder: "+otherJokeServices);
        populateJokeArray();
    });
};

var populateJokeArray = function() {
    console.log("Henter Jokes, serverArray indeholder: "+otherJokeServices.length+" adresser");
    // otherJokes = [];

    for (var i = 0; i < otherJokeServices.length; i++) {
        var options = {json: true, url: otherJokeServices[i].address + 'api/jokes'};
        console.log(otherJokeServices[i].address);

        request(options, function (error2, response, jokeBody) {

            if (error2) {
                console.log("Invalid url")
            } else if (response.statusCode == 200) {
                console.log('Responded with statuscode: ' + response.statusCode);
                console.log('Fetching jokes from server URL: ' + options.url);
                for (var m = 0; m < jokeBody.length; m++) {
                    if (jokeBody[m].setup && jokeBody[m].punchline) {
                        otherJokes.push(
                            {
                                '_id' : jokeBody[m]._id,
                                'setup': jokeBody[m].setup,
                                'punchline': jokeBody[m].punchline,
                                'fromServer': 'Foreign joke!'
                            });
                    }
                }

                console.log(otherJokes);

            } else {
                console.log('Responded with statuscode: ' + response.statusCode)
            }
        });
    }
};

setInterval(function() {
    otherJokeServices = [];
    otherJokes = [];

    registerServerToJokeRegistry();
    requestServers();

    global.otherJokes = otherJokes;
}, 10000);

module.exports = app;