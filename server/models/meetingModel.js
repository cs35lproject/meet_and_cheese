const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    meetingID : {
        type: String,
        required: true
    },
    meeting : {
        meetingMemberIDs : {
            type : [String],
            required : true
        },
        intersections : {
            type : [Object],
            required: false
        }
    }
});

const meeting = mongoose.model("meeting", meetingSchema);
module.exports = meeting;