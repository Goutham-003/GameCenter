// require('dotenv').config();

// const express = require('express');
// const Player = require('../models/player');
// const ScoreCard = require('../models/scorecard');
// const bcrypt = require('bcryptjs');
// const url = `${process.env.MONGO_URL}`;
// const key = process.env.KEY;
// const mongoose = require('mongoose');
// connection




// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//     })
//     .then(() => console.log("Connected to MongoDB Atlas"))
//     .catch(error => console.    error(error));



// module.exports.validate = (username, password) => {
//     return this.getPlayer(username)
//         .then((player) => {
//         return new Promise((resolve, reject) => {
//             bcrypt.compare(password, player.password, (err, result) => {
//             if (err) {
//                 console.error(err);
//                 reject(err);
//                 return;
//             }
//             if (result) {
//                 console.log('Password is correct');
//                 return true;
//             } else {
//                 console.log('Password is incorrect');
//                 resolve(false);
//             }
//             });
//         });
//         })
//         .catch((err) => {
//         throw new Error("Player not found" + err);
//         });
//     };
    
//     module.exports.getPlayer = (username) => {
//     return Player.findOne({ userName: username })
//         .then((player) => {
//         console.log(player);
//         return player;
//         })
//         .catch((err) => {
//         throw new Error("Player not found" + err);
//         });
//     };
      
// // module.exports.validate = (username, password) => {
// //     this.getPlayer(username).then((player) => {
// //         bcrypt.compare(password, player.password, (err, result) => {
// //             console.log("Hello");
// //             if (err) {
// //               console.error(err);
// //               return;
// //             }
// //             if (result) {
// //               console.log('Password is correct');
// //               return true;
// //             } else {
// //               console.log('Password is incorrect');
// //               return false;
// //             }
// //           });
// //     }).catch((err) => {
// //         return new Error("Player not found" + err);
// //     });
// // }
// // module.exports.getPlayer = (username) => {
// //     let player = Player.findOne({userName: username}).then((player) => {
// //         console.log(player);
// //         return player;
// //     }).catch((err) => {
// //         return new Error("Player not found" + err);
// //     });
// // }
// // add a new player
// module.exports.createPlayer = async (username, password, displayName) => {
//     await addPlayerCard(username, password, displayName).then(async () => {
//         await addScoreCard(username);
//     }).catch((err) => {
//         console.error("Error saving player:", err);
//         throw err; // reject the Promise with the error
//         });
    
// }
// function addPlayerCard(username, password, displayName) {
//     let player = new Player({
//       userName: username,
//       password: password,
//       displayName: displayName
//     });
//     return player.save().then(() => {
//         console.log("PlayerCard saved");
//         return 1;
//       }).catch((err) => {
//         console.error("Error saving player:", err);
//         throw err; // reject the Promise with the error
//       });
//   }

// // get a player scorecard
// function addScoreCard (username){
//     let scoreCard = new ScoreCard({
//         username: username,
//         totalScore: 0,
//         gameCard: []
//     });
//     scoreCard.save().then(() => {
//         console.log("ScoreCard saved");
//         return 1;
//     }).catch((err) => {
//         return new Error("Score Card Updation failure" + err);
//     });
// }

// // update a player scorecard
// module.exports.updateScore = (userName, gameName, score) =>{
//     ScoreCard.findOne({username: userName}).then((player) => {
//         let gameScore = player.gameScores.find(gs => gs.gameName === gameName);
//         if (gameScore) {
//             // Update the score if it's greater than the high score
//             if (score > gameScore.highScore) {
//                 gameScore.highScore = score;
//                 player.totalScore += score - gameScore.highScore;
//             }
//         }
//         else{
//             gameScore = { gameName: gameName, highScore: score };
//             player.gameScores.push(gameScore);
//             player.totalScore += score;
//         }
//         player.save().catch((err) => {
//         return new Error("Player updation failure" + err);
//           });
//     }).catch((err) => {
//         return new Error("Player not found" + err);
//     });
//     return 1;
// }

// // get the player's highscore of a particular game
// module.exports.getHighScore = (userName, gameName) => {
//     ScoreCard.findOne({username: userName}).then((player) => {
//         let gameScore = player.gameScores.find(gs => gs.gameName === gameName);
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

// // get the players for the leaderboard
// module.exports.getTopPlayers = async () => {
//     let usernames = [];
//     try {
//       let players = await ScoreCard.find().sort({ totalScore: -1 });
//       players.forEach((player) => {
//         usernames.push(player.username);
//       });
//     } catch (err) {
//         console.error("Error in getting top players usernames:", err);
//         throw err;
//     }
//     let displayNames = [];
//     for (let i = 0; i < usernames.length; i++) {
//         let player = await Player.findOne({userName: usernames[i]});
//         displayNames.push(player.displayName);
//     }
//     return displayNames;
//   }


  









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


  





