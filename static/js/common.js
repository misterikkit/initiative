function getGameID() {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('gameID');
}

// Renders the game using mustache template embedded in the current page. This
// means the same `render()` is useful for different pages/templates.
function render(game) {
    game.characters.sort(cmp);
    // This little trick helps with mustache.js rendering
    game.characters[game.currentCharIndex].current = true;
    const tmpl = $('#tmplGameState').html();
    $('#gameState').html(Mustache.render(tmpl, { game: game }));
}

// Largest value goes first.
function cmp(a, b) {
    if (a.initiative < b.initiative) { return 1; }
    if (a.initiative > b.initiative) { return -1; }
    return 0;
}

// Connect a websocket to the given URI, and reconnect on errors. onMessage will
// be called with updated versions of the game state. onSocket will be called
// each time a new socket is established.
function connect(uri, onMessage, onSocket) {
    const proto = location.protocol == 'http:' ? 'ws://' : 'wss://';
    const host = location.host;
    const target = `${proto}${host}/${uri}`;
    console.log('connecting to', target);
    const ws = new WebSocket(target);
    ws.onopen = () => { console.log('connected'); };
    ws.onclose = () => {
        console.log('socket closed');
        setTimeout(() => { connect(uri, onMessage, onSocket); }, 500); // reconnect
    };
    ws.onerror = (e) => {
        console.log('socket error', e);
        ws.close();
    };
    ws.onmessage = (e) => {
        if (onMessage) {
            const msg = JSON.parse(e.data);
            onMessage(msg);
        }
    }
    if (onSocket) {
        onSocket(ws);
    }
}