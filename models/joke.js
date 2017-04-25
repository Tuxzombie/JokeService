/**
 * Created by Jeppe on 25-04-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var joke = new Schema({
    setup: String,
    punchline: String
});

joke.methods.printJoke = function() {
    console.log(this.setup + " ........... " + this.punchline);
};

module.exports = mongoose.model('Joke', joke);