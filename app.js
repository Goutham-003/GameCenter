const express = require('express');
const app = express();
const bodyparser  = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const Player = require('./models/player');
const url = `${process.env.MONGO_URL}`
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(error => console.error(error));
  

app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    let games = ["simon", "snake", "mind", "guess"];
     res.render('dashboard',{games:games});
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
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

//db.js