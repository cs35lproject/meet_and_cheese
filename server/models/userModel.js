const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userID : {
        type: String,
        required: true
    },
    meetingIDs : {
        type : [String],
        required : false
    },

}, {timestamps : true});

const user = mongoose.model("user", userSchema);
module.exports = user;