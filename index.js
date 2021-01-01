const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');


const port = process.env.PORT || 8080

const app = express();

app.use(express.static('static')); // Client content is statically served
app.use(bodyParser.json());

const games = {};

app.post('/create', (req, res) => {
    console.log(req.body)
    const chars = req.body.characters;
    const newGame = {
        id: uuid.v4(),
        created: Date.now(),
        characters: chars.map((c) => { return { name: c.name, initiative: c.initiative } })
    }
    games[newGame.id] = newGame;
    res.send({ gameId: newGame.id });
    // res.redirect(`/game/${newGame.id}`);
})

app.get('/gamestate/:id', (req, res) => {
    if (!req.params.id in games) {
        res.sendStatus(404);
        return;
    }
    const game = games[req.params.id];
    res.setHeader('Cache-Control', 'no-cache');
    res.type('json'); // shorthand for content-type header
    res.send(game);
})

app.listen(port, () => {
    console.log(`Initiative backend listening at http://localhost:${port}`)
});