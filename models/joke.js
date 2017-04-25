/**
 * Created by Jeppe on 25-04-2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Joke = new Schema({
    setup: String,
    punchline: String
},  {collection: 'joke', versionKey: false});

module.exports = mongoose.model('joke', Joke);