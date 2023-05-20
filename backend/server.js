require('dotenv').config();

const mongoose = require('mongoose');
const Player = require('../models/player');
const ScoreCard = require('../models/scorecard');
const url = `${process.env.MONGO_URL}`;
const bcrypt = require('bcryptjs');


// connection
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(error => console.error(error));


async function getPlayer(username) {
    try {
        const player = await Player.findOne({ userName: username });
        return player; // Return the player document
    } catch (err) {
        throw new Error("Player not found" + err); // Throw an error to be caught by the caller
    }
    }
      

module.exports.validateLogin = async (username, password) =>{
    getPlayer(username)
    .then((player) => {
        if(player == null){
            return -1;
        }
        bcrypt.compare(password, player.password).then((result) => {
            if(result){
                return 1;
            }
            else{
                return 0;
            }
          }
        );
    })
    .catch((err) => {
        console.error("Error in validating login:", err);
        throw err;
    });

}
// add a new player
module.exports.createPlayer = (username, password, displayName) => {
    const hashedpassword = bcrypt.hashSync(password, 10);
    return addPlayerCard(username, hashedpassword, displayName).then(() => {
       return addScoreCard(username);
    }).catch((err) => {
        console.error("Error saving player:", err);
        throw err; // reject the Promise with the error
        });
}
function addPlayerCard(username, password, displayName) {
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
                player.totalScore += score - gameScore.highScore;
                gameScore.highScore = score;
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
// module.exports.getHighScore = async (userName, gameName) => {
//     await ScoreCard.findOne({username: userName}).then((player) => {
//         let gameScore = player.gameScores.find(gs => gs.gameName === gameName);
//         console.log(gameScore);
//         if (gameScore) {
//             return gameScore.highScore;
//         }
//         else{
//             return 0;
//         }
//     }).catch((err) => {
//         new Error("Player not found" + err);
//     });

// }

module.exports.getHighScore = async (userName, gameName) => {
    try {
      const player = await ScoreCard.findOne({ username: userName });
      if (player) {
        const gameScore = player.gameScores.find((gs) => gs.gameName === gameName);
        console.log(gameScore);
        if (gameScore) {
          return gameScore.highScore;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } catch (err) {
      throw new Error("Player not found" + err);
    }
  };

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


  





