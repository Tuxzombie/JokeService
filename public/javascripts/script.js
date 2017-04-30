/**
 * Created by Jeppe on 25-04-2017.
 */

$(document).ready(function () {
    var sectJokes = $('#jokePanel');

    function setJoke(setup, punchline, fromServer) {
        sectJokes.empty();
        $.get('../views/index.hbs', function (template) {
            sectJokes.empty();
            var compiled = Handlebars.compile(template);
            var html = compiled({
                setup: setup,
                punchline: punchline,
                fromServer: fromServer
            });
            sectJokes.append(html);
        });
    }

    function postJoke() {
        var jokeData = {"setup": $('#setup').val(), "punchline": $('#punchline').val()};

        if (jokeData.setup && jokeData.punchline) {
            $.post({
                type: "POST",
                url: 'https://jokeService-jeppe-steen.herokuapp.com/api/jokes',
                data: jokeData,
                success: function () {
                    alert("Your hilarious joke has been posted!")
                },
                dataType: 'json'
            });
        } else {
            alert("That is not a funny joke, punk! Jokes kinda need text to be funny!!")
        }
    }

    $('#btnPost').click(function () {
        postJoke()
    });

    $('#btnRandom').click(function () {
        $.getJSON("/api/randomjoke", function (result) {
            setJoke(result.setup, result.punchline, result.fromServer);
        });

    });

});