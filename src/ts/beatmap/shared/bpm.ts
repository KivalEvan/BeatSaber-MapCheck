import { IBPMChange, IBPMChangeOld, IBPMChangeTime } from '../../types/beatmap/shared/bpm';

/** BPM class for various utility around adjusted beat time, JSON time, reaction time, etc. */
export class BeatPerMinute {
    private _bpm: number;
    private _bpmChange: IBPMChangeTime[];
    private _offset: number;

    protected constructor(bpm: number, bpmChange: (IBPMChange | IBPMChangeOld)[] = [], offset: number = 0) {
        this._bpm = bpm;
        this._offset = offset / 1000;
        this._bpmChange = this.getBPMChangeTime([...bpmChange]);
    }

    /** Create and return an instance of BeatPerMinute class.
     * ```ts
     * const BPM = BeatPerMinute.create(bpm, bpmc, 0);
     * ```
     */
    static create = (bpm: number, bpmChange?: (IBPMChange | IBPMChangeOld)[], offset?: number): BeatPerMinute => {
        return new BeatPerMinute(bpm, bpmChange, offset);
    };

    get value(): number {
        return this._bpm;
    }
    set value(val: number) {
        this._bpm = val;
    }
    get change(): IBPMChangeTime[] {
        return this._bpmChange;
    }
    set change(val: IBPMChangeTime[]) {
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
     * const newBPMChange = BPM.getBPMChangeTime(bpmc);
     * ```
     */
    private getBPMChangeTime(bpmc: (IBPMChange | IBPMChangeOld)[] = []): IBPMChangeTime[] {
        let temp!: IBPMChangeTime;
        const bpmChange: IBPMChangeTime[] = [];
        for (let i = 0; i < bpmc.length; i++) {
            const curBPMC: IBPMChangeTime = {
                _BPM: bpmc[i]._BPM ?? bpmc[i]._bpm,
                _time: bpmc[i]._time,
                _beatsPerBar: bpmc[i]._beatsPerBar,
                _metronomeOffset: bpmc[i]._metronomeOffset,
                _newTime: 0,
            };
            if (temp) {
                curBPMC._newTime = Math.ceil(
                    ((curBPMC._time - temp._time) / this._bpm) * temp._BPM + temp._newTime - 0.01,
                );
            } else {
                curBPMC._newTime = Math.ceil(curBPMC._time - (this._offset * this._bpm) / 60 - 0.01);
            }
            bpmChange.push(curBPMC);
            temp = curBPMC;
        }
        return bpmChange;
    }

    /** Adjust beat time by offset.
     * ```ts
     * const removedOffset = BPM.offsetBegone(beat);
     * ```
     */
    private offsetBegone(beat: number): number {
        return ((this.toRealTime(beat) - this._offset) * this._bpm) / 60;
    }

    /** Convert beat time to real-time in second.
     * ```ts
     * const realTime = BPM.toRealTime(beat);
     * ```
     */
    public toRealTime(beat: number): number {
        return (beat / this._bpm) * 60;
    }

    /** Convert real-time in second to beat time.
     * ```ts
     * const beatTime = BPM.toBeatTime(rt);
     * ```
     */
    public toBeatTime(seconds: number): number {
        return (seconds * this._bpm) / 60;
    }

    /** Convert editor beat time to actual JSON time.
     * ```ts
     * const JSONTime = BPM.toJSONTime(beat);
     * ```
     */
    public toJSONTime(beat: number): number {
        for (let i = this._bpmChange.length - 1; i >= 0; i--) {
            if (beat > this._bpmChange[i]._newTime) {
                return (
                    ((beat - this._bpmChange[i]._newTime) / this._bpmChange[i]._BPM) * this._bpm +
                    this._bpmChange[i]._time
                );
            }
        }
        return ((this.toRealTime(beat) + this._offset) * this._bpm) / 60;
    }

    /** Adjust beat time from BPM changes and offset.
     * ```ts
     * const adjustedBeat = BPM.adjustTime(beat);
     * ```
     */
    public adjustTime(beat: number): number {
        for (let i = this._bpmChange.length - 1; i >= 0; i--) {
            if (beat > this._bpmChange[i]._time) {
                return (
                    ((beat - this._bpmChange[i]._time) / this._bpm) * this._bpmChange[i]._BPM +
                    this._bpmChange[i]._newTime
                );
            }
        }
        return this.offsetBegone(beat);
    }
}
