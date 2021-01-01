let gameID = '';

function connect() {
    const proto = location.protocol == 'http:' ? 'ws://' : 'wss://';
    const host = location.host;
    const target = `${proto}${host}/ws/player/${gameID}`;
    console.log('connecting to', target);
    ws = new WebSocket(target);
    ws.onopen = () => { console.log('connected'); };
    ws.onmessage = (event) => { console.log(event); render(JSON.parse(event.data)); };
    ws.onclose = () => {
        console.log('socket closed');
        setTimeout(connect, 500); // reconnect
    };
    ws.onerror = (e) => {
        console.log('socket error', e);
        ws.close();
    };
}

function render(game) {
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

function init() {
    const urlParams = new URLSearchParams(location.search);
    gameID = urlParams.get('gameID')
    connect();
}

$(init);