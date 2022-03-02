import { BaseObject } from './baseObject';

/** Waypoint beatmap object. */
export interface Waypoint extends BaseObject {
    /** Position x `<int>` of waypoint.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `unknown`
     */
    x: number;
    /** Position y `<int>` of waypoint.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `unknown`
     */
    y: number;
    /** Offset direction `<int>` of waypoint. */
    d: number;
}
