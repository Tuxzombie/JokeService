var express = require('express');
var router = express.Router();
var request = require('request');
var Promise = require('promise');

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

module.exports = router;
