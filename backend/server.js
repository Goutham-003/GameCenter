require('dotenv').config();

const mongoose = require('mongoose');
const Player = require('../models/player');
const ScoreCard = require('../models/scorecard');
const player = require('../models/player');
const url = `${process.env.MONGO_URL}`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(error => console.error(error));


// module.exports.addUser = (username, password, displayName) => {
//     let player = new Player({
//         userName: username,
//         password: password,
//         displayName: displayName
//     });
//     player.save().then(() => {
//         console.log("Player saved");
//         return 1;
//     }).catch((err) => {
//         throw new Error("Player not found" + err);
//     });
// }
module.exports.addUser = (username, password, displayName) => {
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
  
module.exports.addScoreCard = (username) => {
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

// module.exports.getTopPlayers = () => {
//     let usernames = [];
//     ScoreCard.find().sort({ totalScore: -1 }).then((players) => {
//         // console.log(players);
//         players.forEach((player) => {
//           usernames.append(player.username);
//         });
//         // console.log(usernames);
//       }).catch((err) => {
//         console.error("Error in getting top players usernames:", err);
//       });

//     // Player.find()
//     console.log(usernames);
//     return usernames;
// }
module.exports.getTopPlayers = async () => {
    let usernames = [];
    try {
      let players = await ScoreCard.find().sort({ totalScore: -1 });
      players.forEach((player) => {
        usernames.push(player.username);
      });
      console.log(usernames);
    } catch (err) {
        console.error("Error in getting top players usernames:", err);
        throw err;
    }
    return usernames;
  }
  