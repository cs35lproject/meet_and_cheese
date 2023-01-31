module.exports = function(events, intersection){
    eventStarts = []
    eventEnds = []
    for (userEvent in events){
        eventStarts.push(userEvent["start"]["datetime"]);
        eventEnds.push(userEvent["end"]["datetime"]);
    }
    eventStarts.sort();
    eventEnds.sort().reverse();
}