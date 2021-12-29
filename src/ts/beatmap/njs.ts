import { BeatPerMinute } from './bpm';

/**
 * Class to store NJS value, BPM, and other properties affecting NJS.
 */
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

    /**
     * Calculate raw half jump duration
     * @returns {number} Half jump duration
     */
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

    /**
     * Calculate half jump duration given NJS offset
     * @param {number} [offset=this.offset] - NJS offset value
     * @returns {number} Half jump duration
     */
    public calcHalfJumpDuration(offset: number = this.offset): number {
        return Math.max(this.calcHalfJumpDurationRaw() + offset, NoteJumpSpeed.HJD_MIN);
    }

    /**
     * Calculate half jump duration given jump distance.
     * @param {number} [jd=this.calcJumpDistance()] - Jump distance
     * @returns {number} Half jump duration
     */
    public calcHalfJumpDurationFromJD(jd: number = this.calcJumpDistance()): number {
        return jd / ((60 / this._bpm.value) * this._njs * 2);
    }

    /**
     * Calculate half jump duration given real time in second.
     * @param {number} [rt=this.calcReactionTimeFromHJD()] - Real time in second
     * @returns {number} Half jump duration
     */
    public calcHalfJumpDurationFromRT(
        rt: number = this.calcReactionTimeFromHJD()
    ): number {
        return rt / (60 / this._bpm.value);
    }

    /**
     * Calculate jump distance given half jump duration.
     * @param {number} [hjd=this.calcHalfJumpDuration()] - Half jump duration
     * @returns {number} Jump distance
     */
    public calcJumpDistance(hjd: number = this.calcHalfJumpDuration()): number {
        return this._njs * (60 / this._bpm.value) * hjd * 2;
    }

    /**
     * Calculate highest optimal jump distance.
     * @returns {number} Highest optimal jump distance
     */
    public calcJumpDistanceOptimalHigh(): number {
        return 18 * (1 / 1.07) ** this._njs + 18;
    }

    /**
     * Calculate lowest optimal jump distance.
     * @returns {number} Lowest optimal jump distance
     */
    public calcJumpDistanceOptimalLow(): number {
        return -(18 / (this._njs + 1)) + 18;
    }

    /**
     * Calculate reaction time given jump distance.
     * @param {number} [jd=this.calcJumpDistance()] - Jump distance
     * @returns {number} Reaction time
     */
    public calcReactionTimeFromJD(jd: number = this.calcJumpDistance()): number {
        return jd / (2 * this._njs);
    }

    /**
     * Calculate reaction time given half jump duration.
     * @param {number} [hjd=this.calcHalfJumpDuration()] - Half jump duration
     * @returns {number} Reaction time
     */
    public calcReactionTimeFromHJD(hjd: number = this.calcHalfJumpDuration()): number {
        return (60 / this._bpm.value) * hjd;
    }

    /**
     * Calculate distance given beat.
     * @param {number} beat - Beat time
     * @returns {number} Jump distance
     */
    public calcDistance(beat: number): number {
        return ((this._njs * 60) / this._bpm.value) * beat * 2;
    }
}

/**
 * Create and return new instance of NJS class.
 * @param {BeatPerMinute} bpm - BeatPerMinute class
 * @param {number} [njs=10] - NJS value
 * @param {number} [sdm=0] - NJS offset value
 * @returns {NoteJumpSpeed} NoteJumpSpeed class
 */
export const create = (bpm: BeatPerMinute, njs = 10, sdm = 0): NoteJumpSpeed => {
    return new NoteJumpSpeed(bpm, njs, sdm);
};

/**
 * Fallback value used if NJS value is null or 0.
 *
 *     'ExpertPlus' -> 16,
 *     'Expert' -> 12,
 *     'Hard' -> 10,
 *     'Normal' -> 10,
 *     'Easy' -> 10
 */
export enum FallbackNJS {
    'ExpertPlus' = 16,
    'Expert' = 12,
    'Hard' = 10,
    'Normal' = 10,
    'Easy' = 10,
}
