require('dotenv').config();

const mongoose = require('mongoose');
const Player = require('../models/player');
const ScoreCard = require('../models/scorecard');
const url = `${process.env.MONGO_URL}`;

// connection
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(error => console.error(error));


module.exports.getPlayer = (username) => {
    let player = Player.findOne({userName: username}).then((player) => {
        console.log(player);
        return player;
    }).catch((err) => {
        return new Error("Player not found" + err);
    });
}
// add a new player
module.exports.addPlayer = (username, password, displayName) => {
    this.addUser(username, password, displayName).then(() => {
        this.addScoreCard(username);
    }).catch((err) => {
        console.error("Error saving player:", err);
        throw err; // reject the Promise with the error
        });
}
function addUser(username, password, displayName) {
    let player = new Player({
      userName: username,
      password: password,
      displayName: displayName
    });
    return player.save().then(() => {
        console.log("Player saved");
        return 1;
      }).catch((err) => {
        console.error("Error saving player:", err);
        throw err; // reject the Promise with the error
      });
  }

// get a player scorecard
function addScoreCard (username){
    let scoreCard = new ScoreCard({
        username: username,
        totalScore: 0,
        gameCard: []
    });
    scoreCard.save().then(() => {
        return 1;
    }).catch((err) => {
        return new Error("Score Card Updation failure" + err);
    });
}

// update a player scorecard
module.exports.updateScore = (userName, gameName, score) =>{
    ScoreCard.findOne({username: userName}).then((player) => {
        let gameScore = player.gameScores.find(gs => gs.gameName === gameName);
        if (gameScore) {
            // Update the score if it's greater than the high score
            if (score > gameScore.highScore) {
                gameScore.highScore = score;
                player.totalScore += score - gameScore.highScore;
            }
        }
        else{
            gameScore = { gameName: gameName, highScore: score };
            player.gameScores.push(gameScore);
            player.totalScore += score;
        }
        player.save().catch((err) => {
        return new Error("Player updation failure" + err);
          });
    }).catch((err) => {
        return new Error("Player not found" + err);
    });
    return 1;
}

// get the player's highscore of a particular game
module.exports.getHighScore = (userName, gameName) => {
    ScoreCard.findOne({username: userName}).then((player) => {
        let gameScore = player.gameScores.find(gs => gs.gameName === gameName);
        if (gameScore) {
            return gameScore.highScore;
        }
        else{
            return 0;
        }
    }).catch((err) => {
        new Error("Player not found" + err);
    });

}

// get the players for the leaderboard
module.exports.getTopPlayers = async () => {
    let usernames = [];
    try {
      let players = await ScoreCard.find().sort({ totalScore: -1 });
      players.forEach((player) => {
        usernames.push(player.username);
      });
    } catch (err) {
        console.error("Error in getting top players usernames:", err);
        throw err;
    }
    let displayNames = [];
    for (let i = 0; i < usernames.length; i++) {
        let player = await Player.findOne({userName: usernames[i]});
        displayNames.push(player.displayName);
    }
    return displayNames;
  }


  