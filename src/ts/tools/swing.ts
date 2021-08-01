import * as beatmap from '../beatmap';
import { median } from '../utils';

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

interface NoteEBPM extends beatmap.note.Note {
    _ebpm: number;
}

interface NoteSlider extends beatmap.note.Note {
    _minSpeed: number;
    _maxSpeed: number;
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
            if (n._cutDirection !== 8 && beatmap.note.checkDirection(currNote, n, 90, false)) {
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

export const calcEBPMBetweenNote = (
    currNote: beatmap.note.Note,
    prevNote: beatmap.note.Note,
    bpm: number
): number => {
    return bpm / ((currNote._time - prevNote._time) * 2);
};

export const getEffectiveBPMNote = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): NoteEBPM[] => {
    let noteEBPM: NoteEBPM[] = [];
    const lastNote: { [key: number]: NoteEBPM } = {};
    const swingNoteArray: { [key: number]: NoteEBPM[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        if (!beatmap.note.isNote(notes[i])) {
            continue;
        }
        const note: NoteEBPM = JSON.parse(JSON.stringify(notes[i]));
        if (lastNote[note._type]) {
            if (next(note, lastNote[note._type], bpm, swingNoteArray[note._type])) {
                note._ebpm = calcEBPMBetweenNote(note, lastNote[note._type], bpm.value);
                noteEBPM.push(note);
                swingNoteArray[note._type] = [];
            }
        }
        lastNote[note._type] = note;
        swingNoteArray[note._type].push(note);
    }
    return noteEBPM;
};

export const getEffectiveBPMSwingNote = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): NoteEBPM[] => {
    let noteEBPM: NoteEBPM[] = [];
    const lastNote: { [key: number]: NoteEBPM } = {};
    const swingNoteArray: { [key: number]: NoteEBPM[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        if (!beatmap.note.isNote(notes[i])) {
            continue;
        }
        const note: NoteEBPM = JSON.parse(JSON.stringify(notes[i]));
        if (lastNote[note._type]) {
            if (next(note, lastNote[note._type], bpm, swingNoteArray[note._type])) {
                note._ebpm = calcEBPMBetweenNote(note, lastNote[note._type], bpm.value);
                noteEBPM.push(note);
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
            }
        } else {
            lastNote[note._type] = note;
        }
        swingNoteArray[note._type].push(note);
    }
    return noteEBPM;
};

export const getMaxEffectiveBPM = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): number => {
    return Math.max(...getEffectiveBPMNote(notes, bpm).map((n) => n._ebpm), 0);
};

export const getMaxEffectiveBPMSwing = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): number => {
    return Math.max(...getEffectiveBPMSwingNote(notes, bpm).map((n) => n._ebpm), 0);
};

export const calcMinSliderSpeed = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): number => {
    return bpm.toRealTime(
        Math.max(
            ...notes.map(
                (n, i) =>
                    (notes[i]._time - notes[Math.max(i - 1, 0)]._time) /
                    (i ? beatmap.note.distance(notes[i], notes[i - 1]) : 1)
            )
        )
    );
};

export const calcMaxSliderSpeed = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): number => {
    return bpm.toRealTime(
        Math.min(
            ...notes
                .map(
                    (n, i) =>
                        (notes[i]._time - notes[Math.max(i - 1, 0)]._time) /
                        (i ? beatmap.note.distance(notes[i], notes[i - 1]) : 1)
                )
                .filter((n) => n !== 0)
        )
    );
};

// FIXME: last swing did not count, pls fix
export const getSliderNote = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): NoteSlider[] => {
    let noteSlider: NoteSlider[] = [];
    const lastNote: { [key: number]: NoteSlider } = {};
    const swingNoteArray: { [key: number]: NoteSlider[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        if (!beatmap.note.isNote(notes[i])) {
            continue;
        }
        const note: NoteSlider = JSON.parse(JSON.stringify(notes[i]));
        note._minSpeed = 0;
        note._maxSpeed = Number.MAX_SAFE_INTEGER;
        if (lastNote[note._type]) {
            if (next(note, lastNote[note._type], bpm, swingNoteArray[note._type])) {
                let minSpeed = calcMinSliderSpeed(swingNoteArray[note._type], bpm);
                let maxSpeed = calcMaxSliderSpeed(swingNoteArray[note._type], bpm);
                if (minSpeed > 0 && maxSpeed !== Infinity) {
                    lastNote[note._type]._minSpeed = minSpeed;
                    lastNote[note._type]._maxSpeed = maxSpeed;
                    noteSlider.push(lastNote[note._type]);
                }
                lastNote[note._type] = note;
                swingNoteArray[note._type] = [];
            }
        } else {
            lastNote[note._type] = note;
        }
        swingNoteArray[note._type].push(note);
    }
    return noteSlider;
};

export const getMinSliderSpeed = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): number => {
    return Math.max(...getSliderNote(notes, bpm).map((n) => n._minSpeed), 0);
};

