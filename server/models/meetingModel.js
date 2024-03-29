const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    meetingName : {
        type: String,
        default: "Unititled Meeting"
    },
    meetingID : {
        type: String,
        required: true
    },
    organizer : {
        type: String,
        required: false
    },
    meetingMemberIDs : {
        type : [String],
        required : true
    },
    intersections : {
        type : [Object],
        required: false
    }
}, {timestamps : true});

const meeting = mongoose.model("meeting", meetingSchema);
module.exports = meeting;