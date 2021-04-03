/* SWING SCRIPT - swing.js
    determine swing, bomb reset, note position, etc.
    could use better name */

function swingNext(n1, n2) {
    return (
        (swingWindow(n1, n2) && isAboveTH(n1._time - n2._time, tool.swing.maxWindowTol)) ||
        isAboveTH(n1._time - n2._time, tool.swing.maxTol)
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

function swingNoteEnd(n1, n2) {
    // fuck u and ur dot note stack
    if (n1._cutDirection === 8 && n2._cutDirection === 8) {
        return false;
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
function swingWindow(n1, n2) {
    return Math.max(Math.abs(n1._lineIndex - n2._lineIndex), Math.abs(n1._lineLayer - n2._lineLayer)) >= 2;
}

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
    const swing = swingCount(diff._notes, diff._duration);
    const swingTotal = swing.l.map(function (num, i) {
        return num + swing.r[i];
    });
    if (swingTotal.reduce((a, b) => a + b) === 0) {
        return {
            red: { overall: 0, peak: 0, median: 0, total: 0 },
            blue: { overall: 0, peak: 0, median: 0, total: 0 },
            total: { overall: 0, peak: 0, median: 0, total: 0 },
        };
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
    const swingTotalRed = round(swing.l.reduce((a, b) => a + b) / duration, 2);
    const swingTotalRedPeak = calcMaxRollingSPS(swing.l, interval);
    const swingTotalRedMedian = median(swingIntervalRed);
    const swingTotalBlue = round(swing.r.reduce((a, b) => a + b) / duration, 2);
    const swingTotalBluePeak = calcMaxRollingSPS(swing.r, interval);
    const swingTotalBlueMedian = median(swingIntervalBlue);
    const swingTotalOverall = round(swingTotal.reduce((a, b) => a + b) / duration, 2);
    const swingTotalOverallPeak = calcMaxRollingSPS(swingTotal, interval);
    const swingTotalOverallMedian = median(swingIntervalTotal);

    return {
        red: {
            overall: swingTotalRed,
            peak: swingTotalRedPeak,
            median: swingTotalRedMedian,
            total: swing.l.reduce((a, b) => a + b),
        },
        blue: {
            overall: swingTotalBlue,
            peak: swingTotalBluePeak,
            median: swingTotalBlueMedian,
            total: swing.r.reduce((a, b) => a + b),
        },
        total: {
            overall: swingTotalOverall,
            peak: swingTotalOverallPeak,
            median: swingTotalOverallMedian,
            total: swingTotal.reduce((a, b) => a + b),
        },
    };
}
