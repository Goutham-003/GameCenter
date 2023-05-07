const express = require('express');
const app = express();
const bodyparser  = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const Player = require('./models/player');
const ScoreCard = require('./models/scorecard');
const url = `${process.env.MONGO_URL}`
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(error => console.error(error));
  

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    let games = ["simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess"];
    let players = ["player1", "player2","player3"];
     res.render('dashboard',{games:games, players:players});
    });
app.get("/game/:gamename", (req, res) => {
    let gamename = req.params.gamename;
    // res.render('game',{gamename:gamename});
    // res.send("This game is "+gamename);
    res.render(gamename + ".ejs");
    });
app.listen(8080, () => {
    console.log('Example app listening on port 8080!');
});


app.post('/regester', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let displayName = req.body.displayName;
    let player = new Player({
        userName: username,
        password: password,
        displayName: displayName
    });
    player.save().then(() => {
        console.log("Player saved");
        // res.redirect('/');
    }).catch((err) => {
        console.log(err);
        // res.redirect('/');
    });
    let scoreCard = new ScoreCard({
        username: username,
        totalScore: 0,
        gameCard: []
    });
    scoreCard.save().then(() => {
        console.log("Score card saved");
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});


app.post('/player/update', (req, res) => {
    let userName = req.body.userName;
    let gameName = req.body.gameName;
    let score = req.body.score;
    console.log(userName);
    console.log(gameName);
    console.log(score);
    ScoreCard.findOne({username: userName}).then((player) => {
        let gameScore = player.gameScores.find(gs => gs.gameName === gameName);
        console.log(gameScore);
        if (gameScore) {
            // Update the score if it's greater than the high score
            if (score > gameScore.highScore) {
                gameScore.highScore = score;
                player.totalScore += score - gameScore.highScore;
            }
            console.log(player);
        }
        else{
            gameScore = { gameName: gameName, highScore: score };
            player.gameScores.push(gameScore);
            player.totalScore += score;
        }
        player.save().catch((err) => {
              console.log(err);
          });
    }).catch((err) => {
        console.log(err);
        console.log("Player not found");
    });
});