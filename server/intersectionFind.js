//Classic leetcode merge intervals algorithm
//See https://javascript.plainenglish.io/javascript-algorithms-merge-intervals-leetcode-98da240805bc
const union = intervals => {
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

//Find intersection of two arrays of time intervals
//Can be used to filter events before running intersection find 
//E.g. events = intersection(events, filter)
//Courtesy of ChatGPT
const intersection = (intervals1, intervals2) => {
    intervals1.sort((a, b) => a[0] - b[0]);
    intervals2.sort((a, b) => a[0] - b[0]);
    
    const intersection = [];
    let i = 0, j = 0;
  
    while (i < intervals1.length && j < intervals2.length) {
      const [start1, end1] = intervals1[i];
      const [start2, end2] = intervals2[j];
      
      const intersectionStart = Math.max(start1, start2);
      const intersectionEnd = Math.min(end1, end2);
  
      if (intersectionStart <= intersectionEnd) {
        intersection.push([intersectionStart, intersectionEnd]);
      }
      
      if (end1 < end2) {
        i++;
      } else {
        j++;
      }
    }
      return intersection;
  }

function intersectionFind(events, intersections){

    //events is an nx2 array of the form [[start, end],.....]
    //intersections is an nx2 array of the form [[start, end],.....]

    //Assume evenStarts and eventEnds are all relative to Unix epoch
    //I.e. no time zones etc

    //Assume that all the events are in the relevant search area
    //If not, the algorithm will still work but will be slow
    //I.e. will find intersections that aren't relevant

    //Merge intervals
    //Handle the case where some events overlap eachother
    events = union(events);

    //Find the new available times
    //Simply find the intervals in between the event intervals
    let myintersections = []
    for (let i=0; i<events.length - 1; i++){
        myintersections.push([events[i][1], events[i+1][0]]);
    }

    //Intersect intersections
    //Find the intersection between current and previous free times
    intersections = intersection(intersections, myintersections);

    //Merge intersections
    //Handle the case where some intersections overlap eachother
    intersections = union(intersections);

    return intersections;
}

module.exports = { intersection, intersectionFind };