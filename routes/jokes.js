var express = require('express');
var router = express.Router();

router.route('/api/jokes')
    .get(function(req, res) {
        var jokes;
        //MongoDB kald, hent alles jokezz
        jokes.find(function (err,msg) {
            if(err){
                res.send(err);
            }
            else{
                res.json(msg);
            }
        })
    })
    .post(function(req, res) {
        //Create joke
        var joke = new Joke({
            setup: req.body.setup,
            punchline: req.body.punchline
         //Post enkelt joke til mongozzzz
});

router.get('/api/jokes/:id', function(req, res, next) {
    //Hent joke med bestemt :id
});



module.exports = router;
