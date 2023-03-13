const User = require("../models/userModel");

// route POST /api/users/createUser
async function createUser(req, res) {
    console.log("createUser", req.body)
    console.log("userID:", req.body.userID)
    let existingUser = await User.findOne({userID : req.body.userID})
    console.log("existinguser:", existingUser)
    if (existingUser) {
        let updateRes = await updateUserMeetings(req, res);
        console.log("updatRes:", updateRes)
        res.send({ success: true, user: user })
    }

    if (req.body.userID === undefined || req.body.meetingID === undefined)
        res.send({success : false, "error" : "Invalid user format"})
    let user = new User({
        userID : req.body.userID,
        meetingIDs : [req.body.meetingID]
    })
    console.log(user)
    await user.save()
    .then(() => {
        res.send({ success: true, user: user })
    })
    .catch((e) => {
        console.log(e)
        res.send({ success: false, error: `Could not save user object ${e}`, user: user })
    })
}

// route PUT /api/users/updateUserMeetings
async function updateUserMeetings(req, res) {
    console.log("updateUserMeetings", req.body)
    if (req.body.userID === null || req.body.meetingID === null) {
        return res.send({ success: false, "error" : "Invalid user format"})
    }
    let user = await User.findOne({userID : req.body.userID})
    if (!user)
        return res.status(404).send({ success: false, error: `User ${req.body.userID} does not exist` })
    let meetings = user.toJSON().meetingIDs
    meetings.push(req.body.meetingID)
    console.log("new meetings:", meetings)
    await User.updateOne({
        "userID" : req.body.userID}, {$set : {"meetingIDs" : meetings}})
    .then(() => {
        return res.send({ success: true, user : {userID : user.userID, meetingIDs : meetings}})
    })
    .catch((e) => {
        console.log("updateUserMeetings", e)
        return res.send({ success: false, user : {userID : user.userID, meetingIDs : meetings}})
    })
}

// route GET /api/users/getUserMeetings
async function getUserMeetings(req, res) {
    console.log("getUserMeetings req.body:", req.query)
    if (req.query.userID !== null) {
        let user = await User.findOne({userID : req.query.userID})
        if (!user)
            return res.status(404).send({ success: false, error: `userID ${req.query.userID} does not exist` })
        res.send({ success: true, user: user })
    }
    else {
        res.send({ success: false, error: "Need to specify query user"})
    }
}

module.exports = { createUser, getUserMeetings, updateUserMeetings };
