import { BeatPerMinute } from './bpm';

export class NoteJumpSpeed {
    private _bpm: BeatPerMinute;
    private _njs: number;
    private _sdm: number;
    private _hjd!: number;
    private static readonly HJD_START: number = 4;
    private static readonly HJD_MIN: number = 0.25;
    private _jd!: number;
    private _jdMin!: number;
    private _reactionTime!: number;

    constructor(bpm: BeatPerMinute, njs: number = 10, sdm: number = 0) {
        this._bpm = bpm;
        this._njs = njs;
        this._sdm = sdm;
        this.update();
    }

    set value(val: number) {
        this._njs = val;
        this.update();
    }
    get value(): number {
        return this._njs;
    }
    set offset(val: number) {
        this._sdm = val;
        this.update();
    }
    get offset(): number {
        return this._sdm;
    }
    get hjd(): number {
        return this._hjd;
    }
    get hjdMin(): number {
        return NoteJumpSpeed.HJD_MIN;
    }
    get reactTime(): number {
        return this._reactionTime;
    }
    get jd(): number {
        return this._jd;
    }
    get jdMin(): number {
        return this._jdMin;
    }

    private update(): void {
        this._hjd = this.calcHalfJumpDuration();
        this._jd = this.calcJumpDistance();
        this._jdMin = this.calcJumpDistance(NoteJumpSpeed.HJD_MIN);
        this._reactionTime = this.calcReactionTimeFromHJD();
    }
    public calcHalfJumpDurationRaw(): number {
        const maxHalfJump = 18;
        const noteJumpMovementSpeed = (this._njs * this._njs) / this._njs;
        const num = 60 / this._bpm.value;
        let hjd = NoteJumpSpeed.HJD_START;
        while (noteJumpMovementSpeed * num * hjd > maxHalfJump) {
            hjd /= 2;
        }
        if (hjd < 1) {
            hjd = 1;
        }
        return hjd;
    }
    public calcHalfJumpDuration(offset: number = this.offset): number {
        return Math.max(this.calcHalfJumpDurationRaw() + offset, NoteJumpSpeed.HJD_MIN);
    }
    public calcHalfJumpDurationFromJD(jd: number = this.calcJumpDistance()): number {
        return jd / ((60 / this._bpm.value) * this._njs * 2);
    }
    public calcHalfJumpDurationFromRT(
        rt: number = this.calcReactionTimeFromHJD()
    ): number {
        return rt / (60 / this._bpm.value);
    }
    public calcJumpDistance(hjd: number = this.calcHalfJumpDuration()): number {
        return this._njs * (60 / this._bpm.value) * hjd * 2;
    }
    public calcJumpDistanceOptimalHigh(): number {
        return 18 * (1 / 1.07) ** this._njs + 18;
    }
    public calcJumpDistanceOptimalLow(): number {
        return -(18 / (this._njs + 1)) + 18;
    }
    public calcReactionTimeFromJD(jd: number = this.calcJumpDistance()): number {
        return jd / (2 * this._njs);
    }
    public calcReactionTimeFromHJD(hjd: number = this.calcHalfJumpDuration()): number {
        return (60 / this._bpm.value) * hjd;
    }
    public calcDistance(beat: number): number {
        return ((this._njs * 60) / this._bpm.value) * beat * 2;
    }
}

export const create = (
    bpm: BeatPerMinute,
    njs: number = 10,
    sdm: number = 0
): NoteJumpSpeed => {
    return new NoteJumpSpeed(bpm, njs, sdm);
};

export enum FallbackNJS {
    'ExpertPlus' = 16,
    'Expert' = 12,
    'Hard' = 10,
    'Normal' = 10,
    'Easy' = 10,
}
