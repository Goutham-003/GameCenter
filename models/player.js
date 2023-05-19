const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    userName: { type: String, required: true , unique: true},
    password: { type: String, required: true },
    displayName: { type: String, required: true, unique: true},
});


module.exports = mongoose.model("Player", playerSchema);

