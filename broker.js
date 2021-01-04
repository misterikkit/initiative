

class Broker {
    constructor(mgr) {
        this.mgr = mgr;
        this.players = {};
        this.admins = {};
    }

    AddPlayerSocket(s, gameID) {
        console.log('Player joining game', gameID)
        this.mgr.Get(gameID)
            .then((game) => {
                if (!game) {
                    console.log('Invalid game id', gameID);
                    // TODO: signal 404 back to user somehow
                    return;
                }
                if (!(gameID in this.players)) {
                    this.players[gameID] = [];
                }
                this.players[gameID].push(s);

                s.on('error', (err) => {
                    console.log('Player socket error', err);
                    s.close();
                })
                s.on('close', () => {
                    // Remove this socket from the list.
                    const idx = this.players[gameID].indexOf(s);
                    this.players[gameID].splice(idx, 1);
                })
                // Send initial game state.
                s.send(JSON.stringify(game));
            })
            .catch(console.error);
    }

    AddAdminSocket(s, gameID) {
        console.log('Admin joining game', gameID)
        this.mgr.Get(gameID)
            .then((game) => {
                if (!game) {
                    console.log('Invalid game id', gameID);
                    // TODO: signal 404 back to user somehow
                    return;
                }
                if (!(gameID in this.admins)) {
                    this.admins[gameID] = [];
                }
                this.admins[gameID].push(s);

                s.on('error', (err) => {
                    console.log('Admin socket error', err);
                    s.close();
                })
                s.on('close', () => {
                    // Remove this socket from the list.
                    const idx = this.admins[gameID].indexOf(s);
                    this.admins[gameID].splice(idx, 1);
                })
                s.on('message', (msg) => {
                    try {
                        const newState = JSON.parse(msg);
                        this.mgr.Update(gameID, newState)
                            .then(() => {
                                this.updateClients(gameID);
                            })
                            .catch(console.error);
                    } catch (err) {
                        console.error('Update error:', err);
                    }
                });
                // Send initial game state.
                s.send(JSON.stringify(game));
            })
            .catch(console.error);
    }

    updateClients(gameID) {
        this.mgr.Get(gameID)
            .then((game) => {
                if (!game) { return; }
                const newState = JSON.stringify(game);

                const players = this.players[gameID]
                if (players) {
                    players.map((p) => { p.send(newState); });
                }
                const admins = this.admins[gameID];
                if (admins) {
                    admins.map((a) => { a.send(newState) })
                }
            })
            .catch(console.error);
    }
}

exports.Broker = Broker;