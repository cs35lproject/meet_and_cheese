const crypto = require('crypto');
const Meeting = require("../models/meetingModel");
const { intersectionFind } = require("../intersectionFind");

// route POST /api/events/createMeeting
async function createMeeting(req, res) {
    /*
    using md5sum = crypto.createHash('md5'), create unique hash based on name of each calendar in req.body.calendarNames. This way accounts are still based on what gmail account the user signs in with (since each gmail would have different calendar)
    */

    if (req.body._id === undefined || req.body.events === undefined) {
        res.send({success : false, "error" : "Invalid meeting format"})
    }

    let events = req.body.events
    let intersection = intersectionFind(events, [[0,Infinity]])
    const meetingID = crypto.randomBytes(5).toString('hex')

    let meeting = new Meeting({
        meetingID : meetingID,
        meeting : {
            meetingMemberIDs : [req.body._id],
            intersections : intersection,
        }
    })
    //console.log("meeting:", meeting)
    console.log("createMeeting SENDING BACK MEETING")
    res.send({ success: true, meeting: meeting })
    // await meeting.save()
    // .then(() => {
    //     res.send({ success: true, meeting: meeting })
    // })
    // .catch((e) => {
    //     console.log(e)
    //     res.send({ success: false, error: `Could not save meeting object ${e}`, meeting: meeting })
    // })
}

async function getMeeting(req, res) {
    if (req.query.id !== null) {
        console.log("Called getMeeting from backend, looking for id:", req.query.id)
        res.send({ success: false, error: "Disabled for testing"})
        let meeting = await Meeting.findOne({meetingID : req.query.id})
        if (!meeting)
            return res.status(404).send({ success: false, error: `Meeting ${meetingID} does not exist` })
        return res.send({ success: true, meeting: meeting })
    }
    else {
        res.send({ success: false, error: "Need to specify query id"})
    }
}

module.exports = { createMeeting, getMeeting };