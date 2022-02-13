import { BPMChange, BPMChangeOld, BPMChangeTime } from './types/bpm';

/** Class to store beat per minute value, BPM changes, and other properties affecting BPM. */
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

    /** Create new BPM change object that allow time to be read according to editor.
     * ```ts
     * const newBPMChange = getBPMChangeTime(bpmc);
     * ```
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

    /** Adjust beat time by offset.
     * ```ts
     * const removedOffset = offsetBegone(beat);
     * ```
     */
    private offsetBegone(beat: number): number {
        return ((this.toRealTime(beat) - this._offset) * this._bpm) / 60;
    }

    /** Change beat time to real time in second.
     * ```ts
     * const realTime = toRealTime(beat);
     * ```
     */
    public toRealTime(beat: number): number {
        return (beat / this._bpm) * 60;
    }

    /** Change real time in second to beat time.
     * ```ts
     * const beatTime = toBeatTime(rt);
     * ```
     */
    public toBeatTime(seconds: number): number {
        return (seconds * this._bpm) / 60;
    }

    /** Adjust beat time from BPM changes and offset.
     * ```ts
     * const adjustedBeat = adjustTime(beat);
     * ```
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

/** Create and return an instance of BeatPerMinute class.
 * ```ts
 * const BPM = create(bpm, bpmc, 0);
 * ```
 */
export const create = (
    bpm: number,
    bpmChange?: (BPMChange | BPMChangeOld)[],
    offset?: number
): BeatPerMinute => {
    return new BeatPerMinute(bpm, bpmChange, offset);
};
