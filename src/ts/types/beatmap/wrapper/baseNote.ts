// deno-lint-ignore-file no-explicit-any
import type { NoteColor } from '../shared/constants.ts';
import type { ModType } from '../shared/modCheck.ts';
import type { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject.ts';

export interface IWrapBaseNoteAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObjectAttribute<T> {
   /**
    * Color `<int>` of note.
    * ```ts
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

export interface IWrapBaseNote<T extends { [P in keyof T]: T[P] } = Record<string, any>>
   extends IWrapGridObject<T>,
      IWrapBaseNoteAttribute<T> {
   setColor(value: NoteColor): this;
   setDirection(value: number): this;

   /**
    * Get note and return standardised note angle.
    * ```ts
    * const noteAngle = note.getAngle();
    * ```
    */
   getAngle(type?: ModType): number;

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
    * if (note.isDouble(otherNote, tol)) {}
    * ```
    */
   isDouble(compareTo: IWrapBaseNote, tolerance: number): boolean;

   /**
    * Check if note has a valid cut direction.
    * ```ts
    * if (note.isValidDirection()) {}
    * ```
    */
   isValidDirection(): boolean;
}
