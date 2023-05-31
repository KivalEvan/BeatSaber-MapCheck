// deno-lint-ignore-file no-explicit-any
import { ModType } from '../shared/modCheck';
import { IWrapGridObject, IWrapGridObjectAttribute } from './gridObject';

export interface IWrapBaseNoteAttribute<T extends { [P in keyof T]: T[P] } = Record<string, any>>
    extends IWrapGridObjectAttribute<T> {
    /** Color `<int>` of note.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    color: 0 | 1;
    /** Cut direction `<int>` of note.
     * ```ts
     * 4 | 0 | 5
     * 2 | 8 | 3
     * 6 | 1 | 7
     * ```
     * ---
     * Grid represents cut direction from center.
     *
     * **WARNING:** Dot-directional is not recommended with arcs, assumes down-directional.
     */
    direction: number;
}

export interface IWrapBaseNote<T extends { [P in keyof T]: T[P] } = Record<string, any>>
    extends IWrapGridObject<T>,
        IWrapBaseNoteAttribute<T> {
    setColor(value: 0 | 1): this;
    setDirection(value: number): this;

    /** Swap note rotation with another note.
     * ```ts
     * note.swapRotation(noteSwap);
     * ```
     */
    swapRotation(toSwap: IWrapBaseNote, mirrorAngle: boolean): this;

    /** Get note and return standardised note angle.
     * ```ts
     * const noteAngle = note.getAngle();
     * ```
     */
    getAngle(type?: ModType): number;

    /** Check if note is red note.
     * ```ts
     * if (note.isBlue()) {}
     * ```
     */
    isRed(): boolean;

    /** Check if note is blue note.
     * ```ts
     * if (note.isBlue()) {}
     * ```
     */
    isBlue(): boolean;

    /** Check if note has a valid cut direction.
     * ```ts
     * if (note.isValidDirection()) {}
     * ```
     */
    isValidDirection(): boolean;
}
