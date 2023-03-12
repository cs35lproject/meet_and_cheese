const { intersectionFind } = require("../intersectionFind");

async function getTest(req, res) {
   console.log("Called get profile")
   res.send({success: true, events: "here would be the events"})
}

async function postTest(req, res) {
    let intersection = ""
    if (req.body.events !== undefined) {
        let events = req.body.events
        intersection = intersectionFind(events, [[0,Infinity]])
        res.send({success: true, new_intersection: intersection})
    }
    else {
        res.send({success: false})
    }
}

module.exports = { getTest, postTest }