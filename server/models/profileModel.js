const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({

    profile : {
        // Remember, _id contains UID for profile
        firstName : {
            type: String,
            required: true
        },
        lastName : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true
        },
        calendars : [{
            calendarName : String
        }]
    }
})


const profile = mongoose.model("profile", profileSchema)

module.exports = profile