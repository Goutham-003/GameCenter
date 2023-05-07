const express = require('express');
const app = express();
const bodyparser  = require('body-parser');
const mongoose = require('mongoose')
const url = `mongodb+srv://shaikriyaz20csm:Riyaz$03_mongodb@cluster0.7rlqko2.mongodb.net/Cluster0`;
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

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




//db.js



mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
        
    })