import { BeatPerMinute } from '../shared/bpm';
import { deepCopy, median } from '../../utils';
import {
    ISwingAnalysis,
    ISwingContainer,
    ISwingCount,
} from '../../types/beatmap/analyser/swing';
import { ColorNote } from '../v3/colorNote';
import { DifficultyData } from '../v3/difficulty';
import { NoteContainer } from '../../types/beatmap/v3/container';

export default class Swing implements ISwingContainer {
    time: number;
    duration: number;
    minSwing: number;
    maxSwing: number;
    ebpm: number;
    ebpmSwing: number;
    data: NoteContainer[];

    private constructor() {}

    static create() {
        return new this();
    }

    // Thanks Qwasyx#3000 for improved swing detection
    static next = (
        currNote: ColorNote,
        prevNote: ColorNote,
        bpm: BeatPerMinute,
        context?: NoteContainer[]
    ): boolean => {
        if (
            context &&
            context.length > 0 &&
            bpm.toRealTime(prevNote.time) + 0.005 < bpm.toRealTime(currNote.time) &&
            currNote.direction !== 8
        ) {
            for (const n of context) {
                if (n.type === 'note') {
                    if (
                        n.data.direction !== 8 &&
                        ColorNote.checkDirection(currNote, n.data, 90, false)
                    ) {
                        return true;
                    }
                }
            }
        }
        if (context && context.length > 0) {
            for (const other of context) {
                if (other.type === 'note' && currNote.isInline(other.data)) {
                    return true;
                }
            }
        }
        return (
            (currNote.isWindow(prevNote) &&
                bpm.toRealTime(currNote.time - prevNote.time) > 0.08) ||
            bpm.toRealTime(currNote.time - prevNote.time) > 0.07
        );
    };

    static calcEBPMBetweenNote = (
        currNote: ColorNote,
        prevNote: ColorNote,
        bpm: number
    ): number => {
        return bpm / ((currNote.time - prevNote.time) * 2);
    };

