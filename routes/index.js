var express = require('express');
var router = express.Router();
var request = require('request');
var otherJokeServices = [];
var otherJokes = [];

/* GET home page. */
router.get('/', function(req, res, next) {

    var options = {json: true, url: 'https://krdo-joke-registry.herokuapp.com/api/services'};
    request(options, function (error, response, body) {
        if(error) {
            console.log("Error getting other joke services.")
        } else {
            for(var i = 0; i < body.length; i++) {
                otherJokeServices.push(body[i]);

                options = {json: true, url: body[i].address + 'api/jokes'};
                console.log(body[i].address);

                request(options, function (error2, response, jokeBody) {
                    if(error2) {
                        console.log("Invalid url")
                    } else {
                        for(var m = 0; m < jokeBody.length; m++) {

                            otherJokes.push(
                                {'setup': jokeBody[m].setup,
                                    'punchline': jokeBody[m].punchline,
                                    'fromServer': otherJokeServices[otherJokeServices.length - 1].address});
                        }
                        console.log(otherJokes)
                    }
                });
            }
        }

    });


    res.render('index', {
        title: 'Dad\'s Jokeservice',
        setup: 'Welcome to Dad\'s wild world of terrible jokes!',
        punchline: '... So why couldn\'t the bicycle stand up by itself? It was two tired.'
    });
});

module.exports = router;