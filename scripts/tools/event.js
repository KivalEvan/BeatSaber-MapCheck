/* EVENT SCRIPT - event.js
    look after event duh */

function getEventCount(events) {
    const eventCount = {
        light: {
            backTop: 0,
            ring: 0,
            leftLaser: 0,
            rightLaser: 0,
            center: 0,
        },
        boost: 0,
        rrotate: 0,
        rzoom: 0,
        laser: 0,
        rot: 0,
        chroma: 0,
        ogc: 0,
    };
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i]._type >= 0 && events[i]._type < 5) {
            if (events[i]._type === 0) {
                eventCount.light.backTop++;
            } else if (events[i]._type === 1) {
                eventCount.light.ring++;
            } else if (events[i]._type === 2) {
                eventCount.light.leftLaser++;
            } else if (events[i]._type === 3) {
                eventCount.light.rightLaser++;
            } else if (events[i]._type === 4) {
                eventCount.light.center++;
            }
            if (
                events[i]._customData?._color ||
                events[i]._customData?._lightID ||
                events[i]._customData?._propID ||
                events[i]._customData?._lightGradient
            ) {
                eventCount.chroma++;
            }
        } else if (events[i]._type === 5) {
            eventCount.boost++;
        } else if (events[i]._type === 8) {
            eventCount.rrotate++;
            if (events[i]._customData) {
                // lmao fuck this has a lot
                eventCount.chroma++;
            }
        } else if (events[i]._type === 9) {
            eventCount.rzoom++;
        } else if (events[i]._type === 12 || events[i]._type === 13) {
            eventCount.laser++;
            if (
                events[i]._customData?._lockPosition ||
                events[i]._customData?._preciseSpeed ||
                events[i]._customData?._direction
            ) {
                eventCount.chroma++;
            }
        } else if (events[i]._type === 14 || events[i]._type === 15) {
            eventCount.rot++;
        }
        if (events[i]._value > 2000000000) {
            eventCount.ogc++;
        }
    }
    return eventCount;
}

function countEventLightLess(events) {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i]._type >= 0 && events[i]._type < 5 && events[i]._value !== 0) {
            count++;
            if (count > 10) {
                return count;
            }
        }
    }
    return count;
}
