/**
 * Beatmap difficulty custom data interface for BPM Change.
 *
 *     _time: float,
 *     _BPM: float,
 *     _beatsPerBar: int,
 *     _metronomeOffset: float
 */
export interface BPMChange {
    _time: number;
    _bpm?: never;
    _BPM: number;
    _beatsPerBar: number;
    _metronomeOffset: number;
}

/**
 * Beatmap difficulty custom data interface for MediocreMapper BPM Change.
 *
 *     _time: float,
 *     _bpm: float,
 *     _beatsPerBar: int,
 *     _metronomeOffset: float
 */
export interface BPMChangeOld {
    _time: number;
    _bpm: number;
    _BPM: never;
    _beatsPerBar: number;
    _metronomeOffset: number;
}

/**
 * @extends BPMChange
 *
 *     _newTime: float,
 */
export interface BPMChangeTime extends BPMChange {
    _newTime: number;
}

/**
 * Class to store beat per minute value, BPM changes, and other properties affecting BPM.
 */
export class BeatPerMinute {
    private _bpm: number;
    private _bpmChange: BPMChangeTime[];
    private _offset: number;

    constructor(
        bpm: number,
        bpmChange: (BPMChange | BPMChangeOld)[] = [],
        offset: number = 0
    ) {
        this._bpm = bpm;
        this._offset = offset / 1000;
        this._bpmChange = this.getBPMChangeTime([...bpmChange]);
    }

    get value(): number {
        return this._bpm;
    }
    set value(val: number) {
        this._bpm = val;
    }
    get change(): BPMChangeTime[] {
        return this._bpmChange;
    }
    set change(val: BPMChangeTime[]) {
        this._bpmChange = this.getBPMChangeTime([...val]);
    }
    get offset(): number {
        return this._offset * 1000;
    }
    set offset(val: number) {
        this._offset = val / 1000;
    }

    /**
     * Create new BPM change object that allow time to be read according to editor.
     * @param {(BPMChange | BPMChangeOld)[]} bpmc - Array of BPM change
     * @returns {BPMChangeTime[]} Array of new BPM change
     */
    private getBPMChangeTime(bpmc: (BPMChange | BPMChangeOld)[] = []): BPMChangeTime[] {
        let temp!: BPMChangeTime;
        const bpmChange: BPMChangeTime[] = [];
        for (let i = 0; i < bpmc.length; i++) {
            const curBPMC: BPMChangeTime = {
                _BPM: bpmc[i]._BPM ?? bpmc[i]._bpm,
                _time: bpmc[i]._time,
                _beatsPerBar: bpmc[i]._beatsPerBar,
                _metronomeOffset: bpmc[i]._metronomeOffset,
                _newTime: 0,
            };
            if (temp) {
                curBPMC._newTime = Math.ceil(
                    ((curBPMC._time - temp._time) / this._bpm) * temp._BPM +
                        temp._newTime -
                        0.01
                );
            } else {
                curBPMC._newTime = Math.ceil(
                    curBPMC._time - (this._offset * this._bpm) / 60 - 0.01
                );
            }
            bpmChange.push(curBPMC);
            temp = curBPMC;
        }
        return bpmChange;
    }

    /**
     * Adjust beat time by offset.
     * @param {number} beat - Beat time
     * @returns {number} Adjusted beat time
     */
    private offsetBegone(beat: number): number {
        return ((this.toRealTime(beat) - this._offset) * this._bpm) / 60;
    }

    /**
     * Change beat time to real time in second.
     * @param {number} beat - Beat time
     * @returns {number} Real time second
     */
    public toRealTime(beat: number): number {
        return (beat / this._bpm) * 60;
    }

    /**
     * Change real time in second to beat time.
     * @param {number} num - Real time second
     * @returns {number} Beat time
     */
    public toBeatTime(num: number): number {
        return (num * this._bpm) / 60;
    }

    /**
     * Adjust beat time from BPM changes and offset.
     * @param {number} beat - Beat time
     * @returns {number} Adjusted beat time
     */
    public adjustTime(beat: number): number {
        for (let i = this._bpmChange.length - 1; i >= 0; i--) {
            if (beat > this._bpmChange[i]._time) {
                return (
                    ((beat - this._bpmChange[i]._time) / this._bpm) *
                        this._bpmChange[i]._BPM +
                    this._bpmChange[i]._newTime
                );
            }
        }
        return this.offsetBegone(beat);
    }
}

/**
 * Create and return an instance of BeatPerMinute class.
 * @param {number} bpm - BPM value
 * @param {(BPMChange|BPMChangeOld)[]} bpmChange - Array of BPM change
 * @param {number} offset - Editor offset
 * @returns {BeatPerMinute} BeatPerMinute class
 */
export const create = (
    bpm: number,
    bpmChange?: (BPMChange | BPMChangeOld)[],
    offset?: number
): BeatPerMinute => {
    return new BeatPerMinute(bpm, bpmChange, offset);
};
