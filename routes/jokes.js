var index = require('./index');

var randomInt = function (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

module.exports = function(express) {
    var Joke = require('../models/joke');
    var router = express.Router();

        router.route('/api/jokes')
                .get(function(req, res) {
                    //MongoDB kald, henter alles jokezz
                    Joke.find({}, function(err, jokes) {
                            if(err) {
                                console.log("Error getting jokes...")
                            } else {
                                res.json(jokes);
                            }
                        });
                })
                .post(function(req, res) {
                    //Create joke
                    var newJoke = new Joke({
                        setup: req.body.setup,
                        punchline: req.body.punchline,
                        fromServer: 'Local'
                    });

                    //Post enkelt joke til mongozzzz
                    newJoke.save(function (err) {
                        if (err) {
                            res.status(500);
                            res.send(err);
                        } else {
                            res.json({msg: "message saved!"});
                        }
                    });
        });

    router.get('/api/jokes/:id', function(req, res, next) {
        //Hent joke med bestemt :id
        var id = req.params.id;
        Joke.find({_id: id},function (err,joke) {
            if(err){
                res.send(err);
            }
            else{
                res.json(joke);
            }
        })
    });

    router.get('/api/randomjoke', function(req, res, next) {
        //Henter tilfældig joke fra alle servere
            var currentJokes = [];


            Joke.find({}, function(err, jokes) {
                if(err) {
                    console.log("Error getting jokes from mongoDB");
                    res.json(global.otherJokes);
                } else {
                    currentJokes.push(jokes);
                    currentJokes.push(global.otherJokes);
                    res.json(currentJokes);
                }
            });

    });
return router;
};