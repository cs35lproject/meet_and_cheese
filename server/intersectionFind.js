//Classic leetcode merge intervals algorithm
//See https://javascript.plainenglish.io/javascript-algorithms-merge-intervals-leetcode-98da240805bc
const merge = intervals => {
    if (intervals.length < 2) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [];
    let previous = intervals[0];
    
    for (let i = 1; i < intervals.length; i += 1) {
      if (previous[1] >= intervals[i][0]) {
        previous = [previous[0], Math.max(previous[1], intervals[i][1])];
      } else {
        result.push(previous);
        previous = intervals[i];
      }
    }
    
    result.push(previous);
    
    return result;
};

function intersectionFind(eventsResource, intersections){

    //eventsResource is an array of events resources
    //See https://developers.google.com/calendar/api/v3/reference/events#resource

    //intersections is a nx2 array of the form [[start, end],.....]

    //Assume evenStarts and eventEnds are all relative to Unix epoch
    //I.e. no time zones etc

    //Assume that all the events are in the relevant search area
    //If not, the algorithm will still work but will be slow
    //I.e. will find intersections that aren't relevant

    //Format the events into a nx2 array of timestamps
    let events = [];
    for (let userEvent of eventsResource){
        events.push([userEvent.start.datetime, userEvent.end.datetime]);
    }

    //Merge intervals
    //Handle the case where some events overlap eachother
    events = merge(events);

    //Find the new available times
    //Simply find the intervals in between the event intervals
    for (let i=0; i<events.length - 1; i++){
        intersections.push([events[i][1], events[i+1][0]]);
    }

    //Merge intersections
    //Handle the case where some intersections overlap eachother
    intersections = merge(intersections);

    return intersections;
}

module.exports = { intersectionFind };