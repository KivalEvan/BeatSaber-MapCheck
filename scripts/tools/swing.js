/* SWING SCRIPT - swing.js
    determine swing, bomb reset, note position, etc.
    could use better name */

function swingNext(n1, n2) {
    return (
        (maybeWindowed(n1, n2) && isAboveTH(n1._time - n2._time, tool.swing.maxWindowTol)) ||
        isAboveTH(n1._time - n2._time, tool.swing.maxTol)
    );
}

function swingNoteEnd(n1, n2) {
    // fuck u and ur dot note stack
    if (n1._cutDirection === 8 && n2._cutDirection === 8) return false;
    // if end note on right side
    if (n1._lineIndex > n2._lineIndex) {
        // check if end note is arrowed
        if (n1._cutDirection === 5 || n1._cutDirection === 3 || n1._cutDirection === 7) {
            return true;
        }
        // check if end note is dot and start arrow is pointing to it
        if ((n2._cutDirection === 5 || n2._cutDirection === 3 || n2._cutDirection === 7) && n1._cutDirection === 8) {
            return true;
        }
    }
    // if end note on left side
    if (n1._lineIndex < n2._lineIndex) {
        if (n1._cutDirection === 6 || n1._cutDirection === 2 || n1._cutDirection === 4) {
            return true;
        }
        if ((n2._cutDirection === 6 || n2._cutDirection === 2 || n2._cutDirection === 4) && n1._cutDirection === 8) {
            return true;
        }
    }
    // if end note is above
    if (n1._lineLayer > n2._lineLayer) {
        if (n1._cutDirection === 4 || n1._cutDirection === 0 || n1._cutDirection === 5) {
            return true;
        }
        if ((n2._cutDirection === 4 || n2._cutDirection === 0 || n2._cutDirection === 5) && n1._cutDirection === 8) {
            return true;
        }
    }
    // if end note is below
    if (n1._lineLayer < n2._lineLayer) {
        if (n1._cutDirection === 6 || n1._cutDirection === 1 || n1._cutDirection === 7) {
            return true;
        }
        if ((n2._cutDirection === 6 || n2._cutDirection === 1 || n2._cutDirection === 7) && n1._cutDirection === 8) {
            return true;
        }
    }
    return false;
}

function swingNoteDouble(n1, notes, index) {
    for (let i = index, len = notes.length; i < len; i++) {
        if (notes[i]._time < n1._time + 0.01 && notes[i]._type != n1._type) {
            return true;
        } else if (notes[i]._time > n1._time + 0.01) {
            return false;
        }
    }
}

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to Javascript is hard
function maybeWindowed(n1, n2) {
    return Math.max(Math.abs(n1._lineIndex - n2._lineIndex), Math.abs(n1._lineLayer - n2._lineLayer)) >= 2;
}

function swingCount(notes, duration) {
    if (notes.length === 0) return { l: [0], r: [0] };

    let swingCountRed = new Array(Math.floor(duration + 1)).fill(0);
    let swingCountBlue = new Array(Math.floor(duration + 1)).fill(0);
    let lastRed;
    let lastBlue;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const realTime = toRealTime(note._time);
        if (note._type === 0) {
            if (lastRed) {
                if (swingNext(note, lastRed)) {
                    swingCountRed[Math.floor(realTime)] += 1;
                }
            } else swingCountRed[Math.floor(realTime)] += 1;
            lastRed = note;
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    swingCountBlue[Math.floor(realTime)] += 1;
                }
            } else swingCountBlue[Math.floor(realTime)] += 1;
            lastBlue = note;
        }
    }
    return { l: swingCountRed, r: swingCountBlue };
}

function swingGetRange(swingArray, x, y) {
    let array = [];
    for (let i = x, len = x + y; i < len; i++) {
        if (swingArray[i] === undefined) break;
        array.push(swingArray[i]);
    }
    return array;
}

// unused; prolly will be in the future
function calcMaxRollingSPS(swingArray, x) {
    if (swingArray.length === 0) return 0;
    if (swingArray.length < x)
        return Math.round((swingArray.reduce((a, b) => a + b) / swingArray.length) * 10 + Number.EPSILON) / 10;

    let currentSPS = swingArray.slice(0, x).reduce((a, b) => a + b);
    let maxSPS = currentSPS;
    for (let i = 0; i < swingArray.length - x; i++) {
        currentSPS = currentSPS - swingArray[i] + swingArray[i + x];
        maxSPS = Math.max(maxSPS, currentSPS);
    }

    return Math.round((maxSPS / x) * 10 + Number.EPSILON) / 10;
}

function swingPerSecondInfo(diff) {
    const interval = 10;
    const swing = swingCount(diff._notes, diff._duration);
    const swingTotal = swing.l.map(function (num, i) {
        return num + swing.r[i];
    });
    if (swingTotal.reduce((a, b) => a + b) === 0) return 0;
    let swingIntervalTotal = [];

    for (let i = 0, len = Math.ceil(swingTotal.length / interval); i < len; i++) {
        const sliceStart = i * interval;
        let maxInterval = interval;
        if (maxInterval + sliceStart > swingTotal.length) maxInterval = swingTotal.length - sliceStart;
        const sliceTotal = swingGetRange(swingTotal, sliceStart, interval);
        const spsTotal = Math.round((sliceTotal.reduce((a, b) => a + b) / maxInterval) * 10 + Number.EPSILON) / 10;
        swingIntervalTotal.push(spsTotal);
    }

    const duration = diff._duration - getFirstInteractiveTime(diff, map.info._beatsPerMinute);
    const swingTotalOverall = Math.round((swingTotal.reduce((a, b) => a + b) / duration) * 100 + Number.EPSILON) / 100;

    return swingTotalOverall;
}
