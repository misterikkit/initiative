let gameID = '';
let game = {};
let sock = null;

function initShareBox() {
    const tmpl = $('#tmplShare').html();
    const url = new URL(location.href);
    const playerURL = `${url.protocol}//${url.host}/game.html?gameID=${url.searchParams.get('gameID')}`
    $('#share').html(Mustache.render(tmpl, { url: playerURL }));
    $('#share input').focus((e) => { $(e.target).select(); });
}

function connect() {
    const proto = location.protocol == 'http:' ? 'ws://' : 'wss://';
    const host = location.host;
    const target = `${proto}${host}/ws/admin/${gameID}`;
    console.log('connecting to', target);
    const ws = new WebSocket(target);
    ws.onopen = () => { console.log('connected'); };
    ws.onmessage = (event) => {
        const newState = JSON.parse(event.data);
        game = newState;
        render(game);
    };
    ws.onclose = () => {
        console.log('socket closed');
        setTimeout(connect, 500); // reconnect
    };
    ws.onerror = (e) => {
        console.log('socket error', e);
        ws.close();
    };
    sock = ws;
}

function render(game) {
    console.log('rendering');
    game.characters.sort(cmp);
    // This little trick helps with mustache.js rendering
    game.characters[game.currentCharIndex].current = true;
    const tmpl = $('#tmplPlayerList').html();
    $('#playerList').html(Mustache.render(tmpl, { game: game }));
}

function cmp(a, b) {
    if (a.initiative < b.initiative) { return -1; }
    if (a.initiative > b.initiative) { return 1; }
    return 0;
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
    const urlParams = new URLSearchParams(location.search);
    gameID = urlParams.get('gameID')
    $('#btnNext').click(next);
    $('#btnPrev').click(prev);
    connect();
}

$(init);