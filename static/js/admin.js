let game = {};
let sock = null;

function initShareBox() {
    const tmpl = $('#tmplShare').html();
    const url = new URL(location.href);
    const playerURL = `${url.protocol}//${url.host}/game.html?gameID=${url.searchParams.get('gameID')}`
    $('#share').html(Mustache.render(tmpl, { url: playerURL }));
    $('#share input').focus((e) => { $(e.target).select(); });
}

function next() {
    if (!sock) { return; }
    game.currentCharIndex++;
    if (game.currentCharIndex >= game.characters.length) {
        game.currentCharIndex -= game.characters.length;
        game.currentRound++;
    }
    sock.send(JSON.stringify(game));
}

function prev() {
    if (!sock) { return; }
    game.currentCharIndex--;
    if (game.currentCharIndex < 0) {
        game.currentCharIndex += game.characters.length;
        game.currentRound--;
    }
    sock.send(JSON.stringify(game));
}

function init() {
    initShareBox();
    $('#btnNext').click(next);
    $('#btnPrev').click(prev);
    connect(`ws/admin/${getGameID()}`,
        (newState) => {
            game = newState;
            render(newState);
        },
        (s) => { sock = s; });
}

$(init);