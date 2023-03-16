const crypto = require('crypto');
const Meeting = require("../models/meetingModel");

// route GET /api/users/searchUser
async function searchMeetings(req, res) {
    // create a case insensitive regex with the search query
    console.log("searching meetings");

    const regex = new RegExp(req.query.query, "i");

    await Meeting.find({meetingName : regex})
    .then(meetings => res.send({success : true, meetings : meetings}))
    .catch(err => {
        console.log(err);
        res.send({success : false, error : err});
    });
}

// route PUT /api/meeting/updateMeeting
async function updateMeeting(req, res) {
    if (req.body.userID === undefined || req.body.availability === undefined || req.body.meetingID === undefined || req.body.meetingMemberIDs === undefined) {
        return res.send({success : false, "error" : "Invalid meeting format"})
    }
    let meeting = await Meeting.findOne({meetingID : req.body.meetingID})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${req.body.meetingID} does not exist` })
    meeting = meeting.toJSON()
    let members = meeting.meetingMemberIDs
    members.push(req.body.userID)
    let availabilities = meeting.intersections
    Array.prototype.push.apply(availabilities, req.body.availability)

    await Meeting.updateMany({
        "meetingID" : req.body.meetingID}, 
        [
            {$set : {"intersections" : availabilities}},
            {$set : {"meetingMemberIDs" : members}}
        ]
    )
    .then(() => {
        return res.send({ success: true, meeting: meeting });
    })
    .catch((e) => {
        console.log(e)
        return res.send({ success: false, meeting: meeting });
    })
}

// route POST /api/meeting/createMeeting
async function createMeeting(req, res) {
    if (req.body.userID === undefined || req.body.availability === undefined) {
        return res.send({success : false, error : "Invalid meeting format"})
    }
    let meetingID = crypto.randomBytes(8).toString('hex')
    let meeting = new Meeting({
        meetingID : meetingID,
        organizer : req.body.userID,
        meetingMemberIDs : [req.body.userID],
        intersections : req.body.availability,
    })
    await meeting.save()
    .then(() => {
        res.send({ success: true, meeting: meeting })
    })
    .catch((e) => {
        console.log(e)
        res.send({ success: false, error: `Could not save meeting object ${e}`, meeting: meeting })
    })
}

// route GET /api/meeting/getMeeting
async function getMeeting(req, res) {
    let meetingID = req.query.id || req.body.meetingID
    if (meetingID !== null) {
        let meeting = await Meeting.findOne({meetingID : meetingID})
        if (!meeting) {
            return res.status(404).send({ success: false, error: `Meeting ${userID} does not exist` })
        }
        return res.send({ success: true, meeting: meeting })
    }
    else {
        return res.send({ success: false, error: "Need to specify query id"})
    }
}

module.exports = { createMeeting, getMeeting, updateMeeting, searchMeetings };