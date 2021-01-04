function init() {
    const urlParams = new URLSearchParams(location.search);
    gameID = urlParams.get('gameID')
    connect(`ws/player/${getGameID()}`, render);
}

$(init);