/**
 * Created by Jeppe on 25-04-2017.
 */

$(document).ready(function () {

    var arrJokes = [];
    var currentJoke = 0;
    var sectJokes = $('#jokePanel');

    $.getJSON("/api/jokes", function (result) {
        for(var i = 0; i < result.length; i++) {
            arrJokes.push(result[i]);
        }});

    function setJoke() {
        sectJokes.empty();
        $.get('../views/index.hbs', function (template) {
            sectJokes.empty();
            var compiled = Handlebars.compile(template);
            var html = compiled({
                    setup: arrJokes[currentJoke].setup,
                    punchline: arrJokes[currentJoke].punchline });
            sectJokes.append(html);
        });
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

    function postJoke() {
        var jokeData = {"setup": $('#setup').val(), "punchline": $('#punchline').val()};

        if(jokeData.setup && jokeData.punchline) {
            $.post({
                type: "POST",
                url: 'https://jokeService-jeppe-steen.herokuapp.com/api/jokes',
                data: JSON.stringify(jokeData),
                success: function() {
                    alert("Your hilarious joke has been posted!")
                },
                dataType: 'json'
            });
        } else {
            alert("That is not a funny joke, punk! Jokes kinda need text to be funny!!")
        }
    }

    $('#btnNext').click(function() {
        nextJoke();
    });

    $('#btnPrev').click(function() {
       prevJoke();
    });

    $('#btnPost').click(function() {
        postJoke()
    });

});