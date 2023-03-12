const User = require("../models/userModel");

// route POST /api/users/createUser
async function createUser(req, res) {
    if (req.body.userID === undefined || req.body.meetingIDs === undefined) {
        res.send({success : false, "error" : "Invalid userID"})
    }
    let user = new User({
        userID : userID,
        meetingIDs : req.body.meetingIDs
    })
    res.send({ success: true, user: user })
    await user.save()
    .then(() => {
        res.send({ success: true, user: user })
    })
    .catch((e) => {
        console.log(e)
        res.send({ success: false, error: `Could not save user object ${e}`, user: user })
    })
}

// route GET /api/users/getUserMeetings
async function getUserMeetings(req, res) {
    if (req.query.userID !== null) {
        //res.send({ success: false, error: "Disabled for testing"})
        let user = await User.findOne({userID : req.query.userID})
        if (!user)
            return res.status(404).send({ success: false, error: `userID ${req.query.userID} does not exist` })
        res.send({ success: true, user: user })
    }
    else {
        res.send({ success: false, error: "Need to specify query user"})
    }
}

module.exports = { createUser, getUserMeetings };