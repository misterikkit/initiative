let gameID = '';

function getGameState() {
    $.get(`/gamestate/${gameID}`)
        .done(render)
        .fail(console.error);
}

function render(game) {
    game.characters.sort(cmp);
    const tmpl = $('#listItem').html();
    game.characters.map((char) => {
        $('#theList').append(
            Mustache.render(tmpl, { name: char.name, initVal: char.initiative })
        );
    });
}

function cmp(a, b) {
    if (a.initiative < b.initiative) { return -1; }
    if (a.initiative > b.initiative) { return 1; }
    return 0;
}

function init() {
    const urlParams = new URLSearchParams(location.search);
    gameID = urlParams.get('gameID')
    getGameState();
}

$(init);