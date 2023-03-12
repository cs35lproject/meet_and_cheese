const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userID : {
        type: String,
        required: true
    },
    meetingIDs : {
        type : [String],
        required : false
    }
});

const user = mongoose.model("user", userSchema);
module.exports = user;