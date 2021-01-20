// the more i look at this the more pepega it becomes
function checkHotStart(notes, obstacles, bpm) {
    if (getFirstInteractiveTime(notes, obstacles, bpm) < 1.5) return true;
    return false;
}

function getHalfJumpDuration(bpm, njs, offset) {
    const maxHalfJump = 18;
    
    const noteJumpMovementSpeed = (njs * bpm) / bpm;
    const num = 60 / bpm;
    let hjd = 4;
    while (noteJumpMovementSpeed * num * hjd > maxHalfJump) {
        hjd /= 2;
    }
    hjd += offset;
    if (hjd < 1) {
        hjd = 1;
    }

    return hjd;
}

function getJumpDistance(bpm, njs, offset) {
    return njs * (60 / bpm) * getHalfJumpDuration(bpm, njs, offset) * 2;
}

function findOutStartNote(notes, bpm) {
    if (!notes.length > 0) return '';
    if (notes[0]._time < 0)
        return `${notes[0]._time} (${round(60 / bpm * notes[0]._time, 2)}s)`;
    return '';
}

function findOutEndNote(notes, bpm) {
    if (!notes.length > 0) return '';
    let endBeat = songDuration * bpm / 60;
    if (notes[notes.length - 1]._time > endBeat)
        return `${notes[notes.length - 1]._time} (${round(60 / bpm * notes[notes.length - 1]._time, 2)}s)`;
    return '';
}

function findOutStartObstacle(obstacles, bpm) {
    if (!obstacles.length > 0) return '';
    if (obstacles[0]._time < 0)
        return `${obstacles[0]._time} (${round(60 / bpm * obstacles[0]._time, 2)}s)`;
    return '';
}

function findOutEndObstacle(obstacles, bpm) {
    if (!obstacles.length > 0) return '';
    let endBeat = songDuration * bpm / 60;
    if (obstacles[obstacles.length - 1]._time > endBeat)
        return `${obstacles[obstacles.length - 1]._time} (${round(60 / bpm * obstacles[obstacles.length - 1]._time, 2)}s)`;
    return '';
}

function findOutStartEvent(events, bpm) {
    if (!events.length > 0) return '';
    if (events[0]._time < 0)
        return `${events[0]._time} (${round(60 / bpm * events[0]._time, 2)}s)`;
    return '';
}

function findOutEndEvent(events, bpm) {
    if (!events.length > 0) return '';
    let endBeat = songDuration * bpm / 60;
    if (events[events.length - 1]._time > endBeat)
        return `Event(s) beyond end time: ${events[events.length - 1]._time} (${round(60 / bpm * events[events.length - 1]._time, 2)}s)`;
    return '';
}

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to Javascript is hard
function maybeWindowed(n1, n2) {
    return Math.max(Math.abs(n1._lineIndex - n2._lineIndex), Math.abs(n1._lineLayer - n2._lineLayer)) >= 2;
}

// look at this pepega
function populateSwingArray(diff) {
    let array = [];
    for (let i = 0, len = Math.floor(diff._duration + 1); i < len; i++) {
        array.push(0);
    }
    return array;
}

function swingCount(diff) {
    if (diff._notes.length == 0) return {swingL: [0], swingR:[0]};
    const notes = diff._notes;
    let swingCountRed = populateSwingArray(diff);
    let swingCountBlue = populateSwingArray(diff);
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const realTime = toRealTime(note._time);
        if (note._type == 0) {
            if (lastRed) {
                if ((maybeWindowed(note, lastRed) && tolMin(note, lastRed, maxWindowTolerance)) || tolMin(note, lastRed, maxTolerance)) {
                    swingCountRed[Math.floor(realTime)] += 1;
                }
            }
            else swingCountRed[Math.floor(realTime)] += 1;
            lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if ((maybeWindowed(note, lastBlue) && tolMin(note, lastBlue, maxWindowTolerance)) || tolMin(note, lastBlue, maxTolerance)) {
                    swingCountBlue[Math.floor(realTime)] += 1;
                }
            }
            else swingCountBlue[Math.floor(realTime)] += 1;
            lastBlue = note;
        }
    }
    return {swingL: swingCountRed, swingR: swingCountBlue};
}

function swingCountTotal(swingLR) {
    let array = [];
    for (let i = 0, len = swingLR.swingL.length; i < len; i++) {
        array.push(swingLR.swingL[i] + swingLR.swingR[i]);
    }
    return array;
}

function swingGetRange(swingArray, x, y) {
    let array = [];
    for (let i = x, len = x + y; i < len; i++) {
        if (swingArray[i] == undefined) break;
        array.push(swingArray[i]);
    }
    return array;
}

