export interface BPMChange {
    _time: number;
    _BPM: number;
    _bpm?: number;
    _beatsPerBar?: number;
    _metronomeOffset?: number;
}

export interface BPMChangeTime extends BPMChange {
    _newTime: number;
}

export class BeatPerMinute {
    private _bpm: number;
    private _bpmChange: BPMChangeTime[];
    private _offset: number;

    constructor(bpm: number, bpmChange: BPMChange[] = [], offset: number = 0) {
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
    set change(val: BPMChange[] | BPMChangeTime[]) {
        this._bpmChange = this.getBPMChangeTime([...val]);
    }
    get offset(): number {
        return this._offset * 1000;
    }
    set offset(val: number) {
        this._offset = val / 1000;
    }

    private getBPMChangeTime(bpmc: BPMChange[] = []): BPMChangeTime[] {
        let temp!: BPMChangeTime;
        const bpmChange: BPMChangeTime[] = [];
        for (let i = 0; i < bpmc.length; i++) {
            let curBPMC: BPMChangeTime = {
                _BPM: bpmc[i]._BPM ?? bpmc[i]._bpm,
                _time: bpmc[i]._time,
                _newTime: 0,
            };
            if (temp) {
                curBPMC._newTime = Math.ceil(
                    ((curBPMC._time - temp._time) / this._bpm) * temp._BPM + temp._newTime - 0.01
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
    private offsetBegone(beat: number): number {
        return ((this.toRealTime(beat) - this._offset) * this._bpm) / 60;
    }
    public toRealTime(beat: number): number {
        return (beat / this._bpm) * 60;
    }
    public toBeatTime(num: number): number {
        return (num * this._bpm) / 60;
    }
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

export const create = (bpm: number, bpmChange?: BPMChange[], offset?: number): BeatPerMinute => {
    return new BeatPerMinute(bpm, bpmChange, offset);
};
