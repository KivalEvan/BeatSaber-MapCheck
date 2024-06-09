import type { NoteColor } from '../shared/constants.ts';
import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';
import type { GetAngleFn, GetPositionFn } from '../shared/functions.ts';

export interface IWrapBaseNoteAttribute extends IWrapGridObjectAttribute {
   /**
    * Color `<int>` of note.
    * ```ts
    * -1 -> None
    * 0 -> Red
    * 1 -> Blue
    * ```
    */
   color: NoteColor;
   /**
    * Cut direction `<int>` of note.
    * ```ts
    * 4 | 0 | 5
    * 2 | 8 | 3
    * 6 | 1 | 7
    * ```
    *
    * Grid represents cut direction from center.
    *
    * **WARNING:** Dot-directional is not recommended with arcs, assumes down-directional.
    */
   direction: number;
}

export interface IWrapBaseNote extends IWrapGridObject, IWrapBaseNoteAttribute {
   setColor(value: NoteColor): this;
   setDirection(value: number): this;

   /**
    * Get standardised note angle.
    *
    * @example
    * ```ts
    * import type { IWrapBaseNote } from './baseNote.ts';
    * let note!: IBaseNote;
    * const optionalFn = (object: IWrapBaseNote) => object.customData.value;
    * const tailAngle = note.getTailAngle(optionalFn);
    * ```
    *
    * Custom function are used to return any arbitrary data first if value exist, otherwise returns base value.
    */
   getAngle(fn?: GetAngleFn<this>): number;

   /**
    * Check if note is red note.
    * ```ts
    * if (note.isBlue()) {}
    * ```
    */
   isRed(): boolean;

   /**
    * Check if note is blue note.
    * ```ts
    * if (note.isBlue()) {}
    * ```
    */
   isBlue(): boolean;

   /**
    * Compare current note with the note ahead of it and return if the notes is a double.
    * ```ts
    * if (note.isDouble(otherNote, tol, optionalFn)) {}
    * ```
    */
   isDouble(compareTo: this, tolerance: number, fn?: GetPositionFn<this>): boolean;
}
