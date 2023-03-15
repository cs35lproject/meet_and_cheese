const User = require("../models/userModel");
const Meeting = require("../models/meetingModel")
const meetingController = require("./meetingController")

// route POST /api/users/createUser
async function createUser(req, res) {
    let existingUser = await User.findOne({userID : req.body.userID})
    if (existingUser) {
        await updateUserMeetings(req, res);
    }

    if (req.body.userID === undefined || req.body.meetingID === undefined)
        res.send({success : false, "error" : "Invalid user format"})
    let user = new User({
        userID : req.body.userID,
        meetingIDs : [req.body.meetingID],
        createdMeetingIDs : [req.body.meetingID]
    })
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
    if (req.body.userID === null || req.body.meetingID === null) {
        return res.send({ success: false, "error" : "Invalid user format"})
    }
    let user = await User.findOne({userID : req.body.userID})
    if (!user)
        return res.status(404).send({ success: false, error: `User ${req.body.userID} does not exist` })
    let meetings = user.toJSON().meetingIDs

    meetings.push(req.body.meetingID)
    await User.updateOne({
        "userID" : req.body.userID}, {$set : {"meetingIDs" : meetings}})
    .then(() => {
        return res.send({ success: true, user : {userID : user.userID, meetingIDs : meetings}})
    })
    .catch((e) => {
        console.log(e)
        return res.send({ success: false, user : {userID : user.userID, meetingIDs : meetings}})
    })
    if (req.body.isCreated) {
        let createdMeetings = user.toJSON().createdMeetingIDs;
        createdMeetings.push(req.body.meetingID);
        await User.updateOne({
            "userID" : req.body.userID}, {$set : {"createdMeetingIDs" : createdMeetings}})
        .then(() => {
            return res.send({ success: true, user : {userID : user.userID, meetingIDs : meetings, createdMeetingIDs : createdMeetings}})
        })
        .catch((e) => {
            console.log(e)
            return res.send({ success: false, user : {userID : user.userID, meetingIDs : meetings, createdMeetingIDs : createdMeetings}})
        })
    }
}

// route GET /api/users/getUserMeetings
async function getUserMeetings(req, res) {
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

// route DELETE /api/users/detachMeeting
async function detachMeeting(req, res) {
    let userID = req.body.userID;
    let meetingID = req.body.meetingID;

    console.log("a")
    if (userID !== null && meetingID !== null) {
        let user = await User.findOne({userID : userID})
        console.log("b")
        let meeting = await Meeting.findOne({meetingID : meetingID})
        console.log("c")
        if (!user || !meeting)
            return res.status(404).send({ success: false, error: `Issue with userID ${userID} or meetingID ${meetingID}` })

        let meetings = user.toJSON().meetingIDs
        let meetings_ = meetings.filter(e => e !== meetingID)
        let created = user.toJSON().createdMeetingIDs
        let created_ = created.filter(e => e !== meetingID)

<<<<<<< HEAD
=======
        let res_ = "";
        console.log(created_)
        console.log(created)
        
>>>>>>> 4540c158 (Finished backend to delete meetings / leave meetings)
        // If the user didn't create the meeting
        if (created_.length === created.length) {
            await meetingController.removeUser(req, res);
        }
        // If the user did create the meeting
        else {
            await meetingController.deleteMeeting(req, res)
        }
<<<<<<< HEAD
=======
        console.log("finished", meeting.toJSON())
>>>>>>> 4540c158 (Finished backend to delete meetings / leave meetings)

        await User.updateMany(
            {"userID" : userID}, 
            [
                {$set : {"meetingIDs" : meetings_}},
                {$set : {"createdMeetingIDs" : created_}}
            ]
        )
        // remove user from meeting if not organizer, else delete meeting
    }
    else {
        res.send({ success: false, error: "Need to specify query user"})
    }
}

module.exports = { createUser, getUserMeetings, updateUserMeetings, detachMeeting };