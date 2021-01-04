// This is expected to run with CWD set to the app root directory.
process.chdir(__dirname);

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
    mgr.NewGame(req.body.characters)
        .then((gameID) => {
            res.send({ gameId: gameID });
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(400);
        });
    // This is an ajax handler, so redirect is not useful.
})

app.ws('/ws/player/:gameID', (ws, req) => { try { brk.AddPlayerSocket(ws, req.params.gameID); } catch (err) { console.error(err); } });
app.ws('/ws/admin/:gameID', (ws, req) => { try { brk.AddAdminSocket(ws, req.params.gameID); } catch (err) { console.error(err); } });

app.listen(port, () => {
    console.log(`Initiative backend listening at http://localhost:${port}`)
});