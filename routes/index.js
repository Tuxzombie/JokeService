var express = require('express');
var router = express.Router();
var request = require('request');
var Promise = require('promise');
var otherJokeServices = [];
var otherJokes = [];


/* GET home page. */
router.get('/', function (req, res, next) {

    var populateJokeArr = function() {
        for (var i = 0; i < otherJokeServices.length; i++) {
            options = {json: true, url: body[i].address + 'api/jokes'};
            console.log(otherJokeServices[i].address);

            request(options, function (error2, response, jokeBody) {
                if (error2) {
                    console.log("Invalid url")
                } else if (response.statusCode == 200) {
                    console.log('Responded with statuscode: ' + response.statusCode);
                    // console.log('Fetching jokes from server URL: ' + otherJokeServices[i].address);
                    for (var m = 0; m < jokeBody.length; m++) {
                        if (jokeBody[m].setup && jokeBody[m].punchline) {
                            otherJokes.push(
                                {
                                    'setup': jokeBody[m].setup,
                                    'punchline': jokeBody[m].punchline,
                                    'fromServer': otherJokeServices[i].address
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
    // var requestServers = function() {
    //     var options = {json: true, url: 'https://krdo-joke-registry.herokuapp.com/api/services'};
    //         request(options, function (error, response, body) {
    //             console.log("Kommer vi ned i request????");
    //             if (error) {
    //                 console.log("Error getting other joke services.")
    //             } else {
    //                 for (var i = 0; i < body.length; i++) {
    //                     otherJokeServices.push(body[i]);
    //                     console.log("Pushed vi servere?");
    //                 }
    //             }
    //         });
    //     };

    function requestp() {
        return new Promise(function (resolve, reject) {
            var options = {json: true, url: 'https://krdo-joke-registry.herokuapp.com/api/services'};
            request(options, function (error, response, body) {
                if (error) {
                    console.log("Error getting other joke services.")
                } else {
                    for (var i = 0; i < body.length; i++) {
                        otherJokeServices.push(body[i]);
                    }
                }
            });
        });
    }

    requestp().then(populateJokeArr(), function (err) {
        console.error("%s; %s", err.message, url);
        console.log("%j", err.res.statusCode);
    });

    res.render('index', {
        title: 'Dad\'s Jokeservice',
        setup: 'Welcome to Dad\'s wild world of terrible jokes!',
        punchline: '... So why couldn\'t the bicycle stand up by itself? It was two tired.'
    });
});

module.exports = router;