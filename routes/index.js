var express = require('express');
var router = express.Router();
var request = require('request');
var Promise = require('promise');
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
                                    if (jokeBody[m].setup && jokeBody[m].punchline && !otherJokes.indexOf(jokeBody[m])) {
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

registerServerToJokeRegistry();
requestServers();

/* GET home page. */
router.get('/', function (req, res, next) {
    requestServers();
    console.log(otherJokes);

    res.render('index', {
        title: 'Dad\'s Jokeservice',
        setup: 'Welcome to Dad\'s wild world of terrible jokes!',
        punchline: '... So why couldn\'t the bicycle stand up by itself? It was two tired.',
        fromServer: 'Local'
    });
});

global.otherJokes = otherJokes;

module.exports = router;
