import { DifficultyName } from '../../types/beatmap/shared/difficulty';
import { BeatPerMinute } from './bpm';

/** NJS class for various utility around jump distance, reaction time, etc. */
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

    private constructor(bpm: BeatPerMinute, njs: number = 10, sdm: number = 0) {
        this._bpm = bpm;
        this._njs = njs;
        this._sdm = sdm;
        this.update();
    }

    /** Create and return new instance of NJS class.
     * ```ts
     * const NJS = NoteJumpSpeed.create(BPM ?? 128, 16, 0);
     * ```
     */
    static create = (bpm: BeatPerMinute | number, njs = 10, sdm = 0): NoteJumpSpeed => {
        if (typeof bpm === 'number') {
            return new NoteJumpSpeed(BeatPerMinute.create(bpm), njs, sdm);
        } else {
            return new NoteJumpSpeed(bpm, njs, sdm);
        }
    };

    /** Fallback value used if NJS value is null or 0.
     * ```ts
     * 'ExpertPlus' -> 16,
     * 'Expert' -> 12,
     * 'Hard' -> 10,
     * 'Normal' -> 10,
     * 'Easy' -> 10
     * ```
     */
    static FallbackNJS: Record<DifficultyName, number> = {
        ExpertPlus: 16,
        Expert: 12,
        Hard: 10,
        Normal: 10,
        Easy: 10,
    };

    get value(): number {
        return this._njs;
    }
    set value(val: number) {
        this._njs = val;
        this.update();
    }

    get offset(): number {
        return this._sdm;
    }
    set offset(val: number) {
        this._sdm = val;
        this.update();
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
        this._hjd = this.calcHJD();
        this._jd = this.calcJD();
        this._jdMin = this.calcJD(NoteJumpSpeed.HJD_MIN);
        this._reactionTime = this.calcRTFromHJD();
    }

    /** Calculate raw half jump duration
     * ```ts
     * const rawHJD = NJS.calcHalfJumpDurationRaw();
     * ```
     */
    public calcHJDRaw(): number {
        const maxHalfJump = 17.999; // Beat Games, this is not how you fix float inconsistencies
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

    /** Calculate half jump duration given NJS offset
     * ```ts
     * const HJD = NJS.calcHalfJumpDuration();
     * const HJDOffset = NJS.calcHalfJumpDuration(0.5);
     * ```
     */
    public calcHJD(offset: number = this.offset): number {
        return Math.max(this.calcHJDRaw() + offset, NoteJumpSpeed.HJD_MIN);
    }

    /** Calculate half jump duration given jump distance.
     * ```ts
     * const HJD = NJS.calcHalfJumpDurationFromJD();
     * const HJDSpecified = NJS.calcHalfJumpDurationFromJD(21);
     * ```
     */
    public calcHJDFromJD(jd: number = this.calcJD()): number {
        return jd / ((60 / this._bpm.value) * this._njs * 2);
    }

    /** Calculate half jump duration given real time in second.
     * ```ts
     * const HJD = NJS.calcHalfJumpDurationFromRT();
     * const HJDSpecified = NJS.calcHalfJumpDurationFromRT(4.5);
     * ```
     */
    public calcHJDFromRT(rt: number = this.calcRTFromHJD()): number {
        return rt / (60 / this._bpm.value);
    }

    /** Calculate jump distance given half jump duration.
     * ```ts
     * const JD = NJS.calcJumpDistance();
     * const JDSpecified = NJS.calcJumpDistance(1.5);
     * ```
     */
    public calcJD(hjd: number = this.calcHJD()): number {
        return this._njs * (60 / this._bpm.value) * hjd * 2;
    }

    /** Calculate highest optimal jump distance.
     * ```ts
     * const optimalHighJD = NJS.calcJumpDistanceOptimalHigh();
     * ```
     */
    public calcJDOptimalHigh(): number {
        return 18 * (1 / 1.07) ** this._njs + 18;
    }

    /** Calculate lowest optimal jump distance.
     * ```ts
     * const optimalLowJD = NJS.calcJumpDistanceOptimalLow();
     * ```
     */
    public calcJDOptimalLow(): number {
        return -(18 / (this._njs + 1)) + 18;
    }

    /** Calculate reaction time given jump distance.
     * ```ts
     * const JD = NJS.calcReactionTimeFromJD();
     * const JDSpecified = NJS.calcReactionTimeFromJD(21);
     * ```
     */
    public calcRTFromJD(jd: number = this.calcJD()): number {
        return jd / (2 * this._njs);
    }

    /** Calculate reaction time given half jump duration.
     * ```ts
     * const JD = NJS.calcReactionTimeFromHJD();
     * const JDSpecified = NJS.calcReactionTimeFromHJD(1.5);
     * ```
     */
    public calcRTFromHJD(hjd: number = this.calcHJD()): number {
        return (60 / this._bpm.value) * hjd;
    }

    /** Calculate distance given beat.
     * ```ts
     * const distance = NJS.calcDistance(1);
     * ```
     */
    public calcDistance(beat: number): number {
        return ((this._njs * 60) / this._bpm.value) * beat * 2;
    }
}
