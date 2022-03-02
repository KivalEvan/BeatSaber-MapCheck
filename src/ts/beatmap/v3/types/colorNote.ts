import { BaseObject } from './baseObject';

/** Color note beatmap object. */
export interface ColorNote extends BaseObject {
    /** Position x `<int>` of note.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    x: number;
    /** Position y `<int>` of note.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    y: number;
    /** Color type `<int>` of note.
     * ```ts
     * 0 -> Red
     * 1 -> Blue
     * ```
     */
    c: 0 | 1;
    /** Cut direction `<int>` of note.
     * ```ts
     * 6 | 1 | 7
     * 2 | 8 | 3
     * 4 | 0 | 5
     * ```
     * ---
     * Grid represents cut direction from center.
     */
    d: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    /** Angle offset `<int>` of note.*/
    a: number;
}
