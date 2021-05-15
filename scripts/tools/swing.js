'use strict';
/* SWING SCRIPT - swing.js
    determine swing, bomb reset, note position, etc.
    could use better name */

// Thanks Qwasyx#3000 for improved swing detection
function swingNext(n1, n2, context = null) {
    if (
        context &&
        context.length > 0 &&
        toRealTime(n2._time) + tool.swing.maxHitTol < toRealTime(n1._time) &&
        n1._cutDirection !== 8
    ) {
        for (const n of context) {
            if (n._cutDirection !== 8 && checkAngle(n1._cutDirection, n._cutDirection, 90, true)) {
                return true;
            }
        }
    }
    if (context && context.length > 0) {
        for (const other of context) {
            if (Math.max(Math.abs(other._lineIndex - n1._lineIndex), Math.abs(other._lineLayer - n1._lineLayer)) < 1) {
                return true;
            }
        }
    }
    return (
        (swingWindow(n1, n2) && isAboveThres(n1._time - n2._time, tool.swing.maxWindowTol)) ||
        isAboveThres(n1._time - n2._time, tool.swing.maxTol)
    );
}

function swingHorizontal(n1, n2) {
    return Math.abs(n1._lineLayer - n2._lineLayer) === 0;
}

function swingVertical(n1, n2) {
    return Math.abs(n1._lineIndex - n2._lineIndex) === 0;
}

function swingDiagonal(n1, n2) {
    return Math.abs(n1._lineIndex - n2._lineIndex) === Math.abs(n1._lineLayer - n2._lineLayer);
}

function swingNoteEnd(n1, n2, cutDir = 8) {
    // fuck u and ur dot note stack
    if (n1._cutDirection === 8 && n2._cutDirection === 8 && cutDir !== 8) {
        // if end note on right side
        if (n1._lineIndex > n2._lineIndex) {
            if (cutDir === 5 || cutDir === 3 || cutDir === 7) {
                return true;
            }
        }
        // if end note on left side
        if (n1._lineIndex < n2._lineIndex) {
            if (cutDir === 6 || cutDir === 2 || cutDir === 4) {
                return true;
            }
        }
        // if end note is above
        if (n1._lineLayer > n2._lineLayer) {
            if (cutDir === 4 || cutDir === 0 || cutDir === 5) {
                return true;
            }
        }
        // if end note is below
        if (n1._lineLayer < n2._lineLayer) {
            if (cutDir === 6 || cutDir === 1 || cutDir === 7) {
                return true;
            }
        }
    }
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

function swingWindow(n1, n2) {
    return Math.max(Math.abs(n1._lineIndex - n2._lineIndex), Math.abs(n1._lineLayer - n2._lineLayer)) >= 2;
}

function swingNoteDouble(n1, notes, index) {
    for (let i = index, len = notes.length; i < len; i++) {
        if (notes[i]._time < n1._time + 0.01 && notes[i]._type !== n1._type) {
            return true;
        }
        if (notes[i]._time > n1._time + 0.01) {
            return false;
        }
    }
}

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to Javascript is hard
function swingCount(notes, duration) {
    if (notes.length === 0) {
        return { l: [0], r: [0] };
    }

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
            } else {
                swingCountRed[Math.floor(realTime)] += 1;
            }
            lastRed = note;
        } else if (note._type === 1) {
            if (lastBlue) {
                if (swingNext(note, lastBlue)) {
                    swingCountBlue[Math.floor(realTime)] += 1;
                }
            } else {
                swingCountBlue[Math.floor(realTime)] += 1;
            }
            lastBlue = note;
        }
    }
    return { l: swingCountRed, r: swingCountBlue };
}

function swingGetRange(swingArray, x, y) {
    const array = [];
    for (let i = x, len = x + y; i < len; i++) {
        if (swingArray[i] === undefined) {
            break;
        }
        array.push(swingArray[i]);
    }
    return array;
}

// unused; prolly will be in the future
function calcMaxRollingSPS(swingArray, x) {
    if (swingArray.length === 0) return 0;
    if (swingArray.length < x) {
        return round(swingArray.reduce((a, b) => a + b) / swingArray.length, 1);
    }

    let currentSPS = swingArray.slice(0, x).reduce((a, b) => a + b);
    let maxSPS = currentSPS;
    for (let i = 0; i < swingArray.length - x; i++) {
        currentSPS = currentSPS - swingArray[i] + swingArray[i + x];
        maxSPS = Math.max(maxSPS, currentSPS);
    }

    return round(maxSPS / x, 1);
}

function swingPerSecondInfo(diff) {
    const interval = 10;
    const spsInfo = {
        red: { overall: 0, peak: 0, median: 0, total: 0 },
        blue: { overall: 0, peak: 0, median: 0, total: 0 },
        total: { overall: 0, peak: 0, median: 0, total: 0 },
    };
    const swing = swingCount(diff._notes, diff._duration);
    const swingTotal = swing.l.map(function (num, i) {
        return num + swing.r[i];
    });
    if (swingTotal.reduce((a, b) => a + b) === 0) {
        return spsInfo;
    }
    const swingIntervalRed = [];
    const swingIntervalBlue = [];
    const swingIntervalTotal = [];

    for (let i = 0, len = Math.ceil(swingTotal.length / interval); i < len; i++) {
        const sliceStart = i * interval;
        let maxInterval = interval;
        if (maxInterval + sliceStart > swingTotal.length) {
            maxInterval = swingTotal.length - sliceStart;
        }
        const sliceRed = swingGetRange(swing.l, sliceStart, interval);
        const sliceBlue = swingGetRange(swing.r, sliceStart, interval);
        const sliceTotal = swingGetRange(swingTotal, sliceStart, interval);
        swingIntervalRed.push(round(sliceRed.reduce((a, b) => a + b) / maxInterval, 1));
        swingIntervalBlue.push(round(sliceBlue.reduce((a, b) => a + b) / maxInterval, 1));
        swingIntervalTotal.push(round(sliceTotal.reduce((a, b) => a + b) / maxInterval, 1));
    }
    const duration = diff._duration - getFirstInteractiveTime(diff, map.info._beatsPerMinute);
    spsInfo.red.overall = round(swing.l.reduce((a, b) => a + b) / duration, 2);
    spsInfo.red.peak = calcMaxRollingSPS(swing.l, interval);
    spsInfo.red.median = median(swingIntervalRed);
    spsInfo.red.total = swing.l.reduce((a, b) => a + b);
    spsInfo.blue.overall = round(swing.r.reduce((a, b) => a + b) / duration, 2);
    spsInfo.blue.peak = calcMaxRollingSPS(swing.r, interval);
    spsInfo.blue.median = median(swingIntervalBlue);
    spsInfo.blue.total = swing.r.reduce((a, b) => a + b);
    spsInfo.total.overall = round(swingTotal.reduce((a, b) => a + b) / duration, 2);
    spsInfo.total.peak = calcMaxRollingSPS(swingTotal, interval);
    spsInfo.total.median = median(swingIntervalTotal);
    spsInfo.total.total = spsInfo.red.total + spsInfo.blue.total;

    return spsInfo;
}
