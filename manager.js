const uuid = require('uuid');

// Manager holds the current state of all games.
// TODO: Manager should also persist & restore game state across server restarts
class Manager {
    constructor() {
        this.games = {};
    }

    NewGame(characters) {
        const newGame = {
            id: uuid.v4(),
            created: Date.now(),
            characters: characters.map((c) => ({ name: c.name, initiative: parseInt(c.initiative) })),
            currentRound: 1,
            currentCharIndex: 0
        }
        if (newGame.characters.some((c) => isNaN(c.initiative))) {
            throw 'Invalid initiative value';
        }
        this.games[newGame.id] = newGame;
        return newGame.id;
    }

    Has(gameID) { return (gameID in this.games); }
    Get(gameID) { return this.games[gameID]; }

    Update(gameID, game) {
        if (!this.Has(gameID)) {
            // TODO: throw an error?
            return;
        }
        // Only copy certain fields over the existing object.
        Object.assign(this.games[gameID], {
            characters: game.characters.map((c) => ({ name: c.name, initiative: c.initiative })),
            currentRound: game.currentRound,
            currentCharIndex: game.currentCharIndex
        })
    }
}

exports.Manager = Manager;