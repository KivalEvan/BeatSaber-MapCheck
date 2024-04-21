import type { DifficultyName } from '../../types/beatmap/shared/difficulty.ts';
import { BeatPerMinute } from './bpm.ts';

/** NJS class for various utility around jump distance, reaction time, etc. */
export class NoteJumpSpeed {
   static readonly HJD_START: number = 4;
   static readonly HJD_MIN: number = 0.25;

   private _bpm: BeatPerMinute;
   private _njs: number;
   private _sdm: number;

   constructor(bpm: BeatPerMinute | number, njs = 10, sdm = 0) {
      this._bpm = typeof bpm === 'number' ? new BeatPerMinute(bpm) : bpm;
      this._njs = njs;
      this._sdm = sdm;
   }

   /**
    * Create and return new instance of NJS class.
    * ```ts
    * const njs = NoteJumpSpeed.create(BPM ?? 128, 16, 0);
    * ```
    */
   static create(bpm: BeatPerMinute | number, njs?: number, sdm?: number): NoteJumpSpeed {
      return new NoteJumpSpeed(bpm, njs, sdm);
   }

   /**
    * Fallback value used if NJS value is null or 0.
    * ```ts
    * 'ExpertPlus' -> 16,
    * 'Expert' -> 12,
    * 'Hard' -> 10,
    * 'Normal' -> 10,
    * 'Easy' -> 10
    * ```
    */
   static readonly FallbackNJS: { readonly [key in DifficultyName]: number } = {
      ExpertPlus: 16,
      Expert: 12,
      Hard: 10,
      Normal: 10,
      Easy: 10,
   } as const;

   get value(): number {
      return this._njs;
   }
   set value(val: number) {
      this._njs = val;
   }

   get offset(): number {
      return this._sdm;
   }
   set offset(val: number) {
      this._sdm = val;
   }

   get hjd(): number {
      return this.calcHjd();
   }
   get jd(): number {
      return this.calcJd();
   }
   get reactionTime(): number {
      return this.calcRtFromHjd();
   }
   get bpm(): BeatPerMinute {
      return this._bpm;
   }

   /**
    * Calculate half jump duration given NJS offset.
    * ```ts
    * const hjd = njs.calcHjd();
    * const hjdOffset = njs.calcHjd(0.5);
    * const hjdNoOffset = njs.calcHjd(0);
    * ```
    */
   calcHjd(offset: number = this.offset): number {
      const maxHalfJump = 17.999; // Beat Games, this is not how you fix float inconsistencies
      const num = 60 / this._bpm.value;
      let hjd = NoteJumpSpeed.HJD_START;
      while (this._njs * num * hjd > maxHalfJump) hjd /= 2;
      if (hjd < 1) hjd = 1;

      return Math.max(hjd + offset, NoteJumpSpeed.HJD_MIN);
   }

   /**
    * Calculate half jump duration given jump distance.
    * ```ts
    * const hjd = njs.calcHjdFromJd();
    * const hjdSpecified = njs.calcHjdFromJd(21);
    * ```
    */
   calcHjdFromJd(jd: number = this.calcJd()): number {
      return jd / ((60 / this._bpm.value) * this._njs * 2);
   }

   /**
    * Calculate half jump duration given real time in second.
    * ```ts
    * const hjd = njs.calcHjdFromRt();
    * const hjdSpecified = njs.calcHjdFromRt(4.5);
    * ```
    */
   calcHjdFromRt(rt: number = this.calcRtFromHjd()): number {
      return rt / (60 / this._bpm.value);
   }

   /**
    * Calculate jump distance given half jump duration.
    * ```ts
    * const jd = njs.calcJd();
    * const jdSpecified = njs.calcJd(1.5);
    * ```
    */
   calcJd(hjd: number = this.calcHjd()): number {
      return this._njs * (60 / this._bpm.value) * hjd * 2;
   }

   /**
    * Calculate optimal jump distance.
    * ```ts
    * const [lowJd, highJd] = njs.calcJdOptimal();
    * ```
    */
   calcJdOptimal(): [low: number, high: number] {
      return [-(18 / (this._njs + 1)) + 18, 18 * (1 / 1.07) ** this._njs + 18];
   }

   /**
    * Calculate reaction time given jump distance.
    * ```ts
    * const rt = njs.calcRtFromJd();
    * const rtSpecified = njs.calcRtFromJd(21);
    * ```
    */
   calcRtFromJd(jd: number = this.calcJd()): number {
      return jd / (2 * this._njs);
   }

   /**
    * Calculate reaction time given half jump duration.
    * ```ts
    * const rt = njs.calcRtFromHjd();
    * const rtSpecified = njs.calcRtFromHjd(1.5);
    * ```
    */
   calcRtFromHjd(hjd: number = this.calcHjd()): number {
      return (60 / this._bpm.value) * hjd;
   }

   /**
    * Calculate unity distance given beat.
    * ```ts
    * const distance = njs.calcDistance(1);
    * ```
    */
   calcDistance(beat: number): number {
      return ((this._njs * 60) / this._bpm.value) * beat * 2;
   }
}
