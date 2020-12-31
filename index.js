const express = require('express');
const bodyParser = require('body-parser');


const port = 8080

const app = express();

app.use(express.static('static')); // Client content is statically served
app.use(bodyParser.json());

let nextId = 1;
const games = {};

app.post('/create', (req, res) => {
    console.log(req.body)
    const chars = req.body.characters;
    const newGame = {
        id: nextId++,
        created: Date.now(),
        characters: chars.map((c) => { return { name: c.name, initiative: c.initiative } })
    }
    games[newGame.id] = newGame;
    res.send({ gameId: newGame.id });
    // res.redirect(`/game/${newGame.id}`);
})

app.get('/game/:id', (req, res) => {
    if (!req.params.id in games) {
        res.sendStatus(404);
        return;
    }
    res.send(games[req.params.id]);
})

app.listen(port, () => {
    console.log(`Initiative backend listening at http://localhost:${port}`)
});