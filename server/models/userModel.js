const mongoose = require("mongoose");

//NOTE: Events are stored as a string
const userSchema = new mongoose.Schema({

    user : {
        // Remember, _id contains UID for profile
        // _id must be accessible from within profile object
        _id : {
            type: String,
            required: true
        },
        name : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true
        },
        events : {
            type: Object,
            required: false
        }
    }
});

const user = mongoose.model("user", userSchema);
module.exports = user;