export const getMaxSliderSpeed = (
    notes: beatmap.note.Note[],
    bpm: beatmap.bpm.BeatPerMinute
): number => {
    const arr = getSliderNote(notes, bpm).map((n) => n._maxSpeed);
    return arr.length ? Math.min(...arr) : 0;
};

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to JavaScript is hard
export const count = (
    notes: beatmap.note.Note[],
    duration: number,
    bpm: beatmap.bpm.BeatPerMinute
): SwingCount => {
    const swingCount: SwingCount = {
        left: new Array(Math.floor(duration + 1)).fill(0),
        right: new Array(Math.floor(duration + 1)).fill(0),
    };
    let lastRed!: beatmap.note.Note;
    let lastBlue!: beatmap.note.Note;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const realTime = bpm.toRealTime(note._time);
        if (note._type === 0) {
            if (lastRed) {
                if (next(note, lastRed, bpm)) {
                    swingCount.left[Math.floor(realTime)]++;
                }
            } else {
                swingCount.left[Math.floor(realTime)]++;
            }
            lastRed = note;
        }
        if (note._type === 1) {
            if (lastBlue) {
                if (next(note, lastBlue, bpm)) {
                    swingCount.right[Math.floor(realTime)]++;
                }
            } else {
                swingCount.right[Math.floor(realTime)]++;
            }
            lastBlue = note;
        }
    }
    return swingCount;
};

export const calcMaxRollingSPS = (swingArray: number[], x: number): number => {
    if (!swingArray.length) {
        return 0;
    }
    if (swingArray.length < x) {
        return swingArray.reduce((a, b) => a + b) / swingArray.length;
    }
    let currentSPS = swingArray.slice(0, x).reduce((a, b) => a + b);
    let maxSPS = currentSPS;
    for (let i = 0; i < swingArray.length - x; i++) {
        currentSPS = currentSPS - swingArray[i] + swingArray[i + x];
        maxSPS = Math.max(maxSPS, currentSPS);
    }
    return maxSPS / x;
};

export const info = (
    mapSetData: beatmap.map.BeatmapSetData,
    bpm: beatmap.bpm.BeatPerMinute
): SwingPerSecondInfo => {
    const interval = 10;
    const spsInfo = {
        red: { overall: 0, peak: 0, median: 0, total: 0 },
        blue: { overall: 0, peak: 0, median: 0, total: 0 },
        total: { overall: 0, peak: 0, median: 0, total: 0 },
    };
    const duration = Math.max(
        bpm.toRealTime(
            beatmap.map.getLastInteractiveTime(mapSetData._data) -
                beatmap.map.getFirstInteractiveTime(mapSetData._data)
        ),
        0
    );
    const mapDuration = Math.max(
        bpm.toRealTime(beatmap.map.getLastInteractiveTime(mapSetData._data)),
        0
    );
    const swing = count(mapSetData._data._notes, mapDuration, bpm);
    const swingTotal = swing.left.map((num, i) => num + swing.right[i]);
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
        const sliceRed = swing.left.slice(sliceStart, sliceStart + maxInterval);
        const sliceBlue = swing.right.slice(sliceStart, sliceStart + maxInterval);
        const sliceTotal = swingTotal.slice(sliceStart, sliceStart + maxInterval);
        swingIntervalRed.push(sliceRed.reduce((a, b) => a + b) / maxInterval);
        swingIntervalBlue.push(sliceBlue.reduce((a, b) => a + b) / maxInterval);
        swingIntervalTotal.push(sliceTotal.reduce((a, b) => a + b) / maxInterval);
    }

    spsInfo.red.total = swing.left.reduce((a, b) => a + b);
    spsInfo.red.overall = swing.left.reduce((a, b) => a + b) / duration;
    spsInfo.red.peak = calcMaxRollingSPS(swing.left, interval);
    spsInfo.red.median = median(swingIntervalRed);
    spsInfo.blue.total = swing.right.reduce((a, b) => a + b);
    spsInfo.blue.overall = swing.right.reduce((a, b) => a + b) / duration;
    spsInfo.blue.peak = calcMaxRollingSPS(swing.right, interval);
    spsInfo.blue.median = median(swingIntervalBlue);
    spsInfo.total.total = spsInfo.red.total + spsInfo.blue.total;
    spsInfo.total.overall = swingTotal.reduce((a, b) => a + b) / duration;
    spsInfo.total.peak = calcMaxRollingSPS(swingTotal, interval);
    spsInfo.total.median = median(swingIntervalTotal);

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
