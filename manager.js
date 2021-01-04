const uuid = require('uuid');
const path = require('path');
const Keyv = require('keyv');
const { KeyvFile } = require('keyv-file');

// Manager holds the current state of all games.
// Games are persisted to file using keyv with a TTL of 8 days. Modifying a game resets its TTL.
class Manager {
    constructor() {
        this.store = new Keyv({
            namespace: 'games',
            store: new KeyvFile({
                filename: path.join(process.env.HOME, 'initiative.kv')
            }),
            ttl: 8 * 24 * 3600 * 1000  // 8 days
        })
        this.store.on('error', (err) => console.log('Connection Error', err));
    }

    async NewGame(characters) {
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
        // TODO: Check return of store.set().
        await this.store.set(newGame.id, newGame);
        return newGame.id;
    }

    // Returns the game with the given ID, or undefined if no such game exists.
    async Get(gameID) { return await this.store.get(gameID); }

    async Update(gameID, game) {
        const existingGame = await this.Get(gameID);

        if (!existingGame) {
            // TODO: throw an error?
            return;
        }
        // Only copy certain fields over the existing object.
        Object.assign(existingGame, {
            characters: game.characters.map((c) => ({ name: c.name, initiative: c.initiative })),
            currentRound: game.currentRound,
            currentCharIndex: game.currentCharIndex
        })
        await this.store.set(gameID, existingGame);
    }
}

exports.Manager = Manager;