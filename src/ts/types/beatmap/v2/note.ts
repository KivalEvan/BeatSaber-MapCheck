import { ICustomDataNote } from './custom/note';
import { IBaseObject } from './object';

/** Beatmap object interface for Note. */
export interface INote extends IBaseObject {
   /**
    * Note placement on column.
    * ```ts
    * 0 -> Outer Left
    * 1 -> Middle Left
    * 2 -> Middle Right
    * 3 -> Outer Right
    * ```
    */
   _lineIndex: number;
   /**
    * Note placement on row.
    * ```ts
    * 0 -> Bottom row
    * 1 -> Middle row
    * 2 -> Top row
    * ```
    */
   _lineLayer: number;
   /**
    * Type of note.
    * ```ts
    * 0 -> Red note
    * 1 -> Blue note
    * 3 -> Bomb
    * ```
    */
   _type: 0 | 1 | 3;
   /**
    * Cut direction of note.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    */
   _cutDirection: number;
   _customData?: ICustomDataNote;
}
