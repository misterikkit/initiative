const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const { Broker } = require('./broker');
const { Manager } = require('./manager');

const port = process.env.PORT || 8080

const app = express();
const expressWs = require('express-ws')(app);


app.use(express.static('static')); // Client content is statically served
app.use(bodyParser.json());

const mgr = new Manager();
const brk = new Broker(mgr);

app.post('/create', (req, res) => {
    const gameID = mgr.NewGame(req.body.characters);
    res.send({ gameId: gameID });
    // This is an ajax handler, so redirect is not useful.
    // res.redirect(`/game/${newGame.id}`);
})

app.get('/gamestate/:gameID', (req, res) => {
    if (!mgr.Has(req.params.gameID)) {
        res.sendStatus(404);
        return;
    }
    const game = mgr.Get(req.params.gameID);
    res.setHeader('Cache-Control', 'no-cache');
    res.type('json'); // shorthand for content-type header
    res.send(game);
})

app.ws('/ws/player/:gameID', (ws) => { brk.AddPlayerSocket(ws, req.params.gameID); });
app.ws('/ws/admin/:gameID', (ws) => { brk.AddAdminSocket(ws, req.params.gameID); });

app.listen(port, () => {
    console.log(`Initiative backend listening at http://localhost:${port}`)
});