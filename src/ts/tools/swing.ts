import * as beatmap from '../beatmap';
import { median, round } from '../utils';

interface SwingCount {
    left: number[];
    right: number[];
}

interface SwingPerSecond {
    overall: number;
    total: number;
    peak: number;
    median: number;
}

interface SwingPerSecondInfo {
    red: SwingPerSecond;
    blue: SwingPerSecond;
    total: SwingPerSecond;
}

interface SwingAnalysis {
    mode: beatmap.characteristic.CharacteristicName;
    difficulty: beatmap.difficulty.DifficultyName;
    sps: number;
}

// Thanks Qwasyx#3000 for improved swing detection
export const next = (
    currNote: beatmap.note.Note,
    prevNote: beatmap.note.Note,
    bpm: beatmap.bpm.BeatPerMinute,
    context?: beatmap.note.Note[]
): boolean => {
    if (
        context &&
        context.length > 0 &&
        bpm.toRealTime(prevNote._time) + 0.005 < bpm.toRealTime(currNote._time) &&
        currNote._cutDirection !== 8
    ) {
        for (const n of context) {
            if (n._cutDirection !== 8 && beatmap.note.checkDirection(currNote, n, 90, true)) {
                return true;
            }
        }
    }
    if (context && context.length > 0) {
        for (const other of context) {
            if (
                Math.max(
                    Math.abs(other._lineIndex - currNote._lineIndex),
                    Math.abs(other._lineLayer - currNote._lineLayer)
                ) < 1
            ) {
                return true;
            }
        }
    }
    return (
        (beatmap.note.isWindow(currNote, prevNote) &&
            bpm.toRealTime(currNote._time - prevNote._time) > 0.08) ||
        bpm.toRealTime(currNote._time - prevNote._time) > 0.07
    );
};

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to JavaScript is hard
export const count = (
    notes: beatmap.note.Note[],
    duration: number,
    bpm: beatmap.bpm.BeatPerMinute
): SwingCount => {
    if (notes.length === 0) {
        return { left: [0], right: [0] };
    }
    let swingCountRed = new Array(Math.floor(duration + 1)).fill(0);
    let swingCountBlue = new Array(Math.floor(duration + 1)).fill(0);
    let lastRed: beatmap.note.Note;
    let lastBlue: beatmap.note.Note;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const realTime = bpm.toRealTime(note._time);
        if (note._type === 0) {
            if (lastRed) {
                if (next(note, lastRed, bpm)) {
                    swingCountRed[Math.floor(realTime)]++;
                }
            } else {
                swingCountRed[Math.floor(realTime)]++;
            }
            lastRed = note;
        }
        if (note._type === 1) {
            if (lastBlue) {
                if (next(note, lastBlue, bpm)) {
                    swingCountBlue[Math.floor(realTime)]++;
                }
            } else {
                swingCountBlue[Math.floor(realTime)]++;
            }
            lastBlue = note;
        }
    }
    return { left: swingCountRed, right: swingCountBlue };
};

export const calcMaxRollingSPS = (swingArray: number[], x: number): number => {
    if (!swingArray.length) {
        return 0;
    }
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
};

export const info = (
    mapSetData: beatmap.map.MapSetData,
    bpm: beatmap.bpm.BeatPerMinute
): SwingPerSecondInfo => {
    const interval = 10;
    const spsInfo = {
        red: { overall: 0, peak: 0, median: 0, total: 0 },
        blue: { overall: 0, peak: 0, median: 0, total: 0 },
        total: { overall: 0, peak: 0, median: 0, total: 0 },
    };
    const duration = bpm.toRealTime(
        beatmap.map.getFirstInteractiveTime(mapSetData._data) -
            beatmap.map.getLastInteractiveTime(mapSetData._data)
    );
    const swing = count(mapSetData._data._notes, duration, bpm);
    const swingTotal = swing.left.map(function (num, i) {
        return num + swing.right[i];
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
        const sliceRed = swing.left.slice(sliceStart, interval);
        const sliceBlue = swing.right.slice(sliceStart, interval);
        const sliceTotal = swingTotal.slice(sliceStart, interval);
        swingIntervalRed.push(sliceRed.reduce((a, b) => a + b) / maxInterval);
        swingIntervalBlue.push(sliceBlue.reduce((a, b) => a + b) / maxInterval);
        swingIntervalTotal.push(sliceTotal.reduce((a, b) => a + b) / maxInterval);
    }

    spsInfo.red.overall = round(swing.left.reduce((a, b) => a + b) / duration, 2);
    spsInfo.red.peak = calcMaxRollingSPS(swing.left, interval);
    spsInfo.red.median = median(swingIntervalRed);
    spsInfo.red.total = swing.left.reduce((a, b) => a + b);
    spsInfo.blue.overall = round(swing.right.reduce((a, b) => a + b) / duration, 2);
    spsInfo.blue.peak = calcMaxRollingSPS(swing.right, interval);
    spsInfo.blue.median = median(swingIntervalBlue);
    spsInfo.blue.total = swing.right.reduce((a, b) => a + b);
    spsInfo.total.overall = round(swingTotal.reduce((a, b) => a + b) / duration, 2);
    spsInfo.total.peak = calcMaxRollingSPS(swingTotal, interval);
    spsInfo.total.median = median(swingIntervalTotal);
    spsInfo.total.total = spsInfo.red.total + spsInfo.blue.total;

    return spsInfo;
};

export const getProgressionMax = (spsArray: SwingAnalysis[], duration: number) => {
    let spsPerc = 0;
    let spsCurr = 0;
    let prevDiff = null;
    for (const diff of spsArray) {
        if (spsCurr > 0 && diff.sps > 0) {
            spsPerc = (1 - spsCurr / diff.sps) * 100;
        }
        spsCurr = diff.sps > 0 ? diff.sps : spsCurr;
        if (spsCurr > (duration < 120 ? 3.2 : 4.2) && spsPerc > 40) {
            return prevDiff;
        }
        prevDiff = diff;
    }
    return false;
};

export const getProgressionMin = (spsArray: SwingAnalysis[], duration: number) => {
    let spsPerc = Number.MAX_SAFE_INTEGER;
    let spsCurr = 0;
    let prevDiff = null;
    for (const diff of spsArray) {
        if (spsCurr > 0 && diff.sps > 0) {
            spsPerc = (1 - spsCurr / diff.sps) * 100;
        }
        spsCurr = diff.sps > 0 ? diff.sps : spsCurr;
        if (spsCurr > (duration < 120 ? 3.2 : 4.2) && spsPerc < 10) {
            return prevDiff;
        }
        prevDiff = diff;
    }
    return false;
};

export const getSPSTotalPercDrop = (spsArray: SwingAnalysis[]) => {
    let highest = 0;
    let lowest = Number.MAX_SAFE_INTEGER;
    spsArray.forEach((diff) => {
        if (diff.sps > 0) {
            highest = Math.max(highest, diff.sps);
            lowest = Math.min(lowest, diff.sps);
        }
    });
    return highest || (highest && lowest) ? (1 - lowest / highest) * 100 : 0;
};

export const getSPSLowest = (spsArray: SwingAnalysis[]) => {
    let lowest = Number.MAX_SAFE_INTEGER;
    spsArray.forEach((diff) => {
        if (diff.sps > 0) {
            lowest = Math.min(lowest, diff.sps);
        }
    });
    return lowest;
};
