const express = require('express');
const app = express();
const bodyparser  = require('body-parser');
const server = require('./backend/server');

  

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', async (req, res) => {
    let games = ["simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess"];
    let players = await server.getTopPlayers();
    console.log(players);
     res.render('dashboard',{games:games, players:players});
    });
app.get("/game/:gamename", (req, res) => {
    let gamename = req.params.gamename;
    res.render(gamename + ".ejs");
    });
    
app.listen(8080, () => {
    console.log('Example app listening on port 8080!');
});

app.post('/regester', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let displayName = req.body.displayName;
    server.addUser(username, password, displayName);
    server.addScoreCard(username);
    res.render('/');
});


app.post('/player/update', (req, res) => {
    let userName = req.body.userName;
    let gameName = req.body.gameName;
    let score = req.body.score;
    console.log(userName);
    console.log(gameName);
    console.log(score);
    server.updateScore(userName, gameName, score);
    res.render('/');
});