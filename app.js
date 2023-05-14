const express = require('express');
const app = express();
const bodyparser  = require('body-parser');
const server = require('./backend/server');
const PORT = process.env.PORT || 8080;
const session = require('express-session');
const key = process.env.KEY;
app.use(session({
    secret: key,
    resave : false,
    saveUninitialized : false
}));

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware for checking if the user is logged in
const requireLogin = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  };

app.post('/validate', (req, res) => {
// Handle the login form submission
const username = req.body.username;
const password = req.body.password;

// Perform authentication
if (username === 'admin' && password === 'password') {
    req.session.user = username;
    res.redirect('/dashboard');
} else {
    res.send('Invalid username or password');
}
});

app.get('/dashboard', async (req, res) => {
    let games = ["simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess"];
    let players = await server.getTopPlayers();
    console.log(players);
     res.render('dashboard',{games:games, players:players});
    });
app.get('/', (req, res) => {
    res.render('login');
});
app.get("/game/:gamename", (req, res) => {
    let gamename = req.params.gamename;
    let highscore = server.getHighScore(req.session.username,gamename);
    console.log()
    res.render(gamename + ".ejs", {userName: req.session.username, highScore:highscore});
    });
    
app.listen(PORT, () => {
    console.log('Example app listening on port 8080!');
});

app.post('/regester', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let displayName = req.body.displayName;
    server.addUser(username, password, displayName);
    server.addScoreCard(username);
    render('/dashboard');
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