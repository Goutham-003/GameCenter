const express = require('express');
const app = express();
const bodyparser  = require('body-parser');

app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    let games = ["simon", "Snake", "mind", "guess"];
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