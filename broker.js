

class Broker {
    constructor(mgr) {
        this.mgr = mgr;
        this.players = {};
        this.admins = {};
    }

    AddPlayerSocket(s, gameID) {
        console.log('Player joining game', gameID)
        if (!this.mgr.Has(gameID)) {
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
        s.send(JSON.stringify(this.mgr.Get(gameID)));
    }

    AddAdminSocket(s, gameID) { }
}

exports.Broker = Broker;