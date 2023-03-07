const mongoose = require("mongoose");

//NOTE: Intersections are stored as a string
const eventSchema = new mongoose.Schema({

    event : {
        _id : {
            type: String,
            required: true
        },
        name : {
            type: String,
            required: true
        },
        owner : {
            type: String,
            required: true
        },
        constraint : {
            type: Array,
            required: true
        },
        usersEvents : {
            type: Array,
            required: false
        }
    }
});


const event = mongoose.model("event", eventSchema);
module.exports = event;