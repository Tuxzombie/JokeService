/**
 * Created by Jeppe on 25-04-2017.
 */

$(document).ready(function () {
    var arrJokes = [];
    var currentJoke = 0;
    var sectJokes = $('#sectionJoke');

    $.getJSON("/api/jokes", function (result) {
        for(var i = 0; i < result.length; i++) {
            arrJokes.push(result[i]);
            console.log(arrJokes);
        }});

    function setJoke() {
        sectJokes.empty();

        var source   = "<p>{{setup}}</p><p>{{punchline}}</p>";
        var template = Handlebars.compile(source);
        var data = {
            setup: arrJokes[currentJoke].setup,
            punchline: arrJokes[currentJoke].punchline };
        sectJokes.html(template(data));
    }

    function nextJoke() {
        if(currentJoke < arrJokes.length - 1) {
            currentJoke++;
            setJoke();
        } else {
            currentJoke = 0;
            setJoke();
        }
    }

    function prevJoke() {
        if(currentJoke > 0) {
            currentJoke--;
            setJoke();
        } else {
            currentJoke = arrJokes.length - 1;
            setJoke();
        }
    }

    $('#btnNext').click(function() {
        nextJoke();
    });

    $('#btnPrev').click(function() {
       prevJoke();
    });
});