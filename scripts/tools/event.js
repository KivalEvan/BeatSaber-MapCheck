 /* EVENT SCRIPT - event.js
    look after event duh
    TODO: more extensive lighting stats? */

function getEventCount(events) {
    let light = 0;
    let boost = 0;
    let rrotate = 0;
    let rzoom = 0;
    let laser = 0;
    let rot = 0;
    let chroma = 0;
    let ogc = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i]._type >= 0 && events[i]._type < 5) light++;
        else if (events[i]._type === 5) boost++;
        else if (events[i]._type === 8) rrotate++;
        else if (events[i]._type === 9) rzoom++;
        else if (events[i]._type === 12 || events[i]._type === 13) laser++;
        else if (events[i]._type === 14 || events[i]._type === 15) rot++;
        if (events[i]._customData) { // TODO: properly check for chroma
            chroma++;
        }
        if (events[i]._value > 2000000000) {
            ogc++;
        }
    }
    return {light: light, boost: boost, rrotate: rrotate, rzoom: rzoom, laser: laser, rot: rot, chroma: chroma, ogc: ogc};
}

function countEventLight10(events) {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i]._type >= 0 && events[i]._type < 5 && events[i]._value !== 0) {
            count++;
            if (count > 10) break;
        }
    }
    return count;
}