function calcMaxRollingSPS(swingArray, x) {
    if (swingArray.length == 0) return 0;
    if (swingArray.length < x) return Math.round((swingArray.reduce((a, b) => a + b) / swingArray.length) * 10 + Number.EPSILON) / 10;
    let currentSPS = swingArray.slice(0, x).reduce((a, b) => a + b);
    let maxSPS = currentSPS;
    for (let i = 0; i < swingArray.length - x; i++) {
        currentSPS = currentSPS - swingArray[i] + swingArray[i + x];
        maxSPS = Math.max(maxSPS, currentSPS);
    }
    return Math.round(maxSPS / x * 10 + Number.EPSILON) / 10;
}

function swingPerSecondInfo(diff) {
    const interval = 10;
    const swingLR = swingCount(diff);
    const swingTotal = swingCountTotal(swingLR);
    // let swingIntervalRed = [];
    // let swingIntervalBlue = [];
    let swingIntervalTotal = [];
    sliceStart = 0;
    for (let i = 0, len = Math.ceil(swingTotal.length / interval); i < len; i++) {
        const sliceStart = i * interval;
        let maxInterval = interval;
        if (maxInterval + sliceStart > swingTotal.length) maxInterval = swingTotal.length - sliceStart;
        const sliceTotal = swingGetRange(swingTotal, sliceStart, interval);
        // const sliceRed = swingGetRange(swingLR.swingL, sliceStart, interval);
        // const sliceBlue = swingGetRange(swingLR.swingR, sliceStart, interval);
        const spsTotal = Math.round((sliceTotal.reduce((a, b) => a + b) / maxInterval) * 10 + Number.EPSILON) / 10;
        // const spsRed = Math.round((sliceRed.reduce((a, b) => a + b) / maxInterval) * 10 + Number.EPSILON) / 10;
        // const spsBlue = Math.round((sliceBlue.reduce((a, b) => a + b) / maxInterval) * 10 + Number.EPSILON) / 10;
        // console.log(`${toMMSS(sliceStart)} to ${toMMSS(sliceStart + maxInterval - 1)}: R(${spsRed.toFixed(1)})|B(${spsBlue.toFixed(1)})|T(${spsTotal.toFixed(1)})`)
        swingIntervalTotal.push(spsTotal);
        // swingIntervalRed.push(spsRed);
        // swingIntervalBlue.push(spsBlue);
    }
    const duration = getLastInteractiveTime(diff._notes, diff._obstacles, mapInfo._beatsPerMinute) - getFirstInteractiveTime(diff._notes, diff._obstacles, mapInfo._beatsPerMinute);
    // const swingTotalRed = Math.round((swingLR.swingL.reduce((a, b) => a + b) / duration) * 100 + Number.EPSILON) / 100;
    // const swingTotalRedPeak = calcMaxRollingSPS(swingLR.swingL, interval);
    // const swingTotalBlue = Math.round((swingLR.swingR.reduce((a, b) => a + b) / duration) * 100 + Number.EPSILON) / 100;
    // const swingTotalBluePeak = calcMaxRollingSPS(swingLR.swingR, interval);
    const swingTotalOverall = Math.round((swingTotal.reduce((a, b) => a + b) / duration) * 100 + Number.EPSILON) / 100;
    // const swingTotalOverallPeak = calcMaxRollingSPS(swingTotal, interval);
    return swingTotalOverall;
    // console.log(swingTotalOverall, swingTotalRed, swingTotalBlue);
}

function calcNPS(nc) {
    return nc / songDuration;
}

function calcNPSMapped(nc, dur) {
    if (!dur) return 0;
    return nc / dur;
}

// unlike map duration, this starts from the first interactive object
// had to be done, thx Uninstaller
function getFirstInteractiveTime(notes, obstacles, bpm) {
    let firstNoteTime = Number.MAX_VALUE;
    if (notes.length > 0) firstNoteTime = notes[0]._time / bpm * 60;
    const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(obstacles, bpm);
    return Math.min(firstNoteTime, firstInteractiveObstacleTime);
}

function getLastInteractiveTime(notes, obstacles, bpm) {
    let lastNoteTime = 0;
    if (notes.length > 0) lastNoteTime = notes[notes.length - 1]._time / bpm * 60;
    const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(obstacles, bpm);
    return Math.max(lastNoteTime, lastInteractiveObstacleTime);
}

function findFirstInteractiveObstacleTime(obstacles, bpm) {
    for (let i = 0, len = obstacles.length; i < len; i++)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            return obstacles[i]._time / bpm * 60;
    return Number.MAX_VALUE;
}

function findLastInteractiveObstacleTime(obstacles, bpm) {
    let obstacleEnd = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        if (obstacles[i]._width >= 2 || obstacles[i]._lineIndex == 1 || obstacles[i]._lineIndex == 2)
            obstacleEnd = Math.max(obstacleEnd, (obstacles[i]._time + obstacles[i]._duration) / bpm * 60);
    return obstacleEnd;
}
