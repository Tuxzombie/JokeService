/**
 * Created by Jeppe on 25-04-2017.
 */

$(document).ready(function () {

    var arrJokes = [];
    var currentJoke = 0;
    var sectJokes = $('#container');

    $.getJSON("/api/jokes", function (result) {
        for(var i = 0; i < result.length; i++) {
            arrJokes.push(result[i]);
        }});

    function setJoke() {
        sectJokes.empty();
        $.get('../views/index.hbs', function (template) {
            $('#container').empty();
            var compiled = Handlebars.compile(template);
            var html = compiled({
                    setup: arrJokes[currentJoke].setup,
                    punchline: arrJokes[currentJoke].punchline });
            $('#container').append(html);
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

    $('#btnNext').click(function() {
        nextJoke();
    });

    $('#btnPrev').click(function() {
       prevJoke();
    });

    function postJoke() {
        $.ajax({
            type: "POST",
            url: '/api/jokes',
            data: '{"setup": "", "punchline": ""}',
            success: function() {
                alert("Your joke has been posted!")
            },
            dataType: json
        });
    }

});