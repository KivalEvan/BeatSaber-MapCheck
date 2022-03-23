import { BeatPerMinute } from '../shared/bpm';
import { deepCopy, median } from '../../utils';
import { ISwingAnalysis, ISwingCount } from '../../types/beatmap/analyser/swing';
import { ColorNote } from '../v3/colorNote';
import { DifficultyData } from '../v3/difficulty';

// Thanks Qwasyx#3000 for improved swing detection
export const next = (
    currNote: ColorNote,
    prevNote: ColorNote,
    bpm: BeatPerMinute,
    context?: ColorNote[]
): boolean => {
    if (
        context &&
        context.length > 0 &&
        bpm.toRealTime(prevNote.time) + 0.005 < bpm.toRealTime(currNote.time) &&
        currNote.direction !== 8
    ) {
        for (const n of context) {
            if (n.direction !== 8 && ColorNote.checkDirection(currNote, n, 90, false)) {
                return true;
            }
        }
    }
    if (context && context.length > 0) {
        for (const other of context) {
            if (currNote.isInline(other)) {
                return true;
            }
        }
    }
    return (
        (isWindow(currNote, prevNote) &&
            bpm.toRealTime(currNote.time - prevNote.time) > 0.08) ||
        bpm.toRealTime(currNote.time - prevNote.time) > 0.07
    );
};

export const calcEBPMBetweenNote = (
    currNote: ColorNote,
    prevNote: ColorNote,
    bpm: number
): number => {
    return bpm / ((currNote.time - prevNote.time) * 2);
};

export const getEffectiveBPMNote = (
    notes: ColorNote[],
    bpm: BeatPerMinute
): NoteEBPM[] => {
    const noteEBPM: NoteEBPM[] = [];
    const lastNote: { [key: number]: NoteEBPM } = {};
    const swingNoteArray: { [key: number]: NoteEBPM[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        if (!isNote(notes[i])) {
            continue;
        }
        const note: NoteEBPM = deepCopy(notes[i]) as NoteEBPM;
        if (lastNote[note.color]) {
            if (next(note, lastNote[note.color], bpm, swingNoteArray[note.color])) {
                note._ebpm = calcEBPMBetweenNote(note, lastNote[note.color], bpm.value);
                noteEBPM.push(note);
                swingNoteArray[note.color] = [];
            }
        }
        lastNote[note.color] = note;
        swingNoteArray[note.color].push(note);
    }
    return noteEBPM;
};

export const getEffectiveBPMSwingNote = (
    notes: ColorNote[],
    bpm: BeatPerMinute
): NoteEBPM[] => {
    const noteEBPM: NoteEBPM[] = [];
    const lastNote: { [key: number]: NoteEBPM } = {};
    const swingNoteArray: { [key: number]: NoteEBPM[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        if (!isNote(notes[i])) {
            continue;
        }
        const note: NoteEBPM = deepCopy(notes[i]) as NoteEBPM;
        if (lastNote[note.color]) {
            if (next(note, lastNote[note.color], bpm, swingNoteArray[note.color])) {
                note._ebpm = calcEBPMBetweenNote(note, lastNote[note.color], bpm.value);
                noteEBPM.push(note);
                lastNote[note.color] = note;
                swingNoteArray[note.color] = [];
            }
        } else {
            lastNote[note.color] = note;
        }
        swingNoteArray[note.color].push(note);
    }
    return noteEBPM;
};

export const getMaxEffectiveBPM = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    return Math.max(...getEffectiveBPMNote(notes, bpm).map((n) => n._ebpm), 0);
};

export const getMaxEffectiveBPMSwing = (
    notes: ColorNote[],
    bpm: BeatPerMinute
): number => {
    return Math.max(...getEffectiveBPMSwingNote(notes, bpm).map((n) => n._ebpm), 0);
};

export const calcMinSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    let hasStraight = false;
    let hasDiagonal = false;
    let curvedSpeed = 0;
    const speed = bpm.toRealTime(
        Math.max(
            ...notes.map((_, i) => {
                if (i === 0) {
                    return 0;
                }
                if (
                    (isHorizontal(notes[i], notes[i - 1]) ||
                        isVertical(notes[i], notes[i - 1])) &&
                    !hasStraight
                ) {
                    hasStraight = true;
                    curvedSpeed =
                        (notes[i].time - notes[i - 1].time) /
                        (distance(notes[i], notes[i - 1]) || 1);
                }
                hasDiagonal =
                    isDiagonal(notes[i], notes[i - 1]) ||
                    isSlantedWindow(notes[i], notes[i - 1]) ||
                    hasDiagonal;
                return (
                    (notes[i].time - notes[i - 1].time) /
                    (distance(notes[i], notes[i - 1]) || 1)
                );
            })
        )
    );
    if (hasStraight && hasDiagonal) {
        return bpm.toRealTime(curvedSpeed);
    }
    return speed;
};

