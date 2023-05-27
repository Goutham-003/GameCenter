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
    storage: multer.memoryStorage()
  });
/**
 * Session storage configuration
 */   
const sessionStorage = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    dbName : 'GameMaster',
    collectionName: 'sessions',
    ttl: 60 * 60 * 24, // 1 day,
    autoRemove: 'native'
});

/**
 * session establishment
 */
app.use(session({
    key: 'user_sid',
    secret: key,
    resave : false,
    saveUninitialized : false,
    store: sessionStorage,
    cookie: {
        expires: 100 * 60 * 60 * 24
    }
}));

/**
 * Middleware to validate session
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @returns 
 */
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

/**
 * post request for login of a new user
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
app.post('/login', async (req, res) => {
    // Handle the login form submission
    const userName = req.body.userName;
    const password = req.body.password;
    // Perform authentication
    let is_valid = await server.validateLogin(userName, password);
    console.log("isvalid " + is_valid);
        if ( is_valid === 1) {
            // Set the session variables
            req.session.userName = userName;
            req.session.isAuth = true;
            res.redirect('/dashboard');
        } else if(is_valid === 0) {
            res.send('Invalid userName or password');
        }
        else
            res.send("User doesn't exist");
});

/**
 * dashboard route for the dashboard page (get request)
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
app.get('/dashboard',validate, async (req, res) => {
    let games = ["simon", "snake", "card","dino","flappy"];
     res.render('dashboard',{games:games, userName:req.session.userName});
    });

/**
 * games route for each game in the dashboard (get request)
 * @param {Request} req
 */
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

/**
 * post request for regestering a new user (post request)
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
app.post('/regester', upload.single("avatar"), async (req, res) => {
    console.log("regester post request");
    console.log(req.body);
    const {userName , password, displayName} = req.body;
    const avatar = req.file;
    const hashedpassword = bcrypt.hashSync(password, 10);
    console.log('Hashed password:', hashedpassword);
    await server.createPlayer(userName, password, displayName, avatar)
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


/**
 * leaderboard route for the leaderboard page (get request)
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
app.get('/leaderboard',validate, async(req, res)=>{
    let players = await server.getTopPlayers();
    console.log(players);
    res.render('leaderboard',{players:players, userName:req.session.userName});
});

/**
 * post request for updating the score of a player
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
app.post('/player/update', (req, res) => {
    let userName = req.session.userName;
    let gameName = req.body.gameName;
    let score = req.body.score;
    console.log(userName);
    console.log(gameName);
    console.log(score);
    server.updateScore(userName, gameName, score);
});

/**
 * logout route for logging out a user (get request)
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

/**
 * profile route for the profile page (get request)
 * @param {Request} req
 * @param {Response} res
 * @returns
 * 
 */
app.get('/profile', async (req, res)=>{
    let player = await server.getPlayer(req.session.userName);
    console.log(player);
    let scoreCard = await server.getScoreCard(req.session.userName);
    res.render('profile',{playerName:player.displayName, scoreCard:scoreCard, userName:req.session.userName});
})

/**
 * get request route to get the avatar of a player
 * @param {Request} req
 * @param {Response} res
 * @returns
 *  
*/
app.get('/avatar/:id', async (req, res) => {
    try {
        console.log(req.params.id);
    //   const player = await Player.findById(req.params.id);
        const {downloadStream, contentType} = await server.getAvatar(req.params.id);
        res.set('Content-Type', contentType);
        downloadStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Avatar not found' });
    }
  });

/**
 * post request for changing the profile of a player
 * @param {Request} req
 * @param {Response} res
 * @returns
 * 
*/
app.post('/profile/change', upload.single("avatar"), async (req, res) => {
    const {displayName, newPassword} = req.body;
    const avatar = req.file;
    console.log(displayName, newPassword, avatar);
    console.log(req.body);
    const hashedpassword = bcrypt.hashSync(newPassword, 10);
    console.log("regester post request");
    console.log('Hashed password:', hashedpassword);
    await server.updatePlayer(req.session.userName, displayName, hashedpassword, avatar);
    res.redirect('/profile');
});


/**
 * Server listening on port 8080
 * @param {Number} PORT
 * @returns
 */
app.listen(PORT, () => {
    // console.log('Example app listening on port https://localhost:8080');
    console.log(`Example app listening on port ${PORT}`);
});