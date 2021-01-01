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
            characters: characters.map((c) => { return { name: c.name, initiative: c.initiative } }),
            currentRound: 1,
            currentCharIndex: 0
        }
        this.games[newGame.id] = newGame;
        return newGame.id;
    }

    Has(gameID) { return (gameID in this.games); }
    Get(gameID) { return this.games[gameID]; }
}

exports.Manager = Manager;