export const calcMaxSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    let hasStraight = false;
    let hasDiagonal = false;
    let curvedSpeed = Number.MAX_SAFE_INTEGER;
    const speed = bpm.toRealTime(
        Math.min(
            ...notes.map((_, i) => {
                if (i === 0) {
                    return Number.MAX_SAFE_INTEGER;
                }
                if (
                    (isHorizontal(notes[i], notes[i - 1]) ||
                        isVertical(notes[i], notes[i - 1])) &&
                    !hasStraight
                ) {
                    hasStraight = true;
                    curvedSpeed =
                        (notes[i].time - notes[i - 1].time) /
                        (distance(notes[i], notes[i - 1]) || 1);
                }
                hasDiagonal =
                    isDiagonal(notes[i], notes[i - 1]) ||
                    isSlantedWindow(notes[i], notes[i - 1]) ||
                    hasDiagonal;
                return (
                    (notes[i].time - notes[i - 1].time) /
                    (distance(notes[i], notes[i - 1]) || 1)
                );
            })
        )
    );
    if (hasStraight && hasDiagonal) {
        return bpm.toRealTime(curvedSpeed);
    }
    return speed;
};

export const getSliderNote = (notes: ColorNote[], bpm: BeatPerMinute): NoteSlider[] => {
    const noteSlider: NoteSlider[] = [];
    const lastNote: { [key: number]: NoteSlider } = {};
    const swingNoteArray: { [key: number]: NoteSlider[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        if (!isNote(notes[i])) {
            continue;
        }
        const note: NoteSlider = deepCopy(notes[i]) as NoteSlider;
        note._minSpeed = 0;
        note._maxSpeed = Number.MAX_SAFE_INTEGER;
        if (lastNote[note.color]) {
            if (next(note, lastNote[note.color], bpm, swingNoteArray[note.color])) {
                const minSpeed = calcMinSliderSpeed(swingNoteArray[note.color], bpm);
                const maxSpeed = calcMaxSliderSpeed(swingNoteArray[note.color], bpm);
                if (minSpeed > 0 && maxSpeed !== Infinity) {
                    lastNote[note.color]._minSpeed = minSpeed;
                    lastNote[note.color]._maxSpeed = maxSpeed;
                    noteSlider.push(lastNote[note.color]);
                }
                lastNote[note.color] = note;
                swingNoteArray[note.color] = [];
            }
        } else {
            lastNote[note.color] = note;
        }
        swingNoteArray[note.color].push(note);
    }
    for (let i = 0; i < 2; i++) {
        if (lastNote[i]) {
            const minSpeed = calcMinSliderSpeed(swingNoteArray[i], bpm);
            const maxSpeed = calcMaxSliderSpeed(swingNoteArray[i], bpm);
            if (minSpeed > 0 && maxSpeed !== Infinity) {
                lastNote[i]._minSpeed = minSpeed;
                lastNote[i]._maxSpeed = maxSpeed;
                noteSlider.push(lastNote[i]);
            }
        }
    }
    return noteSlider;
};

export const getMinSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    return Math.max(...getSliderNote(notes, bpm).map((n) => n._minSpeed), 0);
};

