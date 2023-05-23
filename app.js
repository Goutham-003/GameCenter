const express = require('express');
const bodyparser  = require('body-parser');
const server = require('./backend/server');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { set } = require('mongoose');
const app = express();
const PORT = process.env.PORT || 8080;
const key = process.env.KEY;


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');
app.use(express.static('uploads'));
app.use(express.static('public'));

// app.use( (req, res, next) => {
//     setTimeout(next, 1000);
//     res.render('loading');
//     console.log('preloader');
//     next();
//   });


const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const userName = req.body.userName;
        cb(null, userName+'.jpg');
      }
    })
});   
const sessionStorage = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName : 'GameMaster',
    collectionName: 'sessions',
    ttl: 60 * 60 * 24, // 1 day,
    autoRemove: 'native'
});
app.use(session({
    key: 'user_sid',
    secret: key,
    resave : false,
    saveUninitialized : false,
    store: sessionStorage,
    cookie: {
        expires: 600000000
    }
}));
validate = (req, res, next)=>{
    if(req.session.isAuth === true){
        next();
    }else{
        res.render('home');
    }
}
app.get('/', (req, res) => {
    if(req.session.isAuth === true){
        res.redirect('/dashboard');
    }else{
    res.render('home');
    }
});
app.post('/login', (req, res) => {
    // Handle the login form submission
    const userName = req.body.userName;
    const password = req.body.password;
    // Perform authentication
        if (server.validateLogin(userName, password)) {
            // Set the session variables
            req.session.userName = userName;
            req.session.isAuth = true;
            res.redirect('/dashboard');
        } else {
            res.send('Invalid userName or password');
        }
});

app.get('/dashboard',validate, async (req, res) => {
    let games = ["simon", "snake", "card","dino","flappy"];
     res.render('dashboard',{games:games, userName:req.session.userName});
    });

app.get("/game/:gamename", validate, async (req, res) => {
    try {
      const gamename = req.params.gamename;
      console.log(gamename);
      const highscore = await server.getHighScore(
        req.session.userName,
        gamename
      );
      console.log("app.js " + highscore);   
      res.render(gamename, {userName: req.session.userName, highScore: highscore});
    } catch (err) {
      // Handle the error appropriately
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
app.listen(PORT, () => {
    // console.log('Example app listening on port https://localhost:8080');
    console.log(`Example app listening on port ${PORT}`);
});

app.post('/regester', upload.single("avatar"), async (req, res) => {
    console.log("regester post request");
    let saltRounds = 10;
    let userName = req.body.userName;
    let password = req.body.password;
    let displayName = req.body.displayName;
    let hashedpassword = bcrypt.hashSync(password, 10);
    console.log('Hashed password:', hashedpassword);
    server.createPlayer(userName, password, displayName)
    .then(() => {
        console.log('Player created successfully');
        // Perform additional actions if needed
    })
    .catch((error) => {
        console.error('Error creating player:', error);
        // Handle the error appropriately
    });
    console.log("successfull");
    
    console.log(userName + " " + password + " " + displayName);
        // Use the hasheduserName
    res.redirect('/');
});

app.get('/leaderboard',validate, async(req, res)=>{
    let players = await server.getTopPlayers();
    console.log(players);
    res.render('leaderboard',{players:players, userName:req.session.userName});
});

app.post('/player/update', (req, res) => {
    let userName = req.session.userName;
    let gameName = req.body.gameName;
    let score = req.body.score;
    console.log(userName);
    console.log(gameName);
    console.log(score);
    server.updateScore(userName, gameName, score);
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});