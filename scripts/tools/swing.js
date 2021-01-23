 /* SWING SCRIPT - swing.js
    determine swing, bomb reset, note position, etc.
    prolly could use better name tbh */

function swingNext(n1, n2) {
    return (maybeWindowed(n1, n2) && aboveTH(n1._time - n2._time, maxWindowTolerance)) || aboveTH(n1._time - n2._time, maxTolerance);
}

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to Javascript is hard
function maybeWindowed(n1, n2) {
    return Math.max(Math.abs(n1._lineIndex - n2._lineIndex), Math.abs(n1._lineLayer - n2._lineLayer)) >= 2;
}

// look at this pepega
function populateSwingArray(diff) {
    let arr = [];
    for (let i = 0, len = Math.floor(diff._duration + 1); i < len; i++) {
        arr.push(0);
    }
    return arr;
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
                if (swingNext(note, lastRed)) {
                    swingCountRed[Math.floor(realTime)] += 1;
                }
            }
            else swingCountRed[Math.floor(realTime)] += 1;
            lastRed = note;
        }
        else if (note._type == 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
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