    static getEffectiveBPMNote = (
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
            const note: NoteEBPM = deepCopy(notes[i]) as NoteEBPM;
            if (lastNote[note.color]) {
                if (
                    this.next(
                        note,
                        lastNote[note.color],
                        bpm,
                        swingNoteArray[note.color]
                    )
                ) {
                    note._ebpm = this.calcEBPMBetweenNote(
                        note,
                        lastNote[note.color],
                        bpm.value
                    );
                    noteEBPM.push(note);
                    swingNoteArray[note.color] = [];
                }
            }
            lastNote[note.color] = note;
            swingNoteArray[note.color].push(note);
        }
        return noteEBPM;
    };

    static getEffectiveBPMSwingNote = (
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
                    note._ebpm = this.calcEBPMBetweenNote(
                        note,
                        lastNote[note.color],
                        bpm.value
                    );
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

    static getMaxEffectiveBPM = (notes: ColorNote[], bpm: BeatPerMinute): number => {
        return Math.max(...this.getEffectiveBPMNote(notes, bpm).map((n) => n._ebpm), 0);
    };

    static getMaxEffectiveBPMSwing = (
        notes: ColorNote[],
        bpm: BeatPerMinute
    ): number => {
        return Math.max(...getEffectiveBPMSwingNote(notes, bpm).map((n) => n._ebpm), 0);
    };

    static calcMinSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
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
                        (notes[i].isHorizontal(notes[i - 1]) ||
                            notes[i].isVertical(notes[i - 1])) &&
                        !hasStraight
                    ) {
                        hasStraight = true;
                        curvedSpeed =
                            (notes[i].time - notes[i - 1].time) /
                            (notes[i].getDistance(notes[i - 1]) || 1);
                    }
                    hasDiagonal =
                        notes[i].isDiagonal(notes[i - 1]) ||
                        notes[i].isSlantedWindow(notes[i - 1]) ||
                        hasDiagonal;
                    return (
                        (notes[i].time - notes[i - 1].time) /
                        (notes[i].getDistance(notes[i - 1]) || 1)
                    );
                })
            )
        );
        if (hasStraight && hasDiagonal) {
            return bpm.toRealTime(curvedSpeed);
        }
        return speed;
    };

    static calcMaxSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
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
                        (notes[i].isHorizontal(notes[i - 1]) ||
                            notes[i].isVertical(notes[i - 1])) &&
                        !hasStraight
                    ) {
                        hasStraight = true;
                        curvedSpeed =
                            (notes[i].time - notes[i - 1].time) /
                            (notes[i].getDistance(notes[i - 1]) || 1);
                    }
                    hasDiagonal =
                        notes[i].isDiagonal(notes[i - 1]) ||
                        notes[i].isSlantedWindow(notes[i - 1]) ||
                        hasDiagonal;
                    return (
                        (notes[i].time - notes[i - 1].time) /
                        (notes[i].getDistance(notes[i - 1]) || 1)
                    );
                })
            )
        );
        if (hasStraight && hasDiagonal) {
            return bpm.toRealTime(curvedSpeed);
        }
        return speed;
    };

    static getSliderNote = (notes: ColorNote[], bpm: BeatPerMinute): NoteSlider[] => {
        const noteSlider: NoteSlider[] = [];
        const lastNote: { [key: number]: NoteSlider } = {};
        const swingNoteArray: { [key: number]: NoteSlider[] } = {
            0: [],
            1: [],
        };
        for (let i = 0, len = notes.length; i < len; i++) {
            const note: NoteSlider = deepCopy(notes[i]) as NoteSlider;
            note._minSpeed = 0;
            note._maxSpeed = Number.MAX_SAFE_INTEGER;
            if (lastNote[note.color]) {
                if (
                    this.next(
                        note,
                        lastNote[note.color],
                        bpm,
                        swingNoteArray[note.color]
                    )
                ) {
                    const minSpeed = this.calcMinSliderSpeed(
                        swingNoteArray[note.color],
                        bpm
                    );
                    const maxSpeed = this.calcMaxSliderSpeed(
                        swingNoteArray[note.color],
                        bpm
                    );
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
                const minSpeed = this.calcMinSliderSpeed(swingNoteArray[i], bpm);
                const maxSpeed = this.calcMaxSliderSpeed(swingNoteArray[i], bpm);
                if (minSpeed > 0 && maxSpeed !== Infinity) {
                    lastNote[i]._minSpeed = minSpeed;
                    lastNote[i]._maxSpeed = maxSpeed;
                    noteSlider.push(lastNote[i]);
                }
            }
        }
        return noteSlider;
    };

    static getMinSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
        return Math.max(...this.getSliderNote(notes, bpm).map((n) => n._minSpeed), 0);
    };

    static getMaxSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
        const arr = this.getSliderNote(notes, bpm).map((n) => n._maxSpeed);
        return arr.length ? Math.min(...arr) : 0;
    };

    // derived from Uninstaller's Swings Per Second tool
    // some variable or function may have been modified
    // translating from Python to JavaScript is hard
    static count = (
        noteContainer: NoteContainer[],
        duration: number,
        bpm: BeatPerMinute
    ): ISwingCount => {
        const swingCount: ISwingCount = {
            left: new Array(Math.floor(duration + 1)).fill(0),
            right: new Array(Math.floor(duration + 1)).fill(0),
        };
        let lastRed!: ColorNote;
        let lastBlue!: ColorNote;
        for (const nc of noteContainer) {
            if (nc.type === 'bomb') {
                continue;
            }
            if (nc.data.color === 0) {
                if (lastRed) {
                    if (this.next(nc.data, lastRed, bpm)) {
                        swingCount.left[Math.floor(realTime)]++;
                    }
                } else {
                    swingCount.left[Math.floor(realTime)]++;
                }
                lastRed = nc.data;
            }
            if (nc.data.color === 1) {
                if (lastBlue) {
                    if (this.next(nc.data, lastBlue, bpm)) {
                        swingCount.right[Math.floor(realTime)]++;
                    }
                } else {
                    swingCount.right[Math.floor(realTime)]++;
                }
                lastBlue = nc.data;
            }
        }
        return swingCount;
    };

    private static calcMaxRollingSPS = (swingArray: number[], x: number): number => {
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

    static info = (difficulty: DifficultyData, bpm: BeatPerMinute): ISwingAnalysis => {
        const interval = 10;
        const spsInfo: ISwingAnalysis = {
            red: { count: 0, peak: 0, median: 0, total: 0 },
            blue: { count: 0, peak: 0, median: 0, total: 0 },
            total: { count: 0, peak: 0, median: 0, total: 0 },
            container: [],
        };
        const duration = Math.max(
            bpm.toRealTime(
                difficulty.getLastInteractiveTime() -
                    difficulty.getFirstInteractiveTime()
            ),
            0
        );
        const mapDuration = Math.max(
            bpm.toRealTime(difficulty.getLastInteractiveTime()),
            0
        );
        const swing = this.count(difficulty.getNoteContainer(), mapDuration, bpm);
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
        spsInfo.red.count = swing.left.reduce((a, b) => a + b) / duration;
        spsInfo.red.peak = this.calcMaxRollingSPS(swing.left, interval);
        spsInfo.red.median = median(swingIntervalRed);
        spsInfo.blue.total = swing.right.reduce((a, b) => a + b);
        spsInfo.blue.count = swing.right.reduce((a, b) => a + b) / duration;
        spsInfo.blue.peak = this.calcMaxRollingSPS(swing.right, interval);
        spsInfo.blue.median = median(swingIntervalBlue);
        spsInfo.total.total = spsInfo.red.total + spsInfo.blue.total;
        spsInfo.total.count = swingTotal.reduce((a, b) => a + b) / duration;
        spsInfo.total.peak = this.calcMaxRollingSPS(swingTotal, interval);
        spsInfo.total.median = median(swingIntervalTotal);

        return spsInfo;
    };

    static getProgressionMax = (
        spsArray: ISwingAnalysis[],
        minSPS: number
    ): ISwingAnalysis | null => {
        let spsPerc = 0;
        let spsCurr = 0;
        for (const spsMap of spsArray) {
            const overall = spsMap.total.count;
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

    static getProgressionMin = (
        spsArray: ISwingAnalysis[],
        minSPS: number
    ): ISwingAnalysis | null => {
        let spsPerc = Number.MAX_SAFE_INTEGER;
        let spsCurr = 0;
        for (const spsMap of spsArray) {
            const overall = spsMap.total.count;
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

    static calcSPSTotalPercDrop = (spsArray: ISwingAnalysis[]): number => {
        let highest = 0;
        let lowest = Number.MAX_SAFE_INTEGER;
        spsArray.forEach((spsMap) => {
            const overall = spsMap.total.count;
            if (overall > 0) {
                highest = Math.max(highest, overall);
                lowest = Math.min(lowest, overall);
            }
        });
        return highest || (highest && lowest) ? (1 - lowest / highest) * 100 : 0;
    };

    static getSPSLowest = (spsArray: ISwingAnalysis[]): number => {
        let lowest = Number.MAX_SAFE_INTEGER;
        spsArray.forEach((spsMap) => {
            const overall = spsMap.total.count;
            if (overall > 0) {
                lowest = Math.min(lowest, overall);
            }
        });
        return lowest;
    };
}