export const getMaxSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    const arr = getSliderNote(notes, bpm).map((n) => n._maxSpeed);
    return arr.length ? Math.min(...arr) : 0;
};

// derived from Uninstaller's Swings Per Second tool
// some variable or function may have been modified
// translating from Python to JavaScript is hard
export const count = (
    notes: ColorNote[],
    duration: number,
    bpm: BeatPerMinute
): ISwingCount => {
    const swingCount: ISwingCount = {
        left: new Array(Math.floor(duration + 1)).fill(0),
        right: new Array(Math.floor(duration + 1)).fill(0),
    };
    let lastRed!: ColorNote;
    let lastBlue!: ColorNote;
    for (let i = 0, len = notes.length; i < len; i++) {
        const note = notes[i];
        const realTime = bpm.toRealTime(note.time);
        if (note.color === 0) {
            if (lastRed) {
                if (next(note, lastRed, bpm)) {
                    swingCount.left[Math.floor(realTime)]++;
                }
            } else {
                swingCount.left[Math.floor(realTime)]++;
            }
            lastRed = note;
        }
        if (note.color === 1) {
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
    difficulty: DifficultyData,
    bpm: BeatPerMinute
): ISwingAnalysis => {
    const interval = 10;
    const spsInfo: ISwingAnalysis = {
        red: { overall: 0, peak: 0, median: 0, total: 0 },
        blue: { overall: 0, peak: 0, median: 0, total: 0 },
        total: { overall: 0, peak: 0, median: 0, total: 0 },
    };
    const duration = Math.max(
        bpm.toRealTime(
            difficulty.getLastInteractiveTime() - difficulty.getFirstInteractiveTime()
        ),
        0
    );
    const mapDuration = Math.max(
        bpm.toRealTime(difficulty.getLastInteractiveTime()),
        0
    );
    const swing = count(difficulty.colorNotes, mapDuration, bpm);
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

export const getProgressionMax = (
    spsArray: ISwingAnalysis[],
    minSPS: number
): ISwingAnalysis | null => {
    let spsPerc = 0;
    let spsCurr = 0;
    for (const spsMap of spsArray) {
        const overall = spsMap.total.overall;
        if (spsCurr > 0 && overall > 0) {
            spsPerc = (1 - spsCurr / overall) * 100;
        }
        spsCurr = overall > 0 ? overall : spsCurr;
        if (spsCurr > minSPS && spsPerc > 40) {
            return spsMap;
        }
    }
    return null;
};

export const getProgressionMin = (
    spsArray: ISwingAnalysis[],
    minSPS: number
): ISwingAnalysis | null => {
    let spsPerc = Number.MAX_SAFE_INTEGER;
    let spsCurr = 0;
    for (const spsMap of spsArray) {
        const overall = spsMap.total.overall;
        if (spsCurr > 0 && overall > 0) {
            spsPerc = (1 - spsCurr / overall) * 100;
        }
        spsCurr = overall > 0 ? overall : spsCurr;
        if (spsCurr > minSPS && spsPerc < 10) {
            return spsMap;
        }
    }
    return null;
};

export const calcSPSTotalPercDrop = (spsArray: ISwingAnalysis[]): number => {
    let highest = 0;
    let lowest = Number.MAX_SAFE_INTEGER;
    spsArray.forEach((spsMap) => {
        const overall = spsMap.total.overall;
        if (overall > 0) {
            highest = Math.max(highest, overall);
            lowest = Math.min(lowest, overall);
        }
    });
    return highest || (highest && lowest) ? (1 - lowest / highest) * 100 : 0;
};

export const getSPSLowest = (spsArray: ISwingAnalysis[]): number => {
    let lowest = Number.MAX_SAFE_INTEGER;
    spsArray.forEach((spsMap) => {
        const overall = spsMap.total.overall;
        if (overall > 0) {
            lowest = Math.min(lowest, overall);
        }
    });
    return lowest;
};
