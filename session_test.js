// const express = require('express');
// const bodyparser  = require('body-parser');
// const server = require('./backend/server');
// const session = require('express-session');
// const bcrypt = require('bcryptjs');
// const multer = require('multer');
// const MongoStore = require('connect-mongo');
// const app = express();
// const PORT = process.env.PORT || 8080;
// const key = process.env.KEY;

// const sessionStorage = MongoStore.create({
//     mongoUrl: process.env.MONGO_URL,
//     dbName : 'Sessions',
//     collectionName: 'sessions',
//     ttl: 60 * 60 * 24, // 1 day,
//     autoRemove: 'native'
// });

// const upload = multer({
//     storage: multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//       },
//       filename: (req, file, cb) => {
//         const userName = req.body.userName;
//         cb(null, userName+'.jpg');
//       }
//     })
//   });
// app.use(bodyparser.urlencoded({extended: true}));
// app.use(bodyparser.json());
// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use(session({
//     name: 'GameMaster',
//     secret: key,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStorage,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
// }))
// app.use((req, res, next) => {
//     if(req.session.isAuth != true)
//         res.render('home');
//     else
//         next();
// });
// app.get('/', (req, res) => {
//     res.render('home');
// });
// app.post('/login', (req, res) => {
//     const userName = req.body.userName;
//     const password = req.body.password;
//     // Perform authentication
//     if (server.validate(userName, password)) {
//         req.session.userName = userName;
//         req.session.isAuth = true;
//         console.log('Valid userName and password' + req.sessionID);
//         res.redirect('/dashboard');
//     } else {
//         console.log('Invalid userName or password');
//         res.redirect('/');
//     }
// });

// app.get('/dashboard', async (req, res) => {
//     let games = ["simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess","simon", "snake", "mind", "guess"];
//     let players = await server.getTopPlayers();
//      res.render('dashboard',{games:games});
//     });


// app.get("/game/:gamename", (req, res) => {
//     let gamename = req.params.gamename;
//     let highscore = server.getHighScore(req.session.userName,gamename);
//     res.render(gamename + ".ejs", {userName: req.session.userName, highScore:highscore});
//     });
    
// app.listen(PORT, () => {
//     // console.log('Example app listening on port https://localhost:8080');
//     console.log(`Example app listening on port ${PORT}`);
// });

// app.post('/regester', upload.single("avatar"), async (req, res) => {
//     let saltRounds = 10;
//     let userName = req.body.userName;
//     let password = req.body.password;
//     let displayName = req.body.displayName;
//     bcrypt.hash(password, saltRounds, (err, hashedpassword) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log('Hashed password:', hashedpassword);
//         server.addPlayer(userName, hashedpassword, displayName).then((result) => {
//             console.log(result);
//             res.redirect('/dasboard');
//         }).catch((error) => {
//             console.log(error);
//             res.render('home');
//         });
//     });
//     console.log(userName + " " + password + " " + displayName);
//         // Use the hasheduserName
//     res.render('home');
// });

// app.get('/leaderboard',async(req, res)=>{
//     let players = await server.getTopPlayers();
//     console.log(players);
//     res.render('leaderboard',{players:players});
// });

// app.post('/player/update', (req, res) => {
//     let userName = req.body.userName;
//     let gameName = req.body.gameName;
//     let score = req.body.score;
//     console.log(userName);
//     console.log(gameName);
//     console.log(score);
//     server.updateScore(userName, gameName, score);
//     res.render('/');
// });
const bcrypt = require('bcryptjs');

const plaintextPassword = 'password';
const bcryptHash = '$2a$10$6qpmMig8eCgL.tfX1M.a.eYCdKdtjo1I8rBzyPA.dAGrcISRYV.46';

let hashedPassword = bcrypt.hashSync(plaintextPassword, 10);
console.log(hashedPassword);


bcrypt.compare(plaintextPassword, bcryptHash, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

  if (result) {
    console.log('Password matches!');
  } else {
    console.log('Password does not match!');
  }